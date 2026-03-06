'use client'
import { useState, useEffect } from 'react'
import { Briefcase, Loader2, FileText, GraduationCap, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api, StatusBadge } from './api'

export default function EmployeeDashboard({ user }: { user: any }) {
    const [blogs, setBlogs] = useState<any[]>([])
    const [instrApps, setInstrApps] = useState<any[]>([])
    const [courses, setCourses] = useState<any[]>([])
    const [exams, setExams] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState<'blogs' | 'instructors' | 'courses' | 'exams'>('blogs')
    const [noteModal, setNoteModal] = useState<{ id: number; type: string; action: string } | null>(null)
    const [note, setNote] = useState('')

    useEffect(() => { loadData() }, [])

    const loadData = async () => {
        setLoading(true)
        const [bRes, iRes, cRes, exRes] = await Promise.all([
            api({ action: 'get_pending_blogs', requester_id: user.id }),
            api({ action: 'get_instructor_applications', requester_id: user.id }),
            api({ action: 'get_pending_courses', requester_id: user.id }),
            api({ action: 'get_pending_exams', requester_id: user.id }),
        ])
        if (bRes.status === 'success') setBlogs(bRes.blogs)
        if (iRes.status === 'success') setInstrApps(iRes.applications)
        if (cRes.status === 'success') setCourses(cRes.courses)
        if (exRes.status === 'success') setExams(exRes.exams)
        setLoading(false)
    }

    const handleAction = async () => {
        if (!noteModal) return
        const { id, type, action } = noteModal
        let res
        if (type === 'blog') res = await api({ action: 'review_blog', reviewer_id: user.id, blog_id: id, decision: action, reviewer_note: note })
        else if (type === 'instructor') res = await api({ action: 'review_instructor_application', reviewer_id: user.id, app_id: id, decision: action, note })
        else if (type === 'course') res = await api({ action: 'review_course', reviewer_id: user.id, course_id: id, decision: action, review_note: note })
        else if (type === 'exam') res = await api({ action: 'review_exam', reviewer_id: user.id, exam_id: id, decision: action })
        if (res) alert(res.message)
        setNoteModal(null); setNote('')
        loadData()
    }

    if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>

    const tabs = [
        { key: 'blogs', label: 'Blog Reviews', icon: FileText, count: blogs.filter(b => b.status === 'pending_review').length },
        { key: 'instructors', label: 'Instructor Apps', icon: GraduationCap, count: instrApps.filter(a => a.status === 'pending_employee_review').length },
        { key: 'courses', label: 'Course Reviews', icon: ClipboardList, count: courses.filter(c => c.status === 'pending_review').length },
        { key: 'exams', label: 'Exam Reviews', icon: ClipboardList, count: exams.filter(e => e.status === 'pending_review').length },
    ] as const

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
                <Briefcase className="text-purple-500" size={24} />
                <h2 className="text-2xl font-bold">Employee Panel</h2>
            </div>
            <p className="text-foreground/60 dark:text-white/60 text-sm">Review and verify submissions, then forward to manager for approval.</p>

            <div className="flex gap-2 flex-wrap">
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${tab === t.key ? 'bg-primary text-white' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'}`}>
                        <t.icon size={14} />{t.label}
                        {t.count > 0 && <span className="ml-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">{t.count}</span>}
                    </button>
                ))}
            </div>

            {/* Note Modal */}
            {noteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setNoteModal(null)}>
                    <div className="bg-background rounded-2xl p-6 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-lg">{noteModal.action === 'approve' ? 'Approve & Forward to Manager' : 'Reject'}</h3>
                        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a review note..." className="w-full h-24 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none resize-none" />
                        <div className="flex gap-3">
                            <Button onClick={handleAction} className="bg-primary text-white flex-1 rounded-xl">Confirm</Button>
                            <Button onClick={() => setNoteModal(null)} variant="ghost" className="rounded-xl">Cancel</Button>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'blogs' && (
                <div className="space-y-3">
                    {blogs.filter(b => b.status === 'pending_review').length === 0 && <p className="text-sm text-foreground/50">No blogs to review.</p>}
                    {blogs.filter(b => b.status === 'pending_review').map(b => (
                        <div key={b.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border space-y-2">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div><p className="font-semibold">{b.title}</p><p className="text-xs text-foreground/60">by {b.author_name} · {b.category}</p></div>
                                <StatusBadge status={b.status} />
                            </div>
                            {b.excerpt && <p className="text-sm text-foreground/60 line-clamp-2">{b.excerpt}</p>}
                            <div className="flex gap-2 pt-1">
                                <Button size="sm" onClick={() => setNoteModal({ id: b.id, type: 'blog', action: 'approve' })} className="bg-green-600 text-white text-xs rounded-lg">Approve → Manager</Button>
                                <Button size="sm" onClick={() => setNoteModal({ id: b.id, type: 'blog', action: 'reject' })} variant="outline" className="text-red-500 border-red-500/30 text-xs rounded-lg">Reject</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'instructors' && (
                <div className="space-y-3">
                    {instrApps.filter(a => a.status === 'pending_employee_review').length === 0 && <p className="text-sm text-foreground/50">No instructor applications to review.</p>}
                    {instrApps.filter(a => a.status === 'pending_employee_review').map(a => (
                        <div key={a.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border space-y-2">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div><p className="font-semibold">{a.applicant_name}</p><p className="text-xs text-foreground/60">{a.applicant_email}</p></div>
                                <StatusBadge status={a.status} />
                            </div>
                            <div className="text-sm text-foreground/70 space-y-1">
                                <p><span className="font-semibold">Qualification:</span> {a.qualification}</p>
                                {a.specialization && <p><span className="font-semibold">Specialization:</span> {a.specialization}</p>}
                                {a.experience && <p><span className="font-semibold">Experience:</span> {a.experience}</p>}
                            </div>
                            <div className="flex gap-2 pt-1">
                                <Button size="sm" onClick={() => setNoteModal({ id: a.id, type: 'instructor', action: 'approve' })} className="bg-green-600 text-white text-xs rounded-lg">Approve → Manager</Button>
                                <Button size="sm" onClick={() => setNoteModal({ id: a.id, type: 'instructor', action: 'reject' })} variant="outline" className="text-red-500 border-red-500/30 text-xs rounded-lg">Reject</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'courses' && (
                <div className="space-y-3">
                    {courses.filter(c => c.status === 'pending_review').length === 0 && <p className="text-sm text-foreground/50">No courses to review.</p>}
                    {courses.filter(c => c.status === 'pending_review').map(c => (
                        <div key={c.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border space-y-2">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div><p className="font-semibold">{c.title}</p><p className="text-xs text-foreground/60">by {c.instructor_name} · {c.category} · {c.difficulty}</p></div>
                                <StatusBadge status={c.status} />
                            </div>
                            {c.description && <p className="text-sm text-foreground/60 line-clamp-2">{c.description}</p>}
                            <div className="flex gap-2 pt-1">
                                <Button size="sm" onClick={() => setNoteModal({ id: c.id, type: 'course', action: 'approve' })} className="bg-green-600 text-white text-xs rounded-lg">Approve → Manager</Button>
                                <Button size="sm" onClick={() => setNoteModal({ id: c.id, type: 'course', action: 'reject' })} variant="outline" className="text-red-500 border-red-500/30 text-xs rounded-lg">Reject</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'exams' && (
                <div className="space-y-3">
                    {exams.filter(e => e.status === 'pending_review').length === 0 && <p className="text-sm text-foreground/50">No exams to review.</p>}
                    {exams.filter(e => e.status === 'pending_review').map(e => (
                        <div key={e.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border space-y-2">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div><p className="font-semibold">{e.title}</p><p className="text-xs text-foreground/60">{e.course_title} · by {e.instructor_name}</p></div>
                                <StatusBadge status={e.status} />
                            </div>
                            <div className="flex gap-2 pt-1">
                                <Button size="sm" onClick={() => setNoteModal({ id: e.id, type: 'exam', action: 'approve' })} className="bg-green-600 text-white text-xs rounded-lg">Approve → Manager</Button>
                                <Button size="sm" onClick={() => setNoteModal({ id: e.id, type: 'exam', action: 'reject' })} variant="outline" className="text-red-500 border-red-500/30 text-xs rounded-lg">Reject</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
