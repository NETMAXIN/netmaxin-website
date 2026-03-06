'use client'

import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ChatWidget from '@/components/chat-widget'
import { Briefcase, MapPin, DollarSign, ArrowRight, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const jobs = [
  {
    id: 1,
    title: 'Senior Full-Stack Developer',
    location: 'Remote',
    type: 'Full-time',
    level: 'Senior',
    salary: '120K - 160K',
    description: 'Join our team as a Senior Full-Stack Developer. We are looking for experienced developers with expertise in React, Node.js, and cloud technologies.',
    skills: ['React', 'Node.js', 'AWS', 'PostgreSQL', 'Docker'],
    posted: '2 days ago'
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    location: 'Singapore',
    type: 'Full-time',
    level: 'Mid-level',
    salary: '80K - 110K',
    description: 'We are seeking a talented UI/UX Designer to create beautiful and intuitive user experiences for our products.',
    skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'CSS'],
    posted: '3 days ago'
  },
  {
    id: 3,
    title: 'Cloud Architect',
    location: 'US',
    type: 'Full-time',
    level: 'Senior',
    salary: '140K - 180K',
    description: 'Design and implement scalable cloud solutions using AWS and Azure for enterprise clients.',
    skills: ['AWS', 'Azure', 'Kubernetes', 'Infrastructure', 'DevOps'],
    posted: '1 week ago'
  },
  {
    id: 4,
    title: 'Mobile App Developer (React Native)',
    location: 'India',
    type: 'Full-time',
    level: 'Mid-level',
    salary: '50K - 75K',
    description: 'Develop cross-platform mobile applications using React Native for iOS and Android platforms.',
    skills: ['React Native', 'JavaScript', 'Firebase', 'Git', 'Mobile UI'],
    posted: '4 days ago'
  },
  {
    id: 5,
    title: 'Digital Marketing Manager',
    location: 'Remote',
    type: 'Full-time',
    level: 'Mid-level',
    salary: '70K - 95K',
    description: 'Lead our digital marketing strategy and manage campaigns across multiple channels.',
    skills: ['SEO', 'Google Ads', 'Analytics', 'Content Marketing', 'Social Media'],
    posted: '5 days ago'
  },
  {
    id: 6,
    title: 'QA Engineer',
    location: 'UK',
    type: 'Full-time',
    level: 'Junior',
    salary: '45K - 65K',
    description: 'Ensure quality of our products through comprehensive testing and quality assurance processes.',
    skills: ['Testing', 'Automation', 'Selenium', 'Jira', 'Bug Tracking'],
    posted: '1 week ago'
  }
]

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [savedJobs, setSavedJobs] = useState<number[]>([])

  const toggleSave = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navigation />
      <ChatWidget />

      {/* Header */}
      <section className="pt-32 pb-16 dark:bg-gradient-to-b dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="px-4 py-2 rounded-full glass dark:glass-dark">
                <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">We're Hiring</span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance mb-6 leading-tight">
              <span className="text-foreground dark:text-white">Join the </span>
              <span className="gradient-text font-black">NETMAXIN Team</span>
            </h1>
            <p className="text-lg text-foreground/70 dark:text-white/60 max-w-2xl mx-auto">
              Be part of a team that's transforming digital solutions. Explore exciting opportunities to grow your career with us.
            </p>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-20 lg:py-32 dark:bg-gradient-to-b dark:from-slate-900/50 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Jobs List */}
            <div className="lg:col-span-2 space-y-4">
              {jobs.map(job => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job.id)}
                  className={`group cursor-pointer p-6 rounded-xl transition-all duration-300 relative overflow-hidden ${
                    selectedJob === job.id
                      ? 'glass-dark dark:bg-white/10 ring-2 ring-primary'
                      : 'glass dark:glass-dark hover:glass-dark dark:hover:bg-white/10'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground dark:text-white group-hover:gradient-text transition-all">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2 text-sm text-foreground/70 dark:text-white/60">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {job.location}
                          </span>
                          <span>•</span>
                          <span>{job.type}</span>
                          <span>•</span>
                          <span>{job.level}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSave(job.id)
                        }}
                        className={`p-2 rounded-lg transition-all ${
                          savedJobs.includes(job.id)
                            ? 'bg-red-500/20 text-red-500'
                            : 'hover:bg-white/10 dark:hover:bg-white/5 text-foreground/50 dark:text-white/50'
                        }`}
                      >
                        <Heart size={20} fill={savedJobs.includes(job.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <p className="text-foreground/70 dark:text-white/60 text-sm mb-3">{job.description}</p>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-primary">{job.salary}/year</span>
                      <span className="text-xs text-foreground/50 dark:text-white/50">{job.posted}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Job Details */}
            <div className="lg:col-span-1">
              {selectedJob ? (
                <div className="sticky top-24">
                  {jobs.map(job => selectedJob === job.id && (
                    <div key={job.id} className="glass dark:glass-dark p-8 rounded-xl">
                      <h3 className="text-2xl font-bold text-foreground dark:text-white mb-4">{job.title}</h3>

                      <div className="space-y-4 mb-6">
                        <div>
                          <p className="text-sm text-foreground/60 dark:text-white/50 mb-1">Location</p>
                          <p className="font-semibold text-foreground dark:text-white flex items-center gap-2">
                            <MapPin size={16} />
                            {job.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60 dark:text-white/50 mb-1">Salary</p>
                          <p className="font-semibold text-foreground dark:text-white flex items-center gap-2">
                            <DollarSign size={16} />
                            {job.salary}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60 dark:text-white/50 mb-1">Type</p>
                          <p className="font-semibold text-foreground dark:text-white">{job.type}</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-sm font-semibold text-foreground dark:text-white mb-3">Required Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 text-xs font-semibold text-primary">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold gap-2">
                        Apply Now <ArrowRight size={18} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass dark:glass-dark p-8 rounded-xl text-center">
                  <Briefcase size={40} className="mx-auto text-foreground/50 dark:text-white/50 mb-4" />
                  <p className="text-foreground/70 dark:text-white/60">Select a job to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 lg:py-32 dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground dark:text-white mb-12 text-center">
            Why Work at NETMAXIN?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Flexible Work', desc: 'Remote and hybrid options available' },
              { title: 'Growth Opportunities', desc: 'Continuous learning and development' },
              { title: 'Competitive Pay', desc: 'Industry-leading compensation' },
              { title: 'Great Team', desc: 'Collaborative and supportive culture' }
            ].map((benefit, idx) => (
              <div key={idx} className="group p-6 rounded-xl glass dark:glass-dark hover:glass-dark dark:hover:bg-white/10 transition-all text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-primary/50 transition-all">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-foreground dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-foreground/70 dark:text-white/60">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
