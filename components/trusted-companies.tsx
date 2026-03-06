'use client'

import { motion } from 'framer-motion'

import Image from 'next/image'

const companies = [
  { name: '1', logo: '/1_png.webp.avif' },
  { name: 'C Connects', logo: '/cconects.png.avif' },
  { name: 'Dentō Ceramics', logo: '/Dentō Ceramics1_edited_edited.png.avif' },
  { name: 'Google News', logo: '/google news.png.avif' },
  { name: 'High', logo: '/high.jpeg.avif' },
  { name: 'Sree Siri', logo: '/Sree siri industries.avif' },
  { name: 'HPS', logo: '/HPS logo.png.avif' },
  { name: 'KKP', logo: '/KKP-LOGO-03.jpg.avif' },
  { name: 'Logo', logo: '/logo-removebg-preview.png.avif' },
  { name: 'Elyqra Muse', logo: '/mail logo elyqra muse.png.avif' },
  { name: 'Main', logo: '/main logo.png.avif' },
  { name: 'MIZUGEN', logo: '/MIZUGEN.png.avif' },
]

export default function TrustedCompanies() {
  return (
    <section className="py-10 overflow-hidden bg-transparent border-y border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-sm font-bold text-foreground/50 dark:text-white/50 uppercase tracking-[0.2em]">Trusted and Recognized By</p>
        </motion.div>

        <div className="relative">
          {/* Scrolling container with will-change for performance */}
          <div className="overflow-hidden">
            <div className="flex gap-8 animate-scroll" style={{ willChange: 'transform' }}>
              {[...companies, ...companies].map((company, idx) => (
                <div
                  key={`${company.name}-${idx}`}
                  className="flex-shrink-0 flex justify-center items-center h-20 bg-white/60 dark:bg-slate-900/50 rounded-2xl border transition-all duration-300 pointer-events-none px-4 overflow-hidden relative w-36 sm:w-40 border-cyan-500/20 shadow-[0_0_15px_-5px_rgba(6,182,212,0.4)] dark:shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)]"
                >
                  <Image
                    src={company.logo}
                    alt={company.name}
                    fill
                    className="object-contain p-2 drop-shadow-[0_0_4px_rgba(255,255,255,0.5)] dark:drop-shadow-[0_0_4px_rgba(255,255,255,0.5)] opacity-100"
                    sizes="(max-width: 768px) 144px, 160px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Gradient overlays */}
          <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-white dark:from-slate-950 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white dark:from-slate-950 to-transparent pointer-events-none" />
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 2));
          }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
          animation-play-state: running;
        }
        @media (max-width: 768px) {
          .animate-scroll {
            animation-duration: 20s !important;
          }
        }
      `}</style>
    </section>
  )
}
