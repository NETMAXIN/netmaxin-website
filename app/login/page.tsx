'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Mail, Lock, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ text: '', type: '' })
    const [showPasswordReset, setShowPasswordReset] = useState(false)
    const [isForgotPassword, setIsForgotPassword] = useState(false)
    const [resetUser, setResetUser] = useState<any>(null)
    const [resetToken, setResetToken] = useState<string | null>(null)
    const [resetEmail, setResetEmail] = useState<string | null>(null)
    const [newPasswords, setNewPasswords] = useState({ new_password: '', confirm_password: '' })

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('reset_token')
        const email = params.get('email')
        if (token && email) {
            setResetToken(token)
            setResetEmail(email)
            setShowPasswordReset(true)
        }
    }, [])

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const AUTH_API_URL = process.env.NEXT_PUBLIC_PHP_BACKEND_URL ? `${process.env.NEXT_PUBLIC_PHP_BACKEND_URL.replace(/\/$/, '')}/auth.php` : 'https://api.netmaxin.com/auth.php';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage({ text: '', type: '' })

        try {
            const payload = {
                action: isLogin ? 'login' : 'signup',
                name: formData.name,
                email: formData.email,
                password: formData.password
            }

            const response = await fetch(AUTH_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                setMessage({ text: `Server error (${response.status}). Please try again later.`, type: 'error' })
                return
            }

            // Safely parse JSON
            const text = await response.text()
            let data
            try {
                data = JSON.parse(text)
            } catch {
                setMessage({ text: 'Server returned an unexpected response. Please try again.', type: 'error' })
                return
            }

            if (data.status === 'success') {
                setMessage({ text: data.message, type: 'success' })
                if (!isLogin) {
                    setTimeout(() => setIsLogin(true), 2000)
                } else {
                    // Check if admin reset their password — force a change
                    if (data.user?.password_reset == 1 || data.user?.password_reset === '1') {
                        setResetUser(data.user)
                        setShowPasswordReset(true)
                        setMessage({ text: 'Your password was reset by an admin. Please set a new password.', type: 'error' })
                    } else {
                        localStorage.setItem('netmaxin_user', JSON.stringify(data.user))
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 1500)
                    }
                }
            } else {
                setMessage({ text: data.message || 'An error occurred.', type: 'error' })
            }
        } catch (error: any) {
            console.error("Auth error:", error)
            setMessage({
                text: 'Unable to connect to the server. Please check your internet connection and try again.',
                type: 'error'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage({ text: '', type: '' })
        try {
            const response = await fetch(AUTH_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ action: 'forgot_password', email: formData.email })
            })
            const data = await response.json()
            if (data.status === 'success') {
                setMessage({ text: data.message, type: 'success' })
                setTimeout(() => {
                    setIsForgotPassword(false)
                    setMessage({ text: '', type: '' })
                }, 3000)
            } else {
                setMessage({ text: data.message, type: 'error' })
            }
        } catch (error: any) {
            setMessage({ text: `Connection failed: ${error.message}`, type: 'error' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleForcePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPasswords.new_password !== newPasswords.confirm_password) {
            setMessage({ text: "Passwords don't match!", type: 'error' })
            return
        }
        if (newPasswords.new_password.length < 6) {
            setMessage({ text: "Password must be at least 6 characters", type: 'error' })
            return
        }
        setIsLoading(true)
        try {
            let res;
            if (resetToken && resetEmail) {
                // Email-based token reset
                res = await fetch(AUTH_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ action: 'verify_reset_password', token: resetToken, email: resetEmail, new_password: newPasswords.new_password })
                })
            } else {
                // Admin forced reset
                res = await fetch(AUTH_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ action: 'change_password', id: resetUser.id, current_password: formData.password, new_password: newPasswords.new_password })
                })
            }

            const data = await res.json()
            if (data.status === 'success') {
                if (resetUser) {
                    // Clear the reset flag for admin forced reset
                    await fetch(AUTH_API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify({ action: 'clear_password_reset', id: resetUser.id })
                    })
                    const updatedUser = { ...resetUser, password_reset: 0 }
                    localStorage.setItem('netmaxin_user', JSON.stringify(updatedUser))
                }
                setMessage({ text: 'Password updated successfully! Redirecting...', type: 'success' })
                setTimeout(() => { window.location.href = '/' }, 1500)
            } else {
                setMessage({ text: data.message || 'Failed to change password', type: 'error' })
            }
        } catch (error: any) {
            setMessage({ text: `Error: ${error.message}`, type: 'error' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden dark:bg-slate-950 bg-background">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-40 mix-blend-screen animate-pulse-glow" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] opacity-40 mix-blend-screen" />

            {/* Glass Container */}
            <div className="w-full max-w-md backdrop-blur-3xl bg-white/70 dark:bg-slate-900/60 border border-black/10 dark:border-white/10 shadow-2xl rounded-3xl p-8 relative z-10 animate-slide-up">

                {/* Top bar */}
                <div className="flex items-center justify-between mb-8">
                    <a href="/" className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <ArrowLeft size={24} className="text-foreground dark:text-white" />
                    </a>
                    {/* Re-using logo for branding consistency */}
                    <div className="h-8 w-24 relative flex items-center justify-center">
                        <img src="/Logo%20Design%20Sec.png" alt="Logo" className="absolute h-full w-auto object-contain block dark:hidden" />
                        <img src="/Logo%20Design%20Sec%20White.png" alt="Logo" className="absolute h-full w-auto object-contain hidden dark:block" />
                    </div>
                </div>

                {/* Header Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground dark:text-white mb-2">
                        {showPasswordReset ? 'Set New Password' : isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome back' : 'Create account'}
                    </h1>
                    <p className="text-foreground/60 dark:text-white/60">
                        {showPasswordReset ? 'Your password was reset. Please choose a new password to continue.' : isForgotPassword ? 'Enter your email to receive a password reset link.' : isLogin ? 'Enter your details to access your dashboard.' : 'Sign up to start your digital journey with us.'}
                    </p>
                </div>

                {message.text && (
                    <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                        {message.text}
                    </div>
                )}

                {/* Force Password Change Form */}
                {showPasswordReset ? (
                    <form onSubmit={handleForcePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground dark:text-white pl-1">New Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 dark:text-white/50" />
                                <input type="password" required placeholder="New password (min 6 chars)" value={newPasswords.new_password} onChange={(e) => setNewPasswords({ ...newPasswords, new_password: e.target.value })} className="w-full h-12 pl-10 pr-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground dark:text-white" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground dark:text-white pl-1">Confirm New Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 dark:text-white/50" />
                                <input type="password" required placeholder="Confirm new password" value={newPasswords.confirm_password} onChange={(e) => setNewPasswords({ ...newPasswords, confirm_password: e.target.value })} className="w-full h-12 pl-10 pr-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground dark:text-white" />
                            </div>
                        </div>
                        <Button disabled={isLoading} className="w-full h-12 mt-6 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold text-lg hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 relative overflow-hidden group">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Update Password'}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                        </Button>
                    </form>
                ) : (<>

                    {/* Input Form */}
                    {isForgotPassword ? (
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground dark:text-white pl-1">Email</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 dark:text-white/50" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground dark:text-white"
                                    />
                                </div>
                            </div>
                            <Button
                                disabled={isLoading}
                                className="w-full h-12 mt-6 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold text-lg hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 relative overflow-hidden group"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    'Send Reset Link'
                                )}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-2 animate-fade-in">
                                    <label className="text-sm font-medium text-foreground dark:text-white pl-1">Name</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 dark:text-white/50" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full h-12 pl-10 pr-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground dark:text-white"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground dark:text-white pl-1">Email</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 dark:text-white/50" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground dark:text-white pl-1">Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 dark:text-white/50" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground dark:text-white"
                                    />
                                </div>
                                {isLogin && !isForgotPassword && (
                                    <div className="flex justify-end pt-1">
                                        <button onClick={() => { setIsForgotPassword(true); setMessage({ text: '', type: '' }); }} type="button" className="flex text-xs font-semibold text-primary hover:text-accent transition-colors">
                                            Forgot password?
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                disabled={isLoading}
                                className="w-full h-12 mt-6 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold text-lg hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 relative overflow-hidden group"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    isLogin ? 'Sign In' : 'Create Account'
                                )}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                            </Button>
                        </form>
                    )}

                    {/* Separator */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-black/10 dark:bg-white/10"></div>
                        <span className="text-sm font-medium text-foreground/50 dark:text-white/50">OR</span>
                        <div className="flex-1 h-px bg-black/10 dark:bg-white/10"></div>
                    </div>

                    {/* Toggle between states */}
                    <p className="text-center text-sm font-medium text-foreground/60 dark:text-white/60">
                        {isForgotPassword ? (
                            <button
                                type="button"
                                onClick={() => { setIsForgotPassword(false); setMessage({ text: '', type: '' }) }}
                                className="text-primary hover:text-accent font-bold transition-colors"
                            >
                                Back to Sign in
                            </button>
                        ) : isLogin ? (
                            <span>
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => { setIsLogin(false); setMessage({ text: '', type: '' }) }}
                                    className="text-primary hover:text-accent font-bold transition-colors"
                                >
                                    Sign up
                                </button>
                            </span>
                        ) : (
                            <span>
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => { setIsLogin(true); setMessage({ text: '', type: '' }) }}
                                    className="text-primary hover:text-accent font-bold transition-colors"
                                >
                                    Sign in
                                </button>
                            </span>
                        )}
                    </p>

                </>)}

            </div>
        </main>
    )
}
