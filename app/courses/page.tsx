'use client'

import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ChatWidget from '@/components/chat-widget'
import { BookOpen, Users, Clock, Award, Star, ArrowRight, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/components/dashboard/api'

// The 'courses' array has been migrated into the local LMS DB accessed via api.tsx

export default function CoursesPage() {
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([])
  const [courses, setCourses] = useState<any[]>([])

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']

  useEffect(() => {
    api({ action: 'get_all_courses' }).then(res => {
      if (res.status === 'success' && Array.isArray(res.courses)) {
        // Let's filter to only published courses for the public facing page
        setCourses(res.courses.filter((c: any) => c.status === 'published' || c.status === undefined));
      }
    }).catch(e => console.error('Failed to load courses:', e))
  }, [])

  const filteredCourses = courses.filter(course =>
    selectedLevel === 'All' || course.level === selectedLevel
  )

  const router = useRouter()

  const handleEnroll = async (courseId: number) => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('netmaxin_user') : null
    if (!userStr) {
      alert("Please sign in to enroll in courses.")
      router.push('/login')
      return
    }

    if (enrolledCourses.includes(courseId)) {
      alert("You are already enrolled in this course!")
      return
    }

    const user = JSON.parse(userStr)
    const res = await api({ action: 'enroll_course', user_id: user.id, course_id: courseId })

    if (res.status === 'success' || res.message === 'Already enrolled') {
      setEnrolledCourses(prev => [...prev, courseId])
      alert(res.message || "Enrolled successfully!")
    } else {
      alert(res.message || "Failed to enroll.")
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navigation />
      <ChatWidget />

      {/* Header */}
      <section className="pt-28 pb-10 bg-[#f7fdfb] dark:bg-slate-950 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md">
                <span className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">NETMAXIN Academy</span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-balance mb-6 leading-tight">
              <span className="text-foreground dark:text-white">Learn & Grow with </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-emerald-600 dark:from-cyan-400 dark:to-emerald-400 font-bold">Our Online Courses</span>
            </h1>
            <p className="text-lg text-foreground/70 dark:text-white/60 max-w-2xl mx-auto">
              Access world-class training programs designed to upskill you in the latest technologies and methodologies.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 bg-white dark:bg-slate-900 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter size={20} />
              <span className="font-semibold text-foreground dark:text-white">Filter by Level:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {levels.map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedLevel === level
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'bg-black/5 dark:bg-white/5 text-foreground dark:text-white hover:bg-black/10 dark:hover:bg-white/10'
                    }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 lg:py-16 bg-[#eef7f4] dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-20 px-4 w-full flex flex-col items-center justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-black/5 dark:border-white/5">
              <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/40 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-foreground dark:text-white mb-2">
                No active courses right now
              </h3>
              <p className="text-foreground/60 dark:text-white/60">
                We are currently updating our curriculum. Please check back later for new and exciting courses!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCourses.map(course => (
                <div key={course.id} className="group h-full relative">
                  <div onClick={() => router.push(`/courses/${course.id}`)} className="cursor-pointer bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 p-6 rounded-3xl hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Icon */}
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-emerald-100 dark:from-cyan-900/40 dark:to-emerald-900/40 border border-cyan-200 dark:border-cyan-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                      </div>

                      {/* Course Info */}
                      <h3 className="text-lg font-bold text-foreground dark:text-white mb-2 line-clamp-2">
                        {course.title}
                      </h3>

                      <p className="text-sm text-foreground/70 dark:text-white/60 line-clamp-2 mb-4 flex-1">
                        {course.description}
                      </p>

                      {/* Level Badge */}
                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${course.level === 'Beginner' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                          course.level === 'Intermediate' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                            'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                          }`}>
                          {course.level}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-white/10 text-xs">
                        <div>
                          <div className="font-bold text-foreground dark:text-white">{course.modules}</div>
                          <div className="text-foreground/60 dark:text-white/50">Modules</div>
                        </div>
                        <div>
                          <div className="font-bold text-foreground dark:text-white">{course.duration}</div>
                          <div className="text-foreground/60 dark:text-white/50">Duration</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          <div className="font-bold text-foreground dark:text-white">{(course.rating || 5).toString()}</div>
                        </div>
                      </div>

                      {/* Instructor */}
                      <div className="mb-4 flex items-center gap-2 text-xs">
                        <Users size={14} />
                        <span className="text-foreground/70 dark:text-white/60">{course.instructor}</span>
                      </div>

                      {/* Price and Enroll */}
                      <div className="flex items-end justify-between pt-4 border-t border-white/10">
                        <div>
                          {Number(course.price) === 0 ? (
                            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Free</span>
                          ) : (
                            <span className="text-2xl font-bold text-foreground dark:text-white">₹{course.price}</span>
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); router.push(`/courses/${course.id}`) }}
                          className={`p-2 rounded-xl transition-all ${enrolledCourses.includes(course.id)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-900/50'
                            }`}
                          title={enrolledCourses.includes(course.id) ? "Enrolled" : "View Course"}
                        >
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 lg:py-16 bg-white dark:bg-slate-900 border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground dark:text-white mb-12 text-center">
            Why Learn with NETMAXIN Academy?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: 'Expert Instructors', desc: 'Learn from industry professionals' },
              { icon: Award, title: 'Certificates', desc: 'Get recognized certifications' },
              { icon: Clock, title: 'Self-Paced', desc: 'Learn at your own pace' },
              { icon: Users, title: 'Community', desc: 'Connect with other learners' }
            ].map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <div key={idx} className="group p-6 rounded-3xl bg-[#f7fdfb] dark:bg-slate-950 border border-black/5 dark:border-white/5 hover:border-cyan-500/30 transition-all text-center">
                  <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="font-bold text-foreground dark:text-white mb-2">{benefit.title}</h3>
                  <p className="text-sm text-foreground/70 dark:text-white/60">{benefit.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
