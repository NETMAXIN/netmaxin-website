import type { Metadata } from 'next'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ChatWidget from '@/components/chat-widget'
import { ShoppingCart, Settings, Zap, Cloud, TrendingUp, Users, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Solutions | NETMAXIN',
  description: 'Tailored enterprise solutions including E-commerce, CRM, Cloud, and Business Intelligence for every industry.',
}

const solutions = [
  {
    icon: ShoppingCart,
    title: 'E-commerce Development',
    description: 'Build powerful online stores that drive sales and customer engagement.',
    features: [
      'Product Catalog Management',
      'Secure Payment Integration',
      'Inventory Tracking',
      'Order Management',
      'Customer Analytics',
      'Mobile Responsive'
    ]
  },
  {
    icon: Settings,
    title: 'CRM Systems',
    description: 'Manage customer relationships efficiently with our custom CRM solutions.',
    features: [
      'Sales Pipeline Management',
      'Lead Tracking',
      'Customer Database',
      'Email Integration',
      'Sales Forecasting',
      'Reporting & Analytics'
    ]
  },
  {
    icon: Zap,
    title: 'Enterprise Software',
    description: 'Scalable enterprise solutions for large organizations.',
    features: [
      'Custom Architecture',
      'Multi-tenant Support',
      'Advanced Security',
      'API Integration',
      'Real-time Collaboration',
      'Compliance Management'
    ]
  },
  {
    icon: Cloud,
    title: 'Cloud-Based Solutions',
    description: 'Modern cloud infrastructure for optimal performance and scalability.',
    features: [
      'AWS/Azure/GCP',
      'Auto-scaling',
      'Load Balancing',
      'Data Backup',
      'Disaster Recovery',
      'Cost Optimization'
    ]
  },
  {
    icon: TrendingUp,
    title: 'Business Intelligence',
    description: 'Data-driven insights to make informed business decisions.',
    features: [
      'Custom Dashboards',
      'Real-time Analytics',
      'Predictive Analytics',
      'Data Visualization',
      'Business Reports',
      'KPI Tracking'
    ]
  },
  {
    icon: Users,
    title: 'Digital Marketing Solutions',
    description: 'Comprehensive marketing solutions to grow your business.',
    features: [
      'SEO Optimization',
      'Content Marketing',
      'Social Media Management',
      'Email Campaigns',
      'Analytics & Reporting',
      'Performance Tracking'
    ]
  }
]

export default function SolutionsPage() {
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
                <span className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Business Solutions</span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-balance mb-6 leading-tight">
              <span className="text-foreground dark:text-white">Tailored Solutions for </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-emerald-600 dark:from-cyan-400 dark:to-emerald-400 font-bold">Every Industry</span>
            </h1>
            <p className="text-lg text-foreground/70 dark:text-white/60 max-w-2xl mx-auto">
              From startups to enterprises, we deliver solutions that drive growth and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-12 lg:py-16 bg-[#eef7f4] dark:bg-slate-900 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution, idx) => {
              const Icon = solution.icon
              return (
                <div key={idx} className="group p-8 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 relative overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-emerald-100 dark:from-cyan-900/40 dark:to-emerald-900/40 border border-cyan-200 dark:border-cyan-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
                    </div>

                    <h3 className="text-xl font-bold text-foreground dark:text-white mb-3">{solution.title}</h3>
                    <p className="text-foreground/70 dark:text-white/60 text-sm leading-relaxed mb-6">{solution.description}</p>

                    <ul className="space-y-3 mb-6">
                      {solution.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800">
                              <Check className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                            </div>
                          </div>
                          <span className="text-foreground/80 dark:text-white/70 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <a href={`/quote/solutions?select=${encodeURIComponent(solution.title)}`}>
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
            Transform Your Business Today
          </h2>
          <p className="text-lg text-foreground/70 dark:text-white/60 mb-8 max-w-2xl mx-auto">
            Let us help you select the perfect solution for your business needs.
          </p>
          <a href="/contact">
            <Button size="lg" className="bg-cyan-400 hover:bg-cyan-500 shadow-xl shadow-cyan-400/20 text-black font-bold gap-2 rounded-full h-14 px-8 transition-all duration-300 hover:scale-105">
              Get Started Now
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
