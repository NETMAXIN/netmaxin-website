'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { api } from '@/components/dashboard/api'
import { ArrowLeft, PlayCircle, CheckCircle, Lock, Download, MessageSquare, BookOpen, Menu, X, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LearnCoursePage() {
    const params = useParams()
    const router = useRouter()
    const courseId = Number(params.id)
    const [course, setCourse] = useState<any>(null)
    const [pageLoaded, setPageLoaded] = useState(false)
    const [activeModule, setActiveModule] = useState(0)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [completedModules, setCompletedModules] = useState<number[]>([])
    const [activeTab, setActiveTab] = useState('overview')
    const [videoCompleted, setVideoCompleted] = useState(false)

    // Load course data
    useEffect(() => {
        api({ action: 'get_all_courses' }).then(res => {
            if (res.status === 'success') {
                const found = res.courses.find((c: any) => c.id === courseId)
                setCourse(found || null)
            }
            setPageLoaded(true)
        })
    }, [courseId])

    // Load saved progress from localStorage
    useEffect(() => {
        const userStr = typeof window !== 'undefined' ? localStorage.getItem('netmaxin_user') : null;
        if (userStr) {
            const user = JSON.parse(userStr);
            const key = `lms_progress_${user.id}_${courseId}`;
            const saved = localStorage.getItem(key);
            if (saved) {
                setCompletedModules(JSON.parse(saved));
            }
        }
    }, [courseId]);

    // Reset video completed state when switching modules
    useEffect(() => {
        setVideoCompleted(completedModules.includes(activeModule));
    }, [activeModule, completedModules]);

    // --- Early returns AFTER all hooks ---
    if (!pageLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4 animate-pulse">Loading Course...</h1>
                </div>
            </div>
        )
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Course not found</h1>
                    <Link href="/profile"><Button>Back to Dashboard</Button></Link>
                </div>
            </div>
        )
    }

    const actualModulesCount = Array.isArray(course.modules) ? course.modules.length : Number(course.modules) || 0;
    const modules = Array.from({ length: actualModulesCount }, (_, i) => {
        const customMod = Array.isArray(course.modules) ? course.modules[i] : null;
        return {
            id: i,
            title: customMod?.title || `Module ${i + 1}: ${i === 0 ? 'Introduction & Setup' : i === 1 ? 'Core Fundamentals' : i === 2 ? 'Advanced Techniques' : 'Building the Project'}`,
            duration: '45 min',
            locked: i > Math.max(0, ...completedModules) + 1,
            videoUrl: customMod?.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
        }
    })

    const handleComplete = () => {
        if (!videoCompleted && !completedModules.includes(activeModule)) {
            alert("Please watch the video until the end before marking as complete.");
            return;
        }

        let newCompleted = [...completedModules];
        if (!newCompleted.includes(activeModule)) {
            newCompleted.push(activeModule);
            setCompletedModules(newCompleted);
        }

        const userStr = typeof window !== 'undefined' ? localStorage.getItem('netmaxin_user') : null;
        if (userStr) {
            const user = JSON.parse(userStr);
            const key = `lms_progress_${user.id}_${courseId}`;
            localStorage.setItem(key, JSON.stringify(newCompleted));
        }

        if (activeModule < modules.length - 1) {
            setActiveModule(activeModule + 1)
        } else {
            if (confirm('Congratulations on completing the course! Would you like to take your final exam now to claim your certificate?')) {
                router.push('/exam/1')
            } else {
                router.push('/profile')
            }
        }
    }

    const progress = actualModulesCount > 0 ? Math.round((completedModules.length / actualModulesCount) * 100) : 0

    return (
        <main className="min-h-screen bg-slate-950 text-white flex flex-col">
            {/* Top Navigation Bar */}
            <header className="h-16 bg-slate-900 border-b border-white/10 flex items-center justify-between px-4 shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg lg:hidden">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <Link href="/profile" className="hidden sm:flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                        <ArrowLeft size={18} /> Dashboard
                    </Link>
                    <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
                    <h1 className="font-bold text-sm sm:text-base line-clamp-1">{course.title}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 text-sm">
                        <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-white/70 font-mono">{progress}%</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Content Area - Video Player */}
                <div className="flex-1 flex flex-col overflow-y-auto bg-black relative">
                    <div className="w-full aspect-video bg-black flex items-center justify-center relative border-b border-white/10">
                        <video
                            src={modules[activeModule].videoUrl}
                            controls
                            className="w-full h-full object-contain"
                            poster={`https://picsum.photos/seed/${courseId * activeModule}/1280/720`}
                            onEnded={() => setVideoCompleted(true)}
                        />
                    </div>

                    <div className="p-6 sm:p-8 max-w-5xl mx-auto w-full flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{modules[activeModule].title}</h2>
                                <p className="text-white/60 text-sm">Instructor: {course.instructor}</p>
                            </div>
                            <Button
                                onClick={handleComplete}
                                disabled={!videoCompleted && !completedModules.includes(activeModule)}
                                className={`${videoCompleted || completedModules.includes(activeModule) ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-white/10 text-white/50 cursor-not-allowed'} font-bold gap-2 shrink-0 transition-colors`}
                            >
                                <CheckCircle size={18} /> Mark as Complete
                            </Button>
                        </div>

                        {/* Tabs for Overview, Resources, Q&A */}
                        <div className="space-y-8">
                            <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar">
                                <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 border-b-2 whitespace-nowrap font-medium transition-colors ${activeTab === 'overview' ? 'border-cyan-500 text-cyan-500 font-bold' : 'border-transparent text-white/50 hover:text-white'}`}>Overview</button>
                                <button onClick={() => setActiveTab('resources')} className={`px-6 py-3 border-b-2 whitespace-nowrap font-medium transition-colors ${activeTab === 'resources' ? 'border-cyan-500 text-cyan-500 font-bold' : 'border-transparent text-white/50 hover:text-white'}`}>Resources</button>
                                <button onClick={() => setActiveTab('qa')} className={`px-6 py-3 border-b-2 whitespace-nowrap font-medium transition-colors ${activeTab === 'qa' ? 'border-cyan-500 text-cyan-500 font-bold' : 'border-transparent text-white/50 hover:text-white'}`}>Q&A Forum</button>
                            </div>

                            <div className="prose prose-invert max-w-none text-white/80 space-y-4">
                                {activeTab === 'overview' && (
                                    <>
                                        <p>Welcome to {modules[activeModule].title}! In this lesson, we will cover the core principles necessary to master this topic.</p>
                                        <h3>Lesson Objectives</h3>
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li>Understand the fundamental architecture</li>
                                            <li>Implement basic boilerplate code</li>
                                            <li>Identify common pitfalls and edge cases</li>
                                        </ul>
                                    </>
                                )}

                                {activeTab === 'resources' && (
                                    <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Download size={20} /></div>
                                                <div>
                                                    <p className="font-bold text-sm">Lesson Cheatsheet.pdf</p>
                                                    <p className="text-xs text-white/50">2.4 MB</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="text-xs border-white/20">Download</Button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg"><Download size={20} /></div>
                                                <div>
                                                    <p className="font-bold text-sm">Starter Code.zip</p>
                                                    <p className="text-xs text-white/50">12.1 MB</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="text-xs border-white/20">Download</Button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'qa' && (
                                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center space-y-3">
                                        <MessageSquare className="mx-auto text-white/30" size={32} />
                                        <p className="font-bold">No questions yet</p>
                                        <p className="text-sm text-white/60">Be the first to ask a question about this module!</p>
                                        <Button variant="outline" className="mt-4 border-cyan-500 text-cyan-500 hover:bg-cyan-500/10">Ask Question</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Curriculum Builder Viewer */}
                <div className={`
                    absolute lg:static top-0 right-0 h-full w-80 bg-slate-900 border-l border-white/10 z-40 transform transition-transform duration-300 flex flex-col
                    ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                    ${!sidebarOpen ? 'lg:hidden' : ''}
                `}>
                    <div className="p-4 border-b border-white/10">
                        <h3 className="font-bold">Course Curriculum</h3>
                        <p className="text-xs text-white/50 mt-1">{completedModules.length} of {actualModulesCount} completed</p>
                    </div>
                    <div className="flex-1 overflow-y-auto w-full p-2 space-y-2">
                        {modules.map((mod, idx) => (
                            <button
                                key={mod.id}
                                onClick={() => !mod.locked && setActiveModule(idx)}
                                disabled={mod.locked}
                                className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors ${activeModule === idx ? 'bg-cyan-500/20 border border-cyan-500/30' :
                                    mod.locked ? 'opacity-50 cursor-not-allowed' :
                                        'hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <div className="mt-0.5 shrink-0">
                                    {completedModules.includes(idx) ? (
                                        <CheckCircle size={16} className="text-emerald-500" />
                                    ) : mod.locked ? (
                                        <Lock size={16} className="text-white/30" />
                                    ) : (
                                        <PlayCircle size={16} className={activeModule === idx ? 'text-cyan-400' : 'text-white/50'} />
                                    )}
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${activeModule === idx ? 'text-cyan-400' : ''}`}>{mod.title}</p>
                                    <p className="text-xs text-white/40 mt-1">{mod.duration}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="p-4 border-t border-white/10 bg-slate-900/50 text-center">
                        <Link href="/profile">
                            <Button variant="outline" className="w-full border-white/20 text-white/80 hover:text-white">Exit Course</Button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}
            </div>
        </main>
    )
}
