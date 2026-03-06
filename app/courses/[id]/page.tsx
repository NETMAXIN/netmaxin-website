'use client'

import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ChatWidget from '@/components/chat-widget'
import { useEffect, useState } from 'react'

import { api } from '@/components/dashboard/api'
import { BookOpen, Users, Clock, Award, Star, ArrowRight, PlayCircle, FileText, CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CourseDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [enrolledCourses, setEnrolledCourses] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [course, setCourse] = useState<any>(null)
    const [pageLoaded, setPageLoaded] = useState(false)

    const courseId = Number(params.id)

    useEffect(() => {
        const userStr = typeof window !== 'undefined' ? localStorage.getItem('netmaxin_user') : null
        if (userStr) {
            const user = JSON.parse(userStr);
            const key = `lms_enrollments_${user.id}`;
            const enrollments = JSON.parse(localStorage.getItem(key) || '[]');
            setEnrolledCourses(enrollments);
        }
        api({ action: 'get_all_courses' }).then(res => {
            if (res.status === 'success') {
                const found = res.courses.find((c: any) => c.id === courseId)
                setCourse(found || null)
            }
            setPageLoaded(true)
        })

    }, [])

    if (!pageLoaded) return null;

    if (!course) {
        return (
            <main className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
                <Navigation />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
                    <Link href="/courses">
                        <Button variant="outline">Back to Courses</Button>
                    </Link>
                </div>
                <Footer />
            </main>
        )
    }

    const handleEnroll = async () => {
        const userStr = typeof window !== 'undefined' ? localStorage.getItem('netmaxin_user') : null

        if (!userStr) {
            alert("Please sign in to enroll in courses.")
            router.push('/login')
            return
        }

        if (enrolledCourses.includes(courseId)) {
            alert("You are already enrolled in this course!")
            router.push('/profile') // Or wherever LMS course viewer is
            return
        }

        setIsLoading(true)
        const user = JSON.parse(userStr)
        const res = await api({ action: 'enroll_course', user_id: user.id, course_id: courseId })
        setIsLoading(false)

        if (res.status === 'success' || res.message === 'Already enrolled') {
            setEnrolledCourses(prev => [...prev, courseId])
            alert(res.message || "Enrolled successfully! Redirecting to user dashboard...")
            router.push('/profile') // Or LMS equivalent
        } else {
            alert(res.message || "Failed to enroll.")
        }
    }

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950">
            <Navigation />
            <ChatWidget />

            {/* Header Hero Area */}
            <section className="pt-28 pb-16 bg-[#f7fdfb] dark:bg-slate-950 border-b border-black/5 dark:border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-[100px]" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/courses" className="inline-flex items-center text-sm font-semibold text-foreground/60 hover:text-cyan-600 transition-colors mb-6">
                        <ArrowLeft size={16} className="mr-2" /> Back to Courses
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                                {course.level} Level
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground dark:text-white leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-lg text-foreground/70 dark:text-white/60">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-foreground/70 dark:text-white/60">
                                <span className="flex items-center gap-2"><Star size={16} className="text-yellow-500 fill-yellow-500" /> {course.rating} Avg. Rating</span>
                                <span className="flex items-center gap-2"><Users size={16} className="text-cyan-500" /> {course.students} Students</span>
                                <span className="flex items-center gap-2"><Clock size={16} className="text-emerald-500" /> {course.duration}</span>
                                <span className="flex items-center gap-2"><BookOpen size={16} className="text-purple-500" /> {course.modules} Modules</span>
                            </div>

                            <div className="flex items-center gap-4 pt-6">
                                <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center uppercase font-bold text-lg text-foreground dark:text-white">
                                    {course.instructor.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm text-foreground/60 dark:text-white/60">Expert Instructor</p>
                                    <p className="font-bold text-foreground dark:text-white">{course.instructor}</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment/Enroll Card */}
                        <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 shadow-2xl rounded-3xl p-8 sticky top-32">
                            <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-cyan-100 to-emerald-100 dark:from-cyan-900/40 dark:to-emerald-900/40 flex items-center justify-center mb-6">
                                <PlayCircle size={64} className="text-cyan-600 dark:text-cyan-400 opacity-50" />
                            </div>

                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-4xl font-bold text-foreground dark:text-white">
                                    {Number(course.price) === 0 ? 'Free' : `₹${course.price}`}
                                </span>
                                {Number(course.price) > 0 && <span className="text-foreground/50 line-through text-sm">₹{Number(course.price) + 50}</span>}
                            </div>

                            <Button
                                onClick={handleEnroll}
                                disabled={isLoading}
                                className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 text-white mb-4"
                            >
                                {isLoading ? 'Processing...' : enrolledCourses.includes(courseId) ? 'Go to Course Dashboard' : 'Enroll Now'}
                            </Button>

                            <p className="text-center text-xs text-foreground/50 mb-6">
                                30-Day Money-Back Guarantee • Full Lifetime Access
                            </p>

                            <div className="space-y-4 text-sm font-medium text-foreground/80 dark:text-white/80">
                                <div className="flex gap-3 items-center"><CheckCircle size={18} className="text-emerald-500" /> 100% Online & Self-Paced</div>
                                <div className="flex gap-3 items-center"><CheckCircle size={18} className="text-emerald-500" /> Certificate of Completion</div>
                                <div className="flex gap-3 items-center"><CheckCircle size={18} className="text-emerald-500" /> Accessible on Mobile & TV</div>
                                <div className="flex gap-3 items-center"><CheckCircle size={18} className="text-emerald-500" /> Real-world Projects</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Details Section */}
            <section className="py-16 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        <div className="lg:col-span-2 space-y-12">
                            {/* What you'll learn */}
                            <div className="bg-[#f7fdfb] dark:bg-slate-900 border border-black/5 dark:border-white/5 rounded-3xl p-8">
                                <h2 className="text-2xl font-bold text-foreground dark:text-white mb-6">What You'll Learn</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="flex gap-3 items-start">
                                            <CheckCircle size={20} className="text-cyan-500 shrink-0 mt-0.5" />
                                            <span className="text-foreground/70 dark:text-white/60 text-sm">Comprehensive mastery of {course.title.toLowerCase()} concepts and tools.</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Curriculum summary */}
                            <div>
                                <h2 className="text-2xl font-bold text-foreground dark:text-white mb-6">Course Curriculum</h2>
                                <div className="space-y-4">
                                    {[...Array(course.modules > 5 ? 5 : course.modules)].map((_, idx) => (
                                        <div key={idx} className="border border-black/5 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 flex items-center justify-center font-bold">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-foreground dark:text-white text-sm sm:text-base">Module {idx + 1}: Core Concepts</h3>
                                                    <p className="text-xs text-foreground/50 flex items-center gap-2 mt-1"><PlayCircle size={12} /> 4 Lectures <FileText size={12} className="ml-2" /> 2 Readings</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-foreground/40 hidden sm:block">45 mins</span>
                                        </div>
                                    ))}
                                    {course.modules > 5 && (
                                        <div className="text-center pt-2">
                                            <Button variant="outline" className="text-cyan-600 border-cyan-200 hover:bg-cyan-50">View all {course.modules} modules</Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
