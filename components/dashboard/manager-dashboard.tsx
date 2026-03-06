'use client'
import { useState, useEffect } from 'react'
import { UserCog, Loader2, FileText, ClipboardCheck, Upload, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api, formatDate, StatusBadge } from './api'

export default function ManagerDashboard({ user }: { user: any }) {
    const [employees, setEmployees] = useState<any[]>([])
    const [blogs, setBlogs] = useState<any[]>([])
    const [instrApps, setInstrApps] = useState<any[]>([])
    const [courses, setCourses] = useState<any[]>([])
    const [exams, setExams] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState<'employees' | 'blogs' | 'instructors' | 'courses' | 'exams' | 'news'>('employees')
    const [noteModal, setNoteModal] = useState<{ id: number; type: string; action: string } | null>(null)
    const [note, setNote] = useState('')
    const [news, setNews] = useState<any[]>([])
    const [newsForm, setNewsForm] = useState({ title: '', description: '', type: 'General', iconStr: 'Bell' })
    const [isPostingNews, setIsPostingNews] = useState(false)

    useEffect(() => { loadData() }, [])

    const loadData = async () => {
        setLoading(true)
        const [eRes, bRes, iRes, cRes, exRes] = await Promise.all([
            api({ action: 'get_all_users', requester_id: user.id }),
            api({ action: 'get_pending_blogs', requester_id: user.id }),
            api({ action: 'get_instructor_applications', requester_id: user.id }),
            api({ action: 'get_pending_courses', requester_id: user.id }),
            api({ action: 'get_pending_exams', requester_id: user.id }),
        ])
        if (eRes.status === 'success') setEmployees(eRes.users)
        if (bRes.status === 'success') setBlogs(bRes.blogs)
        if (iRes.status === 'success') setInstrApps(iRes.applications)
        if (cRes.status === 'success') setCourses(cRes.courses)
        if (exRes.status === 'success') setExams(exRes.exams)
        // Load news
        const nRes = await api({ action: 'get_news' })
        if (nRes.status === 'success') setNews(nRes.news)
        setLoading(false)
    }

    const handlePostNews = async () => {
        if (!newsForm.title || !newsForm.description) { alert('Please fill all required news fields'); return }
        setIsPostingNews(true)
        const res = await api({ action: 'add_news', admin_id: user.id, ...newsForm })
        alert(res.message)
        setNewsForm({ title: '', description: '', type: 'General', iconStr: 'Bell' })
        setIsPostingNews(false)
        loadData()
    }

    const handleDeleteNews = async (id: number) => {
        if (!confirm('Delete this news announcement?')) return
        await api({ action: 'delete_news', admin_id: user.id, id })
        loadData()
    }

    const handleAction = async () => {
        if (!noteModal) return
        const { id, type, action } = noteModal
        let res
        if (type === 'blog') res = await api({ action: 'approve_blog', approver_id: user.id, blog_id: id, decision: action, approver_note: note })
        else if (type === 'instructor') res = await api({ action: 'approve_instructor_application', approver_id: user.id, app_id: id, decision: action, note })
        else if (type === 'course') res = await api({ action: 'approve_course', approver_id: user.id, course_id: id, decision: action, approval_note: note })
        else if (type === 'exam') res = await api({ action: 'approve_exam', approver_id: user.id, exam_id: id, decision: action })
        if (res) alert(res.message)
        setNoteModal(null); setNote('')
        loadData()
    }

    if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>

    const tabs = [
        { key: 'employees', label: 'Employees', icon: UserCog },
        { key: 'blogs', label: 'Blog Approvals', icon: FileText },
        { key: 'instructors', label: 'Instructor Apps', icon: ClipboardCheck },
        { key: 'courses', label: 'Course Approvals', icon: FileText },
        { key: 'exams', label: 'Exam Approvals', icon: FileText },
        { key: 'news', label: 'News & Announcements', icon: Upload },
    ] as const

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
                <UserCog className="text-blue-500" size={24} />
                <h2 className="text-2xl font-bold">Manager Panel</h2>
            </div>

            <div className="flex gap-2 flex-wrap">
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${tab === t.key ? 'bg-primary text-white' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'}`}>
                        <t.icon size={14} />{t.label}
                    </button>
                ))}
            </div>

            {/* Note Modal */}
            {noteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setNoteModal(null)}>
                    <div className="bg-background rounded-2xl p-6 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-lg">{noteModal.action === 'approve' || noteModal.action === 'publish' ? 'Approve' : 'Reject'} — Add Note</h3>
                        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Optional note..." className="w-full h-24 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none resize-none" />
                        <div className="flex gap-3">
                            <Button onClick={handleAction} className="bg-primary text-white flex-1 rounded-xl">Confirm</Button>
                            <Button onClick={() => setNoteModal(null)} variant="ghost" className="rounded-xl">Cancel</Button>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'employees' && (
                <div className="space-y-3">
                    {employees.length === 0 && <p className="text-sm text-foreground/50">No employees found.</p>}
                    {employees.map(e => (
                        <div key={e.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{e.name || 'No name'}</p>
                                <p className="text-xs text-foreground/60">{e.email} · {e.role}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-500">Employee</span>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'blogs' && (
                <div className="space-y-3">
                    {blogs.filter(b => b.status === 'reviewed').length === 0 && <p className="text-sm text-foreground/50">No blogs awaiting approval.</p>}
                    {blogs.filter(b => b.status === 'reviewed').map(b => (
                        <div key={b.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border space-y-2">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div><p className="font-semibold">{b.title}</p><p className="text-xs text-foreground/60">by {b.author_name} · Reviewed by {b.reviewer_name}</p></div>
                                <StatusBadge status={b.status} />
                            </div>
                            {b.excerpt && <p className="text-sm text-foreground/60">{b.excerpt}</p>}
                            <div className="flex gap-2 pt-1">
                                <Button size="sm" onClick={() => setNoteModal({ id: b.id, type: 'blog', action: 'publish' })} className="bg-green-600 text-white text-xs rounded-lg">Publish</Button>
                                <Button size="sm" onClick={() => setNoteModal({ id: b.id, type: 'blog', action: 'reject' })} variant="outline" className="text-red-500 border-red-500/30 text-xs rounded-lg">Reject</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'instructors' && (
                <div className="space-y-3">
                    {instrApps.filter(a => a.status === 'employee_approved').length === 0 && <p className="text-sm text-foreground/50">No applications awaiting approval.</p>}
                    {instrApps.filter(a => a.status === 'employee_approved').map(a => (
                        <div key={a.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border space-y-2">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div><p className="font-semibold">{a.applicant_name}</p><p className="text-xs text-foreground/60">{a.applicant_email} · {a.specialization}</p></div>
                                <StatusBadge status={a.status} />
                            </div>
                            <p className="text-sm text-foreground/60">{a.qualification}</p>
                            <div className="flex gap-2 pt-1">
                                <Button size="sm" onClick={() => setNoteModal({ id: a.id, type: 'instructor', action: 'approve' })} className="bg-green-600 text-white text-xs rounded-lg">Approve</Button>
                                <Button size="sm" onClick={() => setNoteModal({ id: a.id, type: 'instructor', action: 'reject' })} variant="outline" className="text-red-500 border-red-500/30 text-xs rounded-lg">Reject</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'courses' && (
                <div className="space-y-3">
                    {courses.filter(c => c.status === 'employee_approved').length === 0 && <p className="text-sm text-foreground/50">No courses awaiting approval.</p>}
                    {courses.filter(c => c.status === 'employee_approved').map(c => (
                        <div key={c.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border space-y-2">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div><p className="font-semibold">{c.title}</p><p className="text-xs text-foreground/60">by {c.instructor_name} · {c.category}</p></div>
                                <StatusBadge status={c.status} />
                            </div>
                            <div className="flex gap-2 pt-1">
                                <Button size="sm" onClick={() => setNoteModal({ id: c.id, type: 'course', action: 'approve' })} className="bg-green-600 text-white text-xs rounded-lg">Publish</Button>
                                <Button size="sm" onClick={() => setNoteModal({ id: c.id, type: 'course', action: 'reject' })} variant="outline" className="text-red-500 border-red-500/30 text-xs rounded-lg">Reject</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'exams' && (
                <div className="space-y-3">
                    {exams.filter(e => e.status === 'employee_approved').length === 0 && <p className="text-sm text-foreground/50">No exams awaiting approval.</p>}
                    {exams.filter(e => e.status === 'employee_approved').map(e => (
                        <div key={e.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border space-y-2">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div><p className="font-semibold">{e.title}</p><p className="text-xs text-foreground/60">{e.course_title} · by {e.instructor_name}</p></div>
                                <StatusBadge status={e.status} />
                            </div>
                            <div className="flex gap-2 pt-1">
                                <Button size="sm" onClick={() => setNoteModal({ id: e.id, type: 'exam', action: 'approve' })} className="bg-green-600 text-white text-xs rounded-lg">Publish</Button>
                                <Button size="sm" onClick={() => setNoteModal({ id: e.id, type: 'exam', action: 'reject' })} variant="outline" className="text-red-500 border-red-500/30 text-xs rounded-lg">Reject</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'news' && (
                <div className="space-y-6">
                    <div className="bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-border">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Upload className="text-primary" size={20} /> Post Announcement</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <input value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} placeholder="Announcement Title" className="w-full h-11 px-4 rounded-xl bg-background border border-border outline-none focus:border-primary" />
                            <div className="flex gap-2">
                                <select value={newsForm.type} onChange={e => setNewsForm({ ...newsForm, type: e.target.value })} className="flex-1 h-11 px-4 rounded-xl bg-background border border-border outline-none focus:border-primary">
                                    <option value="General">General</option>
                                    <option value="Product Launch">Product Launch</option>
                                    <option value="New Program">New Program</option>
                                    <option value="Expansion">Expansion</option>
                                    <option value="Event">Event</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Partnership">Partnership</option>
                                </select>
                                <select value={newsForm.iconStr} onChange={e => setNewsForm({ ...newsForm, iconStr: e.target.value })} className="h-11 px-4 rounded-xl bg-background border border-border outline-none focus:border-primary w-24">
                                    <option value="Bell">Bell</option>
                                    <option value="Zap">Zap</option>
                                    <option value="CheckCircle">Check</option>
                                </select>
                            </div>
                        </div>
                        <textarea value={newsForm.description} onChange={e => setNewsForm({ ...newsForm, description: e.target.value })} placeholder="Detailed description..." className="w-full h-24 p-4 rounded-xl bg-background border border-border outline-none focus:border-primary resize-none mb-4" />
                        <Button onClick={handlePostNews} disabled={isPostingNews} className="w-full sm:w-auto font-bold px-8">
                            {isPostingNews ? <Loader2 className="animate-spin" /> : 'Post Announcement'}
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {news.map(n => (
                            <div key={n.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border flex justify-between items-start gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold">{n.title}</span>
                                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold uppercase">{n.type}</span>
                                    </div>
                                    <p className="text-sm text-foreground/70">{n.description}</p>
                                    <p className="text-xs text-foreground/40 mt-2">{n.date}</p>
                                </div>
                                <button onClick={() => handleDeleteNews(n.id)} className="p-2 shrink-0 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {news.length === 0 && <p className="text-center text-foreground/50 py-8">No announcements posted yet.</p>}
                    </div>
                </div>
            )}
        </div>
    )
}
