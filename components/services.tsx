'use client'

import { Code, Smartphone, Palette, Zap, Cloud, Database, ShoppingCart, Gauge, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

const services = [
  {
    id: 1,
    icon: Code,
    title: 'Custom Web Applications',
    description: 'Scalable, robust web applications built with modern technologies tailored to your business needs.'
  },
  {
    id: 2,
    icon: Smartphone,
    title: 'App Design & Development',
    description: 'Native and cross-platform mobile applications that deliver exceptional user experiences.'
  },
  {
    id: 3,
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Beautiful, intuitive interfaces that engage users and drive conversions across all devices.'
  },
  {
    id: 4,
    icon: ShoppingCart,
    title: 'E-commerce Solutions',
    description: 'End-to-end e-commerce platforms that maximize sales and streamline operations.'
  },
  {
    id: 5,
    icon: Database,
    title: 'CRM Development',
    description: 'Custom CRM systems that streamline customer relationships and boost sales efficiency.'
  },
  {
    id: 6,
    icon: Cloud,
    title: 'Cloud Solutions',
    description: 'Secure, scalable cloud infrastructure and migration services for modern enterprises.'
  },
  {
    id: 7,
    icon: Zap,
    title: 'Automation & Integrations',
    description: 'Automated workflows and seamless API integrations that enhance productivity.'
  },
  {
    id: 8,
    icon: Gauge,
    title: 'Enterprise Software',
    description: 'Large-scale enterprise solutions designed for complex business operations.'
  },
]

export default function Services() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="services" className="py-12 lg:py-16 relative bg-white dark:bg-slate-950">
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
            <div className="px-5 py-2 rounded-full bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 dark:border-cyan-400/20 backdrop-blur-md">
              <span className="text-xs sm:text-sm font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">⚡ Core Offerings</span>
            </div>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-foreground dark:text-white mb-6 text-balance tracking-tight">
            Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-emerald-600 dark:from-cyan-400 dark:to-emerald-400">Digital Services</span>
          </h2>
          <p className="text-lg text-foreground/70 dark:text-white/60 max-w-2xl mx-auto leading-relaxed">
            We offer a complete range of design and development solutions to transform your business vision into reality.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative p-8 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Animated border gradient on hover */}
                {hoveredId === service.id && (
                  <motion.div
                    layoutId="service-hover"
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5 dark:from-cyan-500/10 dark:to-emerald-500/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}

                <div className="relative z-10">
                  {/* Icon with gradient */}
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-emerald-100 dark:from-cyan-900/40 dark:to-emerald-900/40 border border-cyan-200 dark:border-cyan-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-cyan-700 dark:text-cyan-400" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground dark:text-white mb-3 tracking-tight">{service.title}</h3>
                  <p className="text-foreground/70 dark:text-white/60 text-sm leading-relaxed mb-6">{service.description}</p>

                  {/* Arrow indicator */}
                  <a href={`/quote/services?select=${encodeURIComponent(service.title)}`} className="inline-flex items-center text-cyan-600 dark:text-cyan-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 hover:underline">
                    Get Quote
                    <ArrowUpRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
