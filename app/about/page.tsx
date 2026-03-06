import type { Metadata } from 'next'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ChatWidget from '@/components/chat-widget'
import { Award, Users, Target, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About Us | NETMAXIN',
  description: 'Learn about NETMAXIN\'s mission, vision, and our journey since 2021 as a dynamic tech company founded by Ritesh Penta, delivering innovation and excellence.',
  openGraph: {
    title: 'About Us | NETMAXIN',
    description: 'NetMaxin Group, founded by Ritesh Penta in 2021, is a dynamic tech company dedicated to innovation and excellence.',
    url: 'https://netmaxin.com/about',
    siteName: 'NETMAXIN',
    images: [
      {
        url: 'https://netmaxin.com/og-image.jpg',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NetMaxin Group',
    url: 'https://netmaxin.com',
    logo: 'https://netmaxin.com/logo.png',
    foundingDate: '2021',
    founder: {
      '@type': 'Person',
      name: 'Ritesh Penta'
    },
    description: 'NetMaxin Group, founded by Ritesh Penta in 2021, is a dynamic tech company dedicated to innovation and excellence. With a user base exceeding 1M+ and over 350 million page views, the company offers cutting-edge solutions, including AI tools, a loyalty program, and upcoming projects like cybersecurity certifications and social media initiatives.',
    sameAs: [
      'https://www.linkedin.com/company/netmaxin',
      'https://twitter.com/netmaxin'
    ]
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* SEO Schema for AI and Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navigation />
      <ChatWidget />

      {/* Header */}
      <section className="pt-28 pb-10 bg-[#f7fdfb] dark:bg-slate-950 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md">
                <span className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">About Us</span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-balance mb-6 leading-tight">
              <span className="text-foreground dark:text-white">Building Digital Excellence </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 font-bold">Since 2021</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 lg:py-16 bg-[#eef7f4] dark:bg-slate-900 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold text-foreground dark:text-white mb-6">Our Story</h2>
              <p className="text-lg text-foreground/70 dark:text-white/60 leading-relaxed mb-4">
                NetMaxin Group, founded by Ritesh Penta in 2021, is a dynamic tech company dedicated to innovation and excellence. With a user base exceeding 1M+ and over 350 million page views, the company offers cutting-edge solutions, including AI tools, a loyalty program, and upcoming projects like cybersecurity certifications and social media initiatives.
              </p>
              <p className="text-lg text-foreground/70 dark:text-white/60 leading-relaxed mb-4">
                NetMaxin is also committed to social impact through the NetMaxin Foundation, emphasizing community support and sustainable growth.
              </p>

              <div className="mt-8 p-6 bg-white dark:bg-slate-950 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
                <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">ABOUT OUR CEO & FOUNDER</h3>
                <p className="text-base text-foreground/70 dark:text-white/60 leading-relaxed">
                  Ritesh Penta is the visionary CEO and founder of NetMaxin Group, established in 2021 and headquartered in India. Under his leadership, the company has achieved remarkable milestones, including innovative tech solutions, a growing user base, and community-focused initiatives. Known for his entrepreneurial spirit, he balances innovation with a commitment to social impact through the NetMaxin Foundation.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400/10 rounded-3xl blur-[80px]" />
              <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl p-8 rounded-3xl border border-black/5 dark:border-white/5 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/40 dark:to-cyan-900/40 border border-emerald-200 dark:border-cyan-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground dark:text-white text-lg">Our Mission</h3>
                      <p className="text-sm text-foreground/70 dark:text-white/60 mt-1">To deliver innovative digital solutions that drive business growth and transform industries.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/40 dark:to-cyan-900/40 border border-emerald-200 dark:border-cyan-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Rocket className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground dark:text-white text-lg">Our Vision</h3>
                      <p className="text-sm text-foreground/70 dark:text-white/60 mt-1">To be the leading digital solutions provider, empowering businesses to thrive in the digital era.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: 'Excellence', desc: 'Delivering quality in every project' },
              { icon: Users, title: 'Collaboration', desc: 'Working closely with our clients' },
              { icon: Rocket, title: 'Innovation', desc: 'Embracing new technologies' },
              { icon: Target, title: 'Results', desc: 'Focused on your success' }
            ].map((value, idx) => {
              const Icon = value.icon
              return (
                <div key={idx} className="group p-6 rounded-3xl bg-white dark:bg-slate-950 border border-black/5 dark:border-white/5 hover:border-cyan-500/30 transition-all text-center">
                  <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="font-bold text-foreground dark:text-white mb-2">{value.title}</h3>
                  <p className="text-sm text-foreground/70 dark:text-white/60">{value.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 lg:py-16 bg-[#f7fdfb] dark:bg-slate-950 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '4+', label: 'Years Experience' },
              { number: '200+', label: 'Projects Completed' },
              { number: '100+', label: 'Happy Clients' },
              { number: '10+', label: 'Team Members' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 mb-2">{stat.number}</div>
                <p className="text-foreground/70 dark:text-white/60 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute top-1/3 right-0 -translate-y-1/2 w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-foreground dark:text-white mb-6">
            Let's Work Together
          </h2>
          <p className="text-lg text-foreground/70 dark:text-white/60 mb-8 max-w-2xl mx-auto">
            Ready to transform your business with NETMAXIN? Get in touch with our team today.
          </p>
          <a href="/contact">
            <Button size="lg" className="bg-cyan-400 hover:bg-cyan-500 shadow-xl shadow-cyan-400/20 text-black font-bold gap-2 rounded-full h-14 px-8 transition-all duration-300 hover:scale-105">
              Start Your Journey
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
