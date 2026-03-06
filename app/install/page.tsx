'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function InstallPage() {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<null | 'not_installed' | 'installed'>(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const router = useRouter()

    const [form, setForm] = useState({
        db_host: 'localhost',
        db_name: '',
        db_user: '',
        db_pass: ''
    })

    useEffect(() => {
        const INSTALL_API_URL = '/php-backend/install_api.php';
        // Check if already installed
        fetch(INSTALL_API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'check' }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'installed') {
                setStatus('installed')
            } else {
                setStatus('not_installed')
            }
        })
        .catch(() => setStatus('not_installed'))
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const INSTALL_API_URL = '/php-backend/install_api.php';
            const res = await fetch(INSTALL_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            const data = await res.json()
            if (data.status === 'success') {
                setSuccess(data.message)
                setTimeout(() => {
                    router.push('/')
                }, 3000)
            } else {
                setError(data.message || 'Installation failed')
            }
        } catch (err) {
            setError('Could not connect to server')
        } finally {
            setLoading(false)
        }
    }

    if (status === null) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-gray-500">Loading installer...</p></div>
    }

    if (status === 'installed') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 font-sans">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-gray-100">
                    <div className="text-green-500 mb-6 flex justify-center">
                        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Installed</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">The database is already configured and working. If you need to reinstall, please delete <code className="bg-gray-100 text-pink-600 px-1 py-0.5 rounded">php-backend/config.php</code> from your Hostinger file manager.</p>
                    <button onClick={() => router.push('/')} className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition shadow-lg shadow-black/10">Go to Homepage</button>
                    <div className="mt-8 text-xs text-gray-400">Netmaxin Installer</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-100 blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-100 blur-3xl opacity-50"></div>
            
            <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-100 relative z-10 transition-all duration-300">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Netmaxin Setup</h1>
                    <p className="text-gray-500 text-sm">Configure your Hostinger MySQL database connection below to complete the installation.</p>
                </div>

                {error && <div className="mb-6 p-4 bg-red-50/50 text-red-700 rounded-xl border border-red-200 text-sm font-medium flex items-start hidden sm:flex">
                     <span className="mr-2 text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span>
                     {error}
                </div>}
                
                {success && <div className="mb-6 p-4 bg-green-50/50 text-green-700 rounded-xl border border-green-200 text-sm font-medium flex items-center">
                    <span className="mr-2 text-green-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></span>
                    {success}
                </div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Database Host</label>
                        <input required type="text" name="db_host" value={form.db_host} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black transition-all bg-gray-50/50" placeholder="localhost" />
                        <p className="text-xs text-gray-400 mt-1.5 font-medium ml-1">Usually 'localhost' on Hostinger.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Database Name</label>
                        <input required type="text" name="db_name" value={form.db_name} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black transition-all bg-gray-50/50" placeholder="u903487771_netmaxin" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Database User</label>
                        <input required type="text" name="db_user" value={form.db_user} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black transition-all bg-gray-50/50" placeholder="u903487771_netmaxin" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Database Password</label>
                        <input required type="password" name="db_pass" value={form.db_pass} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black transition-all bg-gray-50/50" placeholder="••••••••" />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !!success} 
                        className={`w-full mt-6 py-3.5 px-4 rounded-xl shadow-[0_8px_16px_rgba(0,0,0,0.1)] text-sm font-semibold text-white bg-black hover:bg-gray-800 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black grid place-items-center ${loading || success ? 'opacity-70 cursor-not-allowed transform-none hover:-translate-y-0' : ''}`}
                    >
                        {loading ? 'Connecting & Installing...' : 'Connect Database'}
                    </button>
                </form>
            </div>
            
            <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-gray-400 font-medium tracking-wide">
                NETMAXIN ENTERPRISE INSTALLER
            </div>
        </div>
    )
}
