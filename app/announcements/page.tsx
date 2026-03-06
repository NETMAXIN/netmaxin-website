'use client'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ChatWidget from '@/components/chat-widget'
import { Bell, Calendar, CheckCircle, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { api } from '@/components/dashboard/api'
import { useState, useEffect } from 'react'

const typeColors: Record<string, string> = {
  'Product Launch': 'from-blue-500 to-blue-600',
  'New Program': 'from-purple-500 to-purple-600',
  'Expansion': 'from-green-500 to-green-600',
  'Event': 'from-pink-500 to-pink-600',
  'Maintenance': 'from-orange-500 to-orange-600',
  'Partnership': 'from-cyan-500 to-cyan-600',
  'General': 'from-slate-500 to-slate-600'
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api({ action: 'get_news' }).then((res) => {
      if (res.status === 'success') {
        setAnnouncements(res.news)
      }
      setLoading(false)
    })
  }, [])

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navigation />
      <ChatWidget />

      {/* Header */}
      <section className="pt-28 pb-10 bg-[#f7fdfb] dark:bg-slate-950 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="inline-block mb-4">
              <div className="px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md">
                <span className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Stay Updated</span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-balance mb-6 leading-tight">
              <span className="text-foreground dark:text-white">Latest </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 font-bold">Announcements</span>
            </h1>
            <p className="text-lg text-foreground/70 dark:text-white/60 max-w-2xl mx-auto">
              Stay informed about NETMAXIN updates, new products, events, and important announcements.
            </p>
          </div>
        </div>
      </section>

      {/* Announcements List */}
      <section className="py-12 lg:py-16 bg-[#eef7f4] dark:bg-slate-900 border-b border-black/5 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-20 text-foreground/50 animate-pulse">Loading announcements...</div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-20 text-foreground/50">No announcements yet.</div>
            ) : announcements.map((announcement) => {
              const Icon = announcement.iconStr === 'CheckCircle' ? CheckCircle : (announcement.iconStr === 'Bell' ? Bell : Zap)
              const bgColor = typeColors[announcement.type] || 'from-cyan-500 to-cyan-600'

              return (
                <div key={announcement.id} className="group">
                  <div className="bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl p-6 rounded-3xl hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 relative overflow-hidden border border-black/5 dark:border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-12 h-12 bg-gradient-to-br ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-all`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-foreground dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-all">
                              {announcement.title}
                            </h3>
                            <p className="text-foreground/70 dark:text-white/60 text-sm mt-2 leading-relaxed">
                              {announcement.description}
                            </p>
                          </div>
                        </div>
                        <Badge className={`bg-gradient-to-r ${bgColor} text-white whitespace-nowrap flex-shrink-0`}>
                          {announcement.type}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-foreground/50 dark:text-white/50 pt-4 border-t border-white/10">
                        <Calendar size={14} />
                        <time>{announcement.date}</time>
                      </div>
                    </div>
                  </div>
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
