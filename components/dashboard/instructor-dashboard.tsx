'use client'
import { useState, useEffect } from 'react'
import { GraduationCap, Loader2, Plus, BookOpen, ClipboardList, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api, StatusBadge } from './api'

export default function InstructorDashboard({ user }: { user: any }) {
    const [courses, setCourses] = useState<any[]>([])
    const [exams, setExams] = useState<any[]>([])
    const [appStatus, setAppStatus] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState<'courses' | 'exams' | 'application' | 'create_course' | 'create_exam'>('courses')

    const [courseForm, setCourseForm] = useState({ title: '', description: '', category: 'General', duration: '', difficulty: 'beginner' })
    const [examForm, setExamForm] = useState({ course_id: '', title: '', description: '', duration_minutes: '60', total_marks: '100', exam_date: '' })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => { loadData() }, [])

    const loadData = async () => {
        setLoading(true)
        const [cRes, exRes, aRes] = await Promise.all([
            api({ action: 'get_my_courses_instructor', instructor_id: user.id }),
            api({ action: 'get_instructor_exams', instructor_id: user.id }),
            api({ action: 'get_my_instructor_application', user_id: user.id }),
        ])
        if (cRes.status === 'success') setCourses(cRes.courses)
        if (exRes.status === 'success') setExams(exRes.exams)
        if (aRes.status === 'success') setAppStatus(aRes.applications)
        setLoading(false)
    }

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        const res = await api({ action: 'create_course', instructor_id: user.id, ...courseForm })
        alert(res.message)
        setCourseForm({ title: '', description: '', category: 'General', duration: '', difficulty: 'beginner' })
        setTab('courses')
        loadData()
        setSubmitting(false)
    }

    const handleCreateExam = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        const res = await api({ action: 'create_exam', instructor_id: user.id, ...examForm, duration_minutes: parseInt(examForm.duration_minutes), total_marks: parseInt(examForm.total_marks) })
        alert(res.message)
        setExamForm({ course_id: '', title: '', description: '', duration_minutes: '60', total_marks: '100', exam_date: '' })
        setTab('exams')
        loadData()
        setSubmitting(false)
    }

    if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>

    const publishedCourses = courses.filter(c => c.status === 'published')

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="text-indigo-500" size={24} />
                <h2 className="text-2xl font-bold">Instructor Dashboard</h2>
            </div>

            <div className="flex gap-2 flex-wrap">
                {[
                    { key: 'courses', label: 'My Courses', icon: BookOpen },
                    { key: 'exams', label: 'My Exams', icon: ClipboardList },
                    { key: 'create_course', label: 'Upload Course', icon: Plus },
                    { key: 'create_exam', label: 'Create Exam', icon: Plus },
                    { key: 'application', label: 'Application Status', icon: FileCheck },
                ].map((t: any) => (
                    <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${tab === t.key ? 'bg-primary text-white' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'}`}>
                        <t.icon size={14} />{t.label}
                    </button>
                ))}
            </div>

            {tab === 'courses' && (
                <div className="space-y-3">
                    {courses.length === 0 ? (
                        <div className="text-center py-12 space-y-3">
                            <BookOpen className="mx-auto text-foreground/20" size={48} />
                            <p className="text-foreground/50">No courses uploaded yet.</p>
                            <button onClick={() => setTab('create_course')} className="text-primary font-semibold hover:underline text-sm">Upload your first course →</button>
                        </div>
                    ) : courses.map(c => (
                        <div key={c.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div>
                                    <p className="font-semibold">{c.title}</p>
                                    <p className="text-xs text-foreground/60">{c.category} · {c.difficulty} · {c.enrollment_count || 0} enrolled</p>
                                    {c.description && <p className="text-sm text-foreground/60 mt-1 line-clamp-2">{c.description}</p>}
                                </div>
                                <StatusBadge status={c.status} />
                            </div>
                            {c.review_note && <p className="text-xs text-foreground/50 mt-2 italic">Review: {c.review_note}</p>}
                        </div>
                    ))}
                </div>
            )}

            {tab === 'exams' && (
                <div className="space-y-3">
                    {exams.length === 0 ? <p className="text-sm text-foreground/50">No exams created yet.</p> : exams.map(e => (
                        <div key={e.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div>
                                    <p className="font-semibold">{e.title}</p>
                                    <p className="text-xs text-foreground/60">{e.course_title} · {e.duration_minutes} mins · {e.total_marks} marks</p>
                                </div>
                                <StatusBadge status={e.status} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'create_course' && (
                <form onSubmit={handleCreateCourse} className="space-y-4 bg-background border border-border rounded-2xl p-6">
                    <h3 className="font-bold text-lg">Upload New Course</h3>
                    <p className="text-sm text-foreground/60">Your course will be reviewed by employees and approved by a manager before publishing.</p>
                    <input required value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="Course Title *" className="w-full h-11 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary" />
                    <textarea value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} placeholder="Description" className="w-full h-24 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none resize-none focus:border-primary" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input value={courseForm.category} onChange={e => setCourseForm({ ...courseForm, category: e.target.value })} placeholder="Category" className="h-11 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary" />
                        <input value={courseForm.duration} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })} placeholder="Duration (e.g. 6 weeks)" className="h-11 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary" />
                        <select value={courseForm.difficulty} onChange={e => setCourseForm({ ...courseForm, difficulty: e.target.value })} className="h-11 px-4 rounded-xl bg-background border border-border outline-none">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full bg-primary text-white font-bold rounded-xl h-11">
                        {submitting ? <Loader2 className="animate-spin" /> : 'Submit for Review'}
                    </Button>
                </form>
            )}

            {tab === 'create_exam' && (
                <form onSubmit={handleCreateExam} className="space-y-4 bg-background border border-border rounded-2xl p-6">
                    <h3 className="font-bold text-lg">Create New Exam</h3>
                    <p className="text-sm text-foreground/60">Exams are verified by employees and approved by managers before students can see them.</p>
                    <select required value={examForm.course_id} onChange={e => setExamForm({ ...examForm, course_id: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-background border border-border outline-none">
                        <option value="">Select Course *</option>
                        {publishedCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                    <input required value={examForm.title} onChange={e => setExamForm({ ...examForm, title: e.target.value })} placeholder="Exam Title *" className="w-full h-11 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary" />
                    <textarea value={examForm.description} onChange={e => setExamForm({ ...examForm, description: e.target.value })} placeholder="Description" className="w-full h-20 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none resize-none focus:border-primary" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input type="number" value={examForm.duration_minutes} onChange={e => setExamForm({ ...examForm, duration_minutes: e.target.value })} placeholder="Duration (mins)" className="h-11 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none" />
                        <input type="number" value={examForm.total_marks} onChange={e => setExamForm({ ...examForm, total_marks: e.target.value })} placeholder="Total Marks" className="h-11 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none" />
                        <input type="datetime-local" value={examForm.exam_date} onChange={e => setExamForm({ ...examForm, exam_date: e.target.value })} className="h-11 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none" />
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full bg-primary text-white font-bold rounded-xl h-11">
                        {submitting ? <Loader2 className="animate-spin" /> : 'Submit for Review'}
                    </Button>
                </form>
            )}

            {tab === 'application' && (
                <div className="space-y-3">
                    {appStatus.length === 0 ? <p className="text-sm text-foreground/50">No application history.</p> : appStatus.map(a => (
                        <div key={a.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border space-y-2">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div>
                                    <p className="font-semibold">Instructor Application</p>
                                    <p className="text-xs text-foreground/60">{a.specialization}</p>
                                </div>
                                <StatusBadge status={a.status} />
                            </div>
                            <p className="text-sm text-foreground/70">{a.qualification}</p>
                            {a.employee_note && <p className="text-xs text-foreground/50 italic">Employee: {a.employee_note}</p>}
                            {a.manager_note && <p className="text-xs text-foreground/50 italic">Manager: {a.manager_note}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
