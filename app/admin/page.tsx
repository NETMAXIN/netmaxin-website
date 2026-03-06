'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import AdminDashboard from '@/components/dashboard/admin-dashboard'
import { Loader2 } from 'lucide-react'

export default function MainAdminPanelPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = () => {
            const userStr = localStorage.getItem('user')
            if (!userStr) {
                router.push('/login')
                return
            }
            try {
                const userData = JSON.parse(userStr)
                if (userData.role !== 'admin') {
                    router.push('/')
                    return
                }
                setUser(userData)
            } catch {
                router.push('/login')
            } finally {
                setLoading(false)
            }
        }
        checkAuth()
    }, [router])

    if (loading) {
        return (
            <main className="min-h-screen bg-[#f7fdfb] dark:bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
            </main>
        )
    }

    if (!user) return null

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
            <Navigation />

            <div className="flex-1 pt-24 pb-12 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-3xl p-6 shadow-xl">
                        <AdminDashboard user={user} />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
