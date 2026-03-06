'use client'
import { useState, useEffect } from 'react'
import { GraduationCap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api, StatusBadge } from './api'

export default function InstructorApplyForm({ user }: { user: any }) {
    const [myApps, setMyApps] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [form, setForm] = useState({ qualification: '', experience: '', specialization: '', portfolio_url: '' })

    useEffect(() => { loadApps() }, [])

    const loadApps = async () => {
        const res = await api({ action: 'get_my_instructor_application', user_id: user.id })
        if (res.status === 'success') setMyApps(res.applications)
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        const res = await api({ action: 'apply_instructor', user_id: user.id, ...form })
        alert(res.message)
        setForm({ qualification: '', experience: '', specialization: '', portfolio_url: '' })
        loadApps()
        setSubmitting(false)
    }

    if (loading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" /></div>

    const hasPending = myApps.some(a => a.status !== 'rejected')

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="text-indigo-500" size={24} />
                <h2 className="text-2xl font-bold">Become an Instructor</h2>
            </div>
            <p className="text-foreground/60 dark:text-white/60 text-sm">Apply to become an instructor and start uploading courses and conducting exams. Your application will be verified by our team.</p>

            {/* Existing applications */}
            {myApps.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-foreground/70">Your Applications</h3>
                    {myApps.map(a => (
                        <div key={a.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border space-y-2">
                            <div className="flex justify-between items-center flex-wrap gap-2">
                                <p className="font-semibold">Instructor Application</p>
                                <StatusBadge status={a.status} />
                            </div>
                            <p className="text-sm text-foreground/60">{a.qualification}</p>
                            {a.employee_note && <p className="text-xs text-foreground/50 italic">Employee review: {a.employee_note}</p>}
                            {a.manager_note && <p className="text-xs text-foreground/50 italic">Manager note: {a.manager_note}</p>}
                        </div>
                    ))}
                </div>
            )}

            {/* Application form */}
            {!hasPending && (
                <form onSubmit={handleSubmit} className="bg-background border border-border rounded-2xl p-6 space-y-4">
                    <h3 className="font-bold text-lg">Submit Application</h3>
                    <textarea required value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} placeholder="Your Qualifications *" className="w-full h-24 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none resize-none focus:border-primary" />
                    <textarea value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="Teaching Experience" className="w-full h-20 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none resize-none focus:border-primary" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} placeholder="Specialization" className="h-11 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary" />
                        <input value={form.portfolio_url} onChange={e => setForm({ ...form, portfolio_url: e.target.value })} placeholder="Portfolio URL (optional)" className="h-11 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary" />
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl h-11">
                        {submitting ? <Loader2 className="animate-spin" /> : 'Submit Application'}
                    </Button>
                </form>
            )}
        </div>
    )
}
