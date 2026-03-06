import type { Metadata } from 'next'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ChatWidget from '@/components/chat-widget'
import LeadForm from '@/components/lead-form'
import { Code, Smartphone, Palette, Globe, Settings, Zap, Database, Cloud } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Services | NETMAXIN',
  description: 'Explore NETMAXIN\'s comprehensive digital services including web apps, mobile apps, CRM, cloud solutions, and automation.',
}

const services = [
  {
    icon: Globe,
    title: 'Website Designing',
    description: 'Beautiful, responsive websites that convert visitors into customers.',
    features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'User-Friendly']
  },
  {
    icon: Code,
    title: 'Custom Web Applications',
    description: 'Scalable web applications built with cutting-edge technologies.',
    features: ['Full Stack Development', 'API Integration', 'Real-time Features', 'Cloud Ready']
  },
  {
    icon: Smartphone,
    title: 'App Design & Development',
    description: 'Native and cross-platform mobile apps for iOS and Android.',
    features: ['Native Apps', 'Cross-platform', 'UI/UX Design', 'App Store Ready']
  },
  {
    icon: Palette,
    title: 'UI/UX Designing',
    description: 'User-centered design that creates engaging digital experiences.',
    features: ['Wireframing', 'Prototyping', 'User Testing', 'Design Systems']
  },
  {
    icon: Database,
    title: 'CRM Designing & Development',
    description: 'Customer relationship management solutions tailored to your needs.',
    features: ['Sales Pipeline', 'Customer Tracking', 'Analytics', 'Automation']
  },
  {
    icon: Cloud,
    title: 'Cloud-Based Solutions',
    description: 'Secure, scalable cloud infrastructure for your business.',
    features: ['AWS/Azure', 'Scalability', 'Security', 'Cost Optimization']
  },
  {
    icon: Settings,
    title: 'Automation & Integrations',
    description: 'Streamline workflows with intelligent automation.',
    features: ['Workflow Automation', 'API Integration', 'Data Sync', 'Custom Scripts']
  },
  {
    icon: Zap,
    title: 'API Integration Services',
    description: 'Connect your systems with powerful API integrations.',
    features: ['REST APIs', 'GraphQL', 'Webhooks', 'Real-time Sync']
  }
]

export default function ServicesPage() {
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
                <span className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Our Services</span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-balance mb-6 leading-tight">
              <span className="text-foreground dark:text-white">Comprehensive Digital </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-emerald-600 dark:from-cyan-400 dark:to-emerald-400 font-bold">Services</span>
            </h1>
            <p className="text-lg text-foreground/70 dark:text-white/60 max-w-2xl mx-auto">
              We offer a complete range of design and development solutions to transform your business vision into reality.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 lg:py-16 bg-[#eef7f4] dark:bg-slate-900 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon
              return (
                <div key={idx} className="group p-8 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 relative overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-emerald-100 dark:from-cyan-900/40 dark:to-emerald-900/40 border border-cyan-200 dark:border-cyan-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
                    </div>

                    <h3 className="text-lg font-bold text-foreground dark:text-white mb-3">{service.title}</h3>
                    <p className="text-foreground/70 dark:text-white/60 text-sm leading-relaxed mb-4">{service.description}</p>

                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, fidx) => (
                        <li key={fidx} className="text-sm text-foreground/70 dark:text-white/60 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <a href={`/quote/services?select=${encodeURIComponent(service.title)}`}>
                      <Button variant="outline" className="w-full text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-50 dark:hover:bg-cyan-900/40 rounded-xl h-12 transition-all duration-300 shadow-sm">
                        Get Quote
                      </Button>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-16 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute top-1/3 right-0 -translate-y-1/2 w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-foreground dark:text-white mb-6 text-balance">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-foreground/70 dark:text-white/60 mb-8 max-w-2xl mx-auto">
            Let's discuss which services would best fit your business needs.
          </p>
          <a href="/contact">
            <Button size="lg" className="bg-cyan-400 hover:bg-cyan-500 shadow-xl shadow-cyan-400/20 text-black font-bold gap-2 rounded-full h-14 px-8 transition-all duration-300 hover:scale-105">
              Schedule a Consultation
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
