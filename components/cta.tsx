'use client'

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function CTA() {
  return (
    <section id="contact" className="py-12 lg:py-16 relative overflow-hidden bg-white dark:bg-slate-950">
      {/* Background orbs (optimized) */}
      <div className="absolute top-1/3 right-0 -translate-y-1/2 w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-block"
        >
          <div className="px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md">
            <span className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">✨ LET'S COLLABORATE</span>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-serif text-foreground dark:text-white mb-6 text-balance leading-tight tracking-tight"
        >
          Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">Transform</span> Your Business?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-foreground/70 dark:text-white/60 text-balance mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Let's collaborate to build innovative solutions that drive your business forward. Our team of experts is ready to turn your ideas into reality.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button size="lg" className="bg-cyan-400 hover:bg-cyan-500 shadow-xl shadow-cyan-400/20 text-black font-bold gap-2 rounded-full h-14 px-8 transition-all duration-300 hover:scale-105">
            Start Your Project <ArrowRight size={20} />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="rounded-full h-14 px-8 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 font-bold transition-all duration-300 hover:scale-105"
          >
            Schedule a Consultation
          </Button>
        </motion.div>

        {/* Contact Info with glass effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-black/5 dark:border-white/5"
        >
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 p-8 rounded-3xl group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10">
            <p className="text-foreground/50 dark:text-white/50 text-sm mb-3 font-semibold uppercase tracking-wider">Email</p>
            <a href="mailto:team@netmaxin.com" className="text-foreground dark:text-white font-bold hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-center gap-2">
              team@netmaxin.com
            </a>
          </div>
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 p-8 rounded-3xl group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10">
            <p className="text-foreground/50 dark:text-white/50 text-sm mb-3 font-semibold uppercase tracking-wider">Phone</p>
            <a href="tel:+918062181974" className="text-foreground dark:text-white font-bold hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-center gap-2">
              +91 8062181974
            </a>
          </div>
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 p-8 rounded-3xl group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10">
            <p className="text-foreground/50 dark:text-white/50 text-sm mb-3 font-semibold uppercase tracking-wider">Location</p>
            <p className="text-foreground dark:text-white font-bold">Visakhapatnam, India</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
