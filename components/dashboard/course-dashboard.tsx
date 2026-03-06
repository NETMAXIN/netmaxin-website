'use client'
import { useState, useEffect } from 'react'
import { BookOpen, Calendar, ClipboardList, Bell, Trophy, Loader2, Clock, ArrowUpRight } from 'lucide-react'
import { api, formatDate, StatusBadge } from './api'

export default function CourseDashboard({ user }: { user: any }) {
    const [enrollments, setEnrollments] = useState<any[]>([])
    const [routines, setRoutines] = useState<any[]>([])
    const [exams, setExams] = useState<any[]>([])
    const [results, setResults] = useState<any[]>([])
    const [notices, setNotices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState<'enrolled' | 'routine' | 'exam' | 'result' | 'notice'>('enrolled')

    useEffect(() => { loadData() }, [])

    const loadData = async () => {
        setLoading(true)
        const [eRes, rRes, exRes, resRes, nRes] = await Promise.all([
            api({ action: 'get_my_enrollments', user_id: user.id }),
            api({ action: 'get_routines', user_id: user.id }),
            api({ action: 'get_my_exams', user_id: user.id }),
            api({ action: 'get_my_results', user_id: user.id }),
            api({ action: 'get_notices', user_id: user.id }),
        ])
        if (eRes.status === 'success') setEnrollments(eRes.enrollments)
        if (rRes.status === 'success') setRoutines(rRes.routines)
        if (exRes.status === 'success') setExams(exRes.exams)
        if (resRes.status === 'success') setResults(resRes.results)
        if (nRes.status === 'success') setNotices(nRes.notices)
        setLoading(false)
    }

    if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>

    const tabs = [
        { key: 'enrolled', label: 'My Courses', icon: BookOpen },
        { key: 'routine', label: 'Routine', icon: Calendar },
        { key: 'exam', label: 'Exams', icon: ClipboardList },
        { key: 'result', label: 'Results', icon: Trophy },
        { key: 'notice', label: 'Notice Board', icon: Bell },
    ] as const

    const dayColors: Record<string, string> = {
        Monday: 'from-blue-500 to-blue-600', Tuesday: 'from-purple-500 to-purple-600', Wednesday: 'from-green-500 to-green-600',
        Thursday: 'from-orange-500 to-orange-600', Friday: 'from-pink-500 to-pink-600', Saturday: 'from-indigo-500 to-indigo-600', Sunday: 'from-red-500 to-red-600',
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
                <BookOpen className="text-emerald-500" size={24} />
                <h2 className="text-2xl font-bold">Course Dashboard</h2>
            </div>

            <div className="flex gap-2 flex-wrap">
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${tab === t.key ? 'bg-primary text-white' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'}`}>
                        <t.icon size={14} />{t.label}
                    </button>
                ))}
            </div>

            {tab === 'enrolled' && (
                <div className="space-y-4">
                    {enrollments.length === 0 ? (
                        <div className="text-center py-12 space-y-3">
                            <BookOpen className="mx-auto text-foreground/20" size={48} />
                            <p className="text-foreground/50">You haven&apos;t enrolled in any courses yet.</p>
                            <a href="/courses" className="text-primary font-semibold hover:underline text-sm">Browse Courses →</a>
                        </div>
                    ) : enrollments.map(e => (
                        <div key={e.id} className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border hover:border-primary/30 transition-all flex flex-col md:flex-row gap-6 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[50px] pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                            <div className="flex-1 min-w-0 z-10">
                                <h3 className="font-bold text-xl mb-1">{e.title}</h3>
                                <p className="text-sm text-foreground/60">Instructor: {e.instructor_name} · {e.category} · {e.difficulty}</p>
                                {e.duration && <p className="text-xs text-foreground/50 mt-1 flex items-center gap-1"><Clock size={12} /> {e.duration}</p>}
                                <div className="mt-4 flex items-center gap-3 w-full max-w-sm">
                                    <div className="flex-1 h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-1000" style={{ width: `${e.progress || 0}%` }} />
                                    </div>
                                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 w-10">{e.progress || 0}%</span>
                                </div>
                            </div>
                            <div className="flex items-center md:items-end justify-end shrink-0 z-10">
                                <a href={`/learn/${e.course_id || e.id}`} className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all flex items-center gap-2">
                                    <BookOpen size={18} /> Continue Learning
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'routine' && (
                <div className="space-y-3">
                    {routines.length === 0 ? (
                        <p className="text-sm text-foreground/50">No routine scheduled yet.</p>
                    ) : (
                        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                            const dayRoutines = routines.filter(r => r.day_of_week === day)
                            if (dayRoutines.length === 0) return null
                            return (
                                <div key={day} className="space-y-2">
                                    <div className={`inline-block px-3 py-1 rounded-lg bg-gradient-to-r ${dayColors[day]} text-white text-xs font-bold`}>{day}</div>
                                    {dayRoutines.map(r => (
                                        <div key={r.id} className="ml-4 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 text-primary font-mono text-sm font-bold shrink-0">
                                                    <Clock size={14} />
                                                    {r.start_time?.slice(0, 5)} - {r.end_time?.slice(0, 5)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{r.course_title}</p>
                                                    {r.topic && <p className="text-xs text-foreground/60">{r.topic}</p>}
                                                    <p className="text-xs text-foreground/50">by {r.instructor_name}</p>
                                                </div>
                                            </div>
                                            {r.zoom_link && (
                                                <a href={r.zoom_link} target="_blank" rel="noreferrer" className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2">
                                                    Join Live <ArrowUpRight className="-mt-0.5" size={14} />
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )
                        })
                    )}
                </div>
            )}

            {tab === 'exam' && (
                <div className="space-y-3">
                    {exams.length === 0 ? <p className="text-sm text-foreground/50">No exams available.</p> : exams.map(e => (
                        <div key={e.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div>
                                    <p className="font-semibold">{e.title}</p>
                                    <p className="text-xs text-foreground/60">{e.course_title} · {e.duration_minutes} mins · {e.total_marks} marks</p>
                                    {e.exam_date && <p className="text-xs text-foreground/50 mt-1">Date: {formatDate(e.exam_date)}</p>}
                                </div>
                                <div className="text-right">
                                    {e.result_status ? <StatusBadge status={e.result_status} /> : <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-500 mb-2 inline-block">Upcoming</span>}

                                    {!e.result_status && (
                                        <div className="mt-2">
                                            <a href={`/exam/${e.id}`} className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white text-xs font-bold rounded-lg transition-all shadow-md">
                                                Take Exam
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {e.marks_obtained !== null && e.marks_obtained !== undefined && (
                                <p className="mt-3 text-sm font-semibold p-2 bg-white/5 rounded-lg inline-block">Score: <span className="text-primary">{e.marks_obtained}/{e.total_marks}</span></p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {tab === 'result' && (
                <div className="space-y-3">
                    {results.length === 0 ? <p className="text-sm text-foreground/50">No results yet.</p> : results.map(r => (
                        <div key={r.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{r.exam_title}</p>
                                <p className="text-xs text-foreground/60">{r.course_title}</p>
                            </div>
                            <div className="text-right">
                                <p className={`text-lg font-black ${r.status === 'passed' ? 'text-green-500' : r.status === 'failed' ? 'text-red-500' : 'text-foreground/50'}`}>{r.marks_obtained}/{r.total_marks}</p>
                                <StatusBadge status={r.status} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'notice' && (
                <div className="space-y-3">
                    {notices.length === 0 ? <p className="text-sm text-foreground/50">No notices.</p> : notices.map(n => (
                        <div key={n.id} className={`p-4 rounded-xl border ${n.is_pinned ? 'bg-primary/5 border-primary/20' : 'bg-black/5 dark:bg-white/5 border-border'}`}>
                            <div className="flex items-start gap-2">
                                {n.is_pinned ? <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-md font-bold">Pinned</span> : null}
                                <div className="flex-1">
                                    <p className="font-semibold">{n.title}</p>
                                    <p className="text-sm text-foreground/70 mt-1">{n.content}</p>
                                    <p className="text-xs text-foreground/40 mt-2">by {n.posted_by_name} · {formatDate(n.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
