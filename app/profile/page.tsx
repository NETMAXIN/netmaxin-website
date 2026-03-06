'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Calendar, BookOpen, Settings, LogOut, Loader2, Award, ScanBarcode, ArrowUpRight, ArrowDownLeft, Shield, UserCog, Briefcase, GraduationCap, FileText } from 'lucide-react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/navigation'
import AdminDashboard from '@/components/dashboard/admin-dashboard'
import ManagerDashboard from '@/components/dashboard/manager-dashboard'
import EmployeeDashboard from '@/components/dashboard/employee-dashboard'
import CourseDashboard from '@/components/dashboard/course-dashboard'
import InstructorDashboard from '@/components/dashboard/instructor-dashboard'
import InstructorApplyForm from '@/components/dashboard/instructor-apply'
import { api, formatDate } from '@/components/dashboard/api'

type TabId = 'profile' | 'courses' | 'rewards' | 'admin' | 'manager' | 'employee' | 'instructor' | 'apply_instructor'

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<TabId>('profile')
    const [isUpdating, setIsUpdating] = useState(false)
    const [formData, setFormData] = useState({ display_name: '', first_name: '', last_name: '', phone: '', company: '', position: '' })

    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false)
    const [securityFormData, setSecurityFormData] = useState({ current_password: '', new_email: '', new_password: '', confirm_password: '' })

    const [transactions, setTransactions] = useState<any[]>([])
    const [transferForm, setTransferForm] = useState({ receiver_netmaxin_id: '', amount: '' })
    const [isTransferring, setIsTransferring] = useState(false)
    const [showScanner, setShowScanner] = useState(false)

    useEffect(() => {
        const savedUser = localStorage.getItem('netmaxin_user')
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser)
                setUser(parsed)
                setFormData({
                    display_name: parsed.name || '', first_name: parsed.first_name || '',
                    last_name: parsed.last_name || '', phone: parsed.phone || '',
                    company: parsed.company || '', position: parsed.position || ''
                })
                fetchTransactions(parsed.id)
            } catch (e) { console.error(e) }
        } else { window.location.href = '/login' }
        setTimeout(() => setIsLoading(false), 500)
    }, [])

    const fetchTransactions = async (userId: number) => {
        try {
            const data = await api({ action: 'get_transactions', user_id: userId })
            if (data.status === 'success' && Array.isArray(data.transactions)) setTransactions(data.transactions)
        } catch (e) { console.error('Failed to fetch transactions:', e) }
    }

    // Re-fetch user data from server to get latest coins, role, etc.
    const refreshUserFromServer = async (userId: number) => {
        try {
            const res = await api({ action: 'get_user', user_id: userId })
            if (res.status === 'success' && res.user) {
                setUser(res.user)
                localStorage.setItem('netmaxin_user', JSON.stringify(res.user))
            }
            fetchTransactions(userId)
        } catch (e) { /* silent fail */ }
    }

    // Auto-refresh user data every 5 seconds to reflect coin changes quickly
    useEffect(() => {
        if (!user?.id) return
        const interval = setInterval(() => {
            refreshUserFromServer(user.id)
        }, 5000)
        return () => clearInterval(interval)
    }, [user?.id])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsUpdating(true)
        const data = await api({ action: 'update_profile', id: user.id, name: formData.display_name, first_name: formData.first_name, last_name: formData.last_name, phone: formData.phone, company: formData.company, position: formData.position })
        if (data.status === 'success') { setUser(data.user); localStorage.setItem('netmaxin_user', JSON.stringify(data.user)); alert("Profile updated!") }
        else alert(data.message)
        setIsUpdating(false)
    }

    const handleLogout = () => { localStorage.removeItem('netmaxin_user'); window.location.href = '/' }

    const handleChangeEmail = async (e: React.FormEvent) => {
        e.preventDefault(); setIsUpdatingSecurity(true)
        const data = await api({ action: 'change_email', id: user.id, current_password: securityFormData.current_password, new_email: securityFormData.new_email })
        if (data.status === 'success') { setUser(data.user); localStorage.setItem('netmaxin_user', JSON.stringify(data.user)); alert("Email updated!"); setIsEmailModalOpen(false); setSecurityFormData({ current_password: '', new_email: '', new_password: '', confirm_password: '' }) }
        else alert(data.message)
        setIsUpdatingSecurity(false)
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (securityFormData.new_password !== securityFormData.confirm_password) { alert("Passwords don't match!"); return }
        setIsUpdatingSecurity(true)
        const data = await api({ action: 'change_password', id: user.id, current_password: securityFormData.current_password, new_password: securityFormData.new_password })
        if (data.status === 'success') { alert("Password updated! Please login again."); handleLogout() }
        else alert(data.message)
        setIsUpdatingSecurity(false)
    }

    const handleTransfer = async () => {
        if (!transferForm.receiver_netmaxin_id || !transferForm.amount) return
        setIsTransferring(true)
        const data = await api({ action: 'transfer_coins', sender_id: user.id, receiver_netmaxin_id: transferForm.receiver_netmaxin_id, amount: parseInt(transferForm.amount) })
        if (data.status === 'success') {
            setUser(data.user)
            localStorage.setItem('netmaxin_user', JSON.stringify(data.user))
            alert("Transfer complete!")
            setTransferForm({ receiver_netmaxin_id: '', amount: '' })
            setShowScanner(false)
            // Immediately refresh transactions
            fetchTransactions(user.id)
        } else { alert(data.message) }
        setIsTransferring(false)
    }

    if (isLoading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    if (!user) return null

    const role = user.role || 'customer'

    const roleColors: Record<string, string> = {
        admin: 'from-red-500 to-orange-500', manager: 'from-blue-500 to-cyan-500',
        employee: 'from-purple-500 to-pink-500', customer: 'from-green-500 to-emerald-500',
        instructor: 'from-indigo-500 to-violet-500',
    }

    // Build sidebar tabs based on role
    const sidebarTabs: { id: TabId; label: string; icon: any }[] = [
        { id: 'profile', label: 'Personal Info', icon: User },
        { id: 'courses', label: 'Course Dashboard', icon: BookOpen },
        { id: 'rewards', label: 'Rewards & Coins', icon: Award },
    ]

    if (role === 'customer') sidebarTabs.push({ id: 'apply_instructor', label: 'Become Instructor', icon: GraduationCap })
    if (role === 'instructor') sidebarTabs.push({ id: 'instructor', label: 'Instructor Panel', icon: GraduationCap })
    if (role === 'employee') sidebarTabs.push({ id: 'employee', label: 'Employee Panel', icon: Briefcase })
    if (role === 'manager') sidebarTabs.push({ id: 'manager', label: 'Manager Panel', icon: UserCog })
    if (role === 'admin') sidebarTabs.push({ id: 'admin', label: 'Admin Panel', icon: Shield })

    const getNetmaxinId = (userId: number | string) => {
        if (!userId) return ''
        return `NM-920${String(userId).padStart(5, '0')}`
    }

    return (
        <div className="min-h-screen relative dark:bg-slate-950 bg-background text-foreground dark:text-white pb-20">
            <Navigation />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
            <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36">
                {/* Profile Header */}
                <div className="mb-12 animate-slide-up bg-black/5 dark:bg-white/5 p-8 rounded-3xl backdrop-blur-xl border border-black/10 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 relative overflow-hidden group">
                            <span className="text-4xl font-bold text-white relative z-10">{user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold mb-1">{user.name || 'User'}</h1>
                            <div className="flex flex-wrap gap-2 text-sm text-foreground/70 dark:text-white/70 items-center">
                                <span className="flex items-center gap-1"><Mail size={14} /> {user.email}</span> •
                                <span className="flex items-center gap-1"><Calendar size={14} /> Joined {formatDate(user.created_at)}</span>
                            </div>
                            <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r ${roleColors[role] || roleColors.customer}`}>
                                {role}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center px-6 py-3 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl">
                            <div className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest mb-1">Coins</div>
                            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">{user.coins || 0}</div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-2 animate-slide-right">
                        {sidebarTabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-semibold transition-all text-left ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'hover:bg-black/5 dark:hover:bg-white/5 text-foreground/70 dark:text-white/70'}`}>
                                <tab.icon size={20} /> {tab.label}
                            </button>
                        ))}
                        <div className="my-4 h-px bg-black/10 dark:bg-white/10" />
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-semibold text-red-500 hover:bg-red-500/10 transition-all">
                            <LogOut size={20} /> Sign Out
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 shadow-xl rounded-3xl p-6 sm:p-8 animate-slide-up">

                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="space-y-8 animate-fade-in">
                                <div><h2 className="text-2xl font-bold mb-2">Personal Info</h2><p className="text-foreground/60 dark:text-white/60">Update your personal information.</p></div>
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="space-y-2"><label className="text-sm font-semibold">Display Name *</label><input type="text" required value={formData.display_name} onChange={e => setFormData({ ...formData, display_name: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:border-primary outline-none" /></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2"><label className="text-sm font-semibold">First Name</label><input type="text" value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:border-primary outline-none" /></div>
                                        <div className="space-y-2"><label className="text-sm font-semibold">Last Name</label><input type="text" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:border-primary outline-none" /></div>
                                        <div className="space-y-2"><label className="text-sm font-semibold">Phone</label><input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:border-primary outline-none" /></div>
                                        <div className="space-y-2"><label className="text-sm font-semibold">College / Company</label><input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:border-primary outline-none" /></div>
                                        <div className="space-y-2 md:col-span-2"><label className="text-sm font-semibold">Section / Position</label><input type="text" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:border-primary outline-none" /></div>
                                    </div>
                                    <div className="pt-6 border-t border-border flex justify-end"><Button disabled={isUpdating} type="submit" className="bg-primary text-white px-8 rounded-xl font-semibold">{isUpdating ? <Loader2 className="animate-spin" /> : 'Save Changes'}</Button></div>
                                </form>
                                <div className="pt-8 border-t border-border space-y-4">
                                    <h3 className="text-lg font-bold">Security</h3>
                                    {!isEmailModalOpen && !isPasswordModalOpen && (
                                        <div className="flex gap-4 flex-wrap">
                                            <Button type="button" onClick={() => setIsEmailModalOpen(true)} variant="outline" className="rounded-xl border-border">Change Email</Button>
                                            <Button type="button" onClick={() => setIsPasswordModalOpen(true)} variant="outline" className="rounded-xl border-border">Change Password</Button>
                                        </div>
                                    )}
                                    {isEmailModalOpen && (
                                        <form onSubmit={handleChangeEmail} className="space-y-4 p-5 border border-border rounded-xl bg-black/5 dark:bg-white/5 animate-fade-in">
                                            <h4 className="font-semibold text-primary">Change Email</h4>
                                            <input type="email" required placeholder="New Email" value={securityFormData.new_email} onChange={e => setSecurityFormData({ ...securityFormData, new_email: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-background border border-border outline-none focus:border-primary" />
                                            <input type="password" required placeholder="Current Password" value={securityFormData.current_password} onChange={e => setSecurityFormData({ ...securityFormData, current_password: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-background border border-border outline-none focus:border-primary" />
                                            <div className="flex gap-3 pt-2"><Button type="submit" disabled={isUpdatingSecurity} className="bg-primary text-white rounded-xl">{isUpdatingSecurity ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null} Save</Button><Button type="button" onClick={() => { setIsEmailModalOpen(false); setSecurityFormData({ ...securityFormData, current_password: '', new_email: '' }) }} variant="ghost" className="rounded-xl">Cancel</Button></div>
                                        </form>
                                    )}
                                    {isPasswordModalOpen && (
                                        <form onSubmit={handleChangePassword} className="space-y-4 p-5 border border-border rounded-xl bg-black/5 dark:bg-white/5 animate-fade-in">
                                            <h4 className="font-semibold text-primary">Change Password</h4>
                                            <input type="password" required placeholder="Current Password" value={securityFormData.current_password} onChange={e => setSecurityFormData({ ...securityFormData, current_password: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-background border border-border outline-none focus:border-primary" />
                                            <input type="password" required placeholder="New Password" value={securityFormData.new_password} onChange={e => setSecurityFormData({ ...securityFormData, new_password: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-background border border-border outline-none focus:border-primary" />
                                            <input type="password" required placeholder="Confirm New Password" value={securityFormData.confirm_password} onChange={e => setSecurityFormData({ ...securityFormData, confirm_password: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-background border border-border outline-none focus:border-primary" />
                                            <div className="flex gap-3 pt-2"><Button type="submit" disabled={isUpdatingSecurity} className="bg-primary text-white rounded-xl">{isUpdatingSecurity ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null} Save</Button><Button type="button" onClick={() => { setIsPasswordModalOpen(false); setSecurityFormData({ ...securityFormData, current_password: '', new_password: '', confirm_password: '' }) }} variant="ghost" className="rounded-xl">Cancel</Button></div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* COURSE DASHBOARD TAB */}
                        {activeTab === 'courses' && <CourseDashboard user={user} />}

                        {/* REWARDS TAB */}
                        {activeTab === 'rewards' && (
                            <div className="space-y-8 animate-fade-in">
                                <div><h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Award className="text-yellow-500" /> Rewards Hub</h2><p className="text-foreground/60 dark:text-white/60">Earn coins and transfer them to other users.</p></div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-background border border-border rounded-2xl p-6 relative">
                                        <h3 className="font-bold text-lg mb-4 flex items-center justify-between">Peer-to-Peer Transfer<button onClick={() => setShowScanner(!showScanner)} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all" title="Scan QR"><ScanBarcode size={20} /></button></h3>
                                        {showScanner && (<div className="mb-4 rounded-xl overflow-hidden border border-border"><Scanner onScan={(result) => { if (result?.length > 0) { setTransferForm({ ...transferForm, receiver_netmaxin_id: result[0].rawValue }); setShowScanner(false) } }} /></div>)}
                                        <p className="text-sm text-foreground/60 mb-6">Send coins to friends via Netmaxin ID (e.g. NM-920XXXXX) or scan.</p>
                                        <div className="space-y-4">
                                            <input type="text" value={transferForm.receiver_netmaxin_id} onChange={e => setTransferForm({ ...transferForm, receiver_netmaxin_id: e.target.value })} placeholder="Receiver's Netmaxin ID (e.g. NM-92000001)" className="w-full h-12 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary uppercase font-mono" />
                                            <input type="number" value={transferForm.amount} onChange={e => setTransferForm({ ...transferForm, amount: e.target.value })} placeholder="Amount" className="w-full h-12 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary" />
                                            <Button onClick={handleTransfer} disabled={isTransferring} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl h-12">{isTransferring ? <Loader2 className="animate-spin" /> : 'Send Coins'}</Button>
                                        </div>
                                    </div>
                                    <div className="bg-background border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                                        <h3 className="font-bold text-lg mb-2">My QR Code</h3>
                                        <p className="text-sm text-foreground/60 mb-6">Show this to receive coins.</p>
                                        <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center mb-4 p-2 relative">
                                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getNetmaxinId(user.id))}`} alt="QR" className="w-full h-full object-contain mix-blend-multiply" />
                                            <div className="absolute inset-x-0 bottom-[-30px] text-xs font-mono text-foreground/50">{getNetmaxinId(user.id)}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-background border border-border rounded-2xl p-6">
                                    <h3 className="font-bold text-lg mb-4">Transaction History</h3>
                                    <div className="space-y-3">
                                        {transactions.length === 0 && <p className="text-sm text-foreground/50">No transactions yet.</p>}
                                        {transactions.map(t => {
                                            const isAdminAdd = (t.sender_id === null || t.sender_id === '' || t.sender_id === undefined) && t.receiver_id
                                            const isAdminDeduct = (t.receiver_id === null || t.receiver_id === '' || t.receiver_id === undefined) && t.sender_id
                                            const isSender = !isAdminAdd && !isAdminDeduct && String(t.sender_id) === String(user.id)

                                            let label = ''
                                            let subLabel = ''
                                            let colorClass = ''
                                            let icon = <ArrowDownLeft size={18} />
                                            let amountPrefix = '+'

                                            if (isAdminAdd) {
                                                label = 'Admin Added Coins'
                                                subLabel = 'System credit'
                                                colorClass = 'bg-emerald-500/10 text-emerald-500'
                                                icon = <ArrowDownLeft size={18} />
                                                amountPrefix = '+'
                                            } else if (isAdminDeduct) {
                                                label = 'Admin Deducted Coins'
                                                subLabel = 'System debit'
                                                colorClass = 'bg-orange-500/10 text-orange-500'
                                                icon = <ArrowUpRight size={18} />
                                                amountPrefix = '-'
                                            } else if (isSender) {
                                                label = 'Sent to'
                                                subLabel = t.receiver_name || (t.receiver_id ? getNetmaxinId(t.receiver_id) : 'Unknown')
                                                colorClass = 'bg-red-500/10 text-red-500'
                                                icon = <ArrowUpRight size={18} />
                                                amountPrefix = '-'
                                            } else {
                                                label = 'Received from'
                                                subLabel = t.sender_name || (t.sender_id ? getNetmaxinId(t.sender_id) : 'Unknown')
                                                colorClass = 'bg-green-500/10 text-green-500'
                                                icon = <ArrowDownLeft size={18} />
                                                amountPrefix = '+'
                                            }

                                            return (
                                                <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-full ${colorClass}`}>{icon}</div>
                                                        <div><p className="text-sm font-semibold">{label}</p><p className="text-xs text-foreground/60">{subLabel}</p></div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`font-bold ${amountPrefix === '-' ? 'text-red-500' : 'text-green-500'}`}>{amountPrefix}{t.amount}</p>
                                                        <p className="text-xs text-foreground/50">{formatDate(t.created_at)}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ROLE-SPECIFIC DASHBOARDS */}
                        {activeTab === 'admin' && role === 'admin' && <AdminDashboard user={user} />}
                        {activeTab === 'manager' && role === 'manager' && <ManagerDashboard user={user} />}
                        {activeTab === 'employee' && role === 'employee' && <EmployeeDashboard user={user} />}
                        {activeTab === 'instructor' && role === 'instructor' && <InstructorDashboard user={user} />}
                        {activeTab === 'apply_instructor' && role === 'customer' && <InstructorApplyForm user={user} />}
                    </div>
                </div>
            </main>
        </div>
    )
}
