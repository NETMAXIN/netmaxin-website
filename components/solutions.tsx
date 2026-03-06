'use client'

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const solutions = [
  {
    category: 'Business Solutions',
    description: 'Complete business transformation through technology',
    features: [
      'Process Automation',
      'Digital Workflows',
      'Business Intelligence',
      'Data Analytics',
      'Custom Dashboards',
      'Reporting Tools'
    ]
  },
  {
    category: 'Enterprise Software Solutions',
    description: 'Scalable solutions for large organizations',
    features: [
      'Multi-tenant Architecture',
      'Enterprise Integration',
      'Security & Compliance',
      'Performance Optimization',
      'Disaster Recovery',
      'API Integration'
    ]
  },
  {
    category: 'Website Designing',
    description: 'Responsive, modern web design',
    features: [
      'Responsive Design',
      'SEO Optimization',
      'Performance Tuning',
      'Security Implementation',
      'Content Management',
      'Analytics Setup'
    ]
  },
  {
    category: 'Design & Development',
    description: 'Full-stack digital creation',
    features: [
      'UI/UX Design',
      'Frontend Development',
      'Backend Development',
      'Database Design',
      'Testing & QA',
      'DevOps Support'
    ]
  },
  {
    category: 'App Script Solutions',
    description: 'Google Workspace automation',
    features: [
      'Custom Scripts',
      'Automation Workflows',
      'Integration Services',
      'Custom Extensions',
      'API Connectors',
      'Support & Maintenance'
    ]
  },
  {
    category: 'API Integration Services',
    description: 'Seamless third-party integrations',
    features: [
      'Third-party APIs',
      'Payment Gateways',
      'Social Integration',
      'Real-time Sync',
      'Error Handling',
      'Documentation'
    ]
  },
]

export default function Solutions() {
  return (
    <section id="solutions" className="py-12 lg:py-16 relative bg-[#f7fdfb] dark:bg-slate-900 border-t border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 lg:mb-16"
        >
          <div className="inline-block mb-4">
            <div className="px-5 py-2 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 dark:border-emerald-400/20 backdrop-blur-md">
              <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">🎯 TAILORED SOLUTIONS</span>
            </div>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-foreground dark:text-white mb-6 text-balance tracking-tight">
            Solutions Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">Your Industry</span>
          </h2>
          <p className="text-lg text-foreground/70 dark:text-white/60 max-w-2xl mx-auto leading-relaxed">
            From startups to enterprises, we deliver solutions that align perfectly with your business goals.
          </p>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {solutions.map((solution, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group p-8 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 relative overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-foreground dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{solution.category}</h3>
                <p className="text-foreground/70 dark:text-white/60 text-sm mb-8 leading-relaxed">{solution.description}</p>

                <ul className="space-y-4 mb-8">
                  {solution.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                          <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      </div>
                      <span className="text-foreground/80 dark:text-white/70 text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a href={`/quote/solutions?select=${encodeURIComponent(solution.category)}`}>
                  <Button
                    variant="outline"
                    className="w-full mt-auto text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 rounded-xl h-12 transition-all duration-300 shadow-sm"
                  >
                    Get Quote
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
