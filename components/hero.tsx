'use client'

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative flex items-center min-h-[90vh] overflow-hidden pt-28 pb-16 bg-[#eef7f4] dark:bg-slate-950 bg-gradient-to-b from-[#f0faf7] via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      {/* Background soft ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[250px] sm:w-[600px] h-[250px] sm:h-[600px] bg-emerald-400/20 dark:bg-emerald-900/20 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[800px] h-[300px] sm:h-[800px] bg-cyan-300/10 dark:bg-cyan-900/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-emerald-300/20 dark:bg-emerald-800/20 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />

      {/* Floating 3D Elements - Optimized blurs */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-10 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-3xl border border-white/10 hidden md:block"
      />
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 right-1/3 w-32 h-32 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full border border-white/10 hidden md:block"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10 sm:mt-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Column: Typography & CTA */}
          <div className="text-left space-y-8 lg:pr-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex"
            >
              <div className="px-4 py-2 rounded-full backdrop-blur-xl bg-white/5 dark:bg-white/10 border border-black/10 dark:border-white/10 flex items-center gap-2 shadow-lg">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                <span className="text-xs sm:text-sm font-bold tracking-wide text-foreground dark:text-white uppercase">Award Winning Digital Agency</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-7xl lg:text-8xl font-serif tracking-tight text-balance leading-[1.05]"
            >
              <span className="text-foreground dark:text-white block mb-2 sm:mb-2">Optimized Digital</span>
              <span className="text-foreground dark:text-white block pb-2 drop-shadow-sm">Solutions For You.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-xl text-foreground/70 dark:text-white/70 text-balance leading-relaxed max-w-2xl"
            >
              We orchestrate powerful, data-driven strategies that skyrocket visibility and convert your audience into loyal customers. Let's create something extraordinary together.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4 sm:pt-6"
            >
              <a href="/services" className="inline-block w-full sm:w-auto">
                <Button size="lg" className="h-14 px-8 w-full bg-cyan-400 hover:bg-cyan-500 text-black text-sm font-bold shadow-xl shadow-cyan-400/20 transition-all duration-300 hover:scale-[1.02] rounded-full">
                  Join the Beta ↗
                </Button>
              </a>
              <a href="/quote/services" className="inline-block w-full sm:w-auto">
                <Button size="lg" variant="ghost" className="h-14 px-8 w-full text-sm font-bold bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 rounded-full">
                  Get Quote
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 sm:pt-10 border-t border-black/10 dark:border-white/10 mt-8 sm:mt-10"
            >
              <div>
                <div className="text-2xl sm:text-3xl font-black text-foreground dark:text-white mb-1">200+</div>
                <div className="text-xs sm:text-sm font-semibold text-foreground/50 dark:text-white/50 uppercase">Projects Completed</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-foreground dark:text-white mb-1">1.5M+</div>
                <div className="text-xs sm:text-sm font-semibold text-foreground/50 dark:text-white/50 uppercase">Global Users</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-foreground dark:text-white mb-1">4y+</div>
                <div className="text-xs sm:text-sm font-semibold text-foreground/50 dark:text-white/50 uppercase">Experience</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Abstract 3D Glass Composition (Hidden on mobile) */}
          <div className="hidden lg:block relative h-[600px] w-full perspective-1000">
            <div className="absolute inset-0">
              {/* Main Center Card - Redesigned to Soft Cyan UI */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] p-8 rounded-3xl backdrop-blur-3xl bg-white/60 dark:bg-white/5 border border-white dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(20,184,166,0.15)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] z-20">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 mb-6 flex items-center justify-center border border-cyan-200 dark:border-cyan-800">
                  <div className="w-5 h-5 bg-cyan-500 rounded-sm"></div>
                </div>
                <h3 className="text-2xl font-serif text-foreground dark:text-white mb-2 font-bold tracking-tight">Seamless Integration</h3>
                <p className="text-sm text-foreground/60 dark:text-white/60 mb-8 leading-relaxed">Connect your systems instantly with our robust and lightweight architecture. Built for scale and speed.</p>

                {/* Code Block Mock */}
                <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                  <div className="flex gap-1.5 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <p><span className="text-cyan-600 dark:text-cyan-400">const</span> system = <span className="text-indigo-500">initialize</span>();</p>
                  <p>system.<span className="text-cyan-600 dark:text-cyan-400">connect</span>({'{'}</p>
                  <p className="pl-4">mode: <span className="text-orange-500">'auto'</span>,</p>
                  <p className="pl-4">sync: <span className="text-cyan-600 dark:text-cyan-400">true</span></p>
                  <p>{'}'});</p>
                </div>
              </div>

              {/* Floating Element 1 - Top Right */}
              <div className="absolute top-20 right-4 w-48 p-4 rounded-2xl backdrop-blur-3xl bg-white/20 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl z-10 animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-bold">↑</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground dark:text-white">+124%</div>
                    <div className="text-xs text-foreground/60 dark:text-white/60">Conversion</div>
                  </div>
                </div>
              </div>

              {/* Floating Element 2 - Bottom Left */}
              <div className="absolute bottom-24 left-4 w-56 p-5 rounded-2xl backdrop-blur-3xl bg-accent/20 dark:bg-accent/10 border border-white/40 dark:border-white/10 shadow-xl z-30 animate-float" style={{ animationDelay: '2s', animationDuration: '5s' }}>
                <div className="text-sm font-semibold text-foreground dark:text-white mb-2">Active Campaigns</div>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background dark:border-slate-900 bg-gradient-to-br from-primary to-accent opacity-80"></div>
                  ))}
                </div>
              </div>

              {/* Decorative Ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-foreground/5 dark:border-white/5 rounded-full z-0"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-foreground/5 dark:border-white/5 rounded-full z-0 border-dashed animate-[spin_60s_linear_infinite]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
