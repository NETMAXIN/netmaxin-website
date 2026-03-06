import type { Metadata } from 'next'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ChatWidget from '@/components/chat-widget'
import LeadForm from '@/components/lead-form'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | NETMAXIN',
  description: 'Get in touch with NETMAXIN to discuss your next big digital transformation project. Our team is ready to help.',
}

export default function ContactPage() {
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
                <span className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Get in Touch</span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-balance mb-6 leading-tight">
              <span className="text-foreground dark:text-white">Contact </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 font-bold">NETMAXIN</span>
            </h1>
            <p className="text-lg text-foreground/70 dark:text-white/60 max-w-2xl mx-auto">
              Have a question or ready to start your project? Get in touch with our team today.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 lg:py-16 bg-[#eef7f4] dark:bg-slate-900 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <div className="group p-8 rounded-3xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 relative overflow-hidden border border-black/5 dark:border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-emerald-100 dark:from-cyan-900/40 dark:to-emerald-900/40 border border-cyan-200 dark:border-cyan-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground dark:text-white mb-2">Email</h3>
                <a href="mailto:team@netmaxin.com" className="text-cyan-600 dark:text-cyan-400 hover:opacity-80 transition-opacity font-semibold">
                  team@netmaxin.com
                </a>
                <p className="text-foreground/70 dark:text-white/60 text-sm mt-2">We'll respond within 24 hours</p>
              </div>
            </div>

            <div className="group p-8 rounded-3xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 relative overflow-hidden border border-black/5 dark:border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-emerald-100 dark:from-cyan-900/40 dark:to-emerald-900/40 border border-cyan-200 dark:border-cyan-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground dark:text-white mb-2">Phone</h3>
                <a href="tel:+918062181974" className="text-cyan-600 dark:text-cyan-400 hover:opacity-80 transition-opacity font-semibold">
                  +91 8062181974
                </a>
                <p className="text-foreground/70 dark:text-white/60 text-sm mt-2">Mon - Sat, 9 AM - 6 PM</p>
              </div>
            </div>

            <div className="group p-8 rounded-3xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 relative overflow-hidden border border-black/5 dark:border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-emerald-100 dark:from-cyan-900/40 dark:to-emerald-900/40 border border-cyan-200 dark:border-cyan-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground dark:text-white mb-2">Location</h3>
                <p className="text-cyan-600 dark:text-cyan-400 hover:opacity-80 transition-opacity font-semibold">
                  39-3-24/2, Murali Nagar<br />Visakhapatnam
                </p>
                <p className="text-foreground/70 dark:text-white/60 text-sm mt-2">Andhra Pradesh, India</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground dark:text-white mb-8 text-center">Send us a Message</h2>
            <LeadForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
