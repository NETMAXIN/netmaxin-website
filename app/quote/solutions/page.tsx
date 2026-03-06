'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ChatWidget from '@/components/chat-widget'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight } from 'lucide-react'
import { api } from '@/components/dashboard/api'

const solutionsList = [
    'Hospital Management Systems',
    'Real Estate Portals',
    'Automobile Management',
    'Restaurant POS & Management',
    'School/College ERP',
    'Hotel Booking Management',
    'Logistics & Fleet Management',
    'Retail Inventory Systems',
    'Other'
]

function SolutionQuoteForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const selectedSolution = searchParams.get('select')

    const [formData, setFormData] = useState({
        type: 'Solution',
        category: solutionsList[0],
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    // Pre-select solution if passed in URL
    useEffect(() => {
        if (selectedSolution && solutionsList.includes(selectedSolution)) {
            setFormData(prev => ({ ...prev, category: selectedSolution }))
        }
    }, [selectedSolution])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const res = await api({
            action: 'submit_quote',
            type: formData.type,
            category: formData.category,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            message: formData.message
        })

        if (res.status === 'success') {
            alert("Quote request submitted successfully! Our team will contact you soon.")
            router.push('/')
        } else {
            alert(res.message || "Failed to submit quote.")
        }

        setIsSubmitting(false)
    }

    return (
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 p-8 rounded-3xl shadow-xl max-w-2xl mx-auto mt-8 mb-16">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground dark:text-white">Select Solution *</label>
                    <div className="relative">
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full h-14 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none focus:border-cyan-500 transition-colors appearance-none text-foreground dark:text-white"
                        >
                            <option value="" disabled className="text-black">Choose a solution...</option>
                            {solutionsList.map(s => (
                                <option key={s} value={s} className="text-black">{s}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground dark:text-white">Full Name *</label>
                        <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-14 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none focus:border-cyan-500 transition-colors text-foreground dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground dark:text-white">Email Address *</label>
                        <input
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full h-14 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none focus:border-cyan-500 transition-colors text-foreground dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground dark:text-white">Phone Number</label>
                        <input
                            type="tel"
                            placeholder="+1 (234) 567-890"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full h-14 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none focus:border-cyan-500 transition-colors text-foreground dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground dark:text-white">Company Name</label>
                        <input
                            type="text"
                            placeholder="Company Inc."
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full h-14 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none focus:border-cyan-500 transition-colors text-foreground dark:text-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground dark:text-white">Project Requirements / Message</label>
                    <textarea
                        rows={5}
                        placeholder="Tell us about your project..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none focus:border-cyan-500 transition-colors resize-y text-foreground dark:text-white"
                    ></textarea>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <>Submit Request <ArrowRight size={20} /></>}
                </Button>
            </form>
        </div>
    )
}

export default function QuoteSolutionsPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-slate-950">
            <Navigation />
            <ChatWidget />

            {/* Header */}
            <section className="pt-32 pb-10 bg-[#f7fdfb] dark:bg-slate-950 border-b border-black/5 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-6">
                        <div className="inline-block mb-4">
                            <div className="px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md">
                                <span className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Get a Quote</span>
                            </div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-balance mb-6 leading-tight">
                            Request a Quote for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 font-bold">Solutions</span>
                        </h1>
                        <p className="text-lg text-foreground/70 dark:text-white/60 max-w-2xl mx-auto">
                            Ready to deploy an enterprise solution? Let us know your requirements.
                        </p>
                    </div>
                </div>
            </section>

            {/* Form Content */}
            <section className="py-12 lg:py-16 bg-[#eef7f4] dark:bg-slate-900 border-b border-black/5 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin text-cyan-500 w-8 h-8" /></div>}>
                        <SolutionQuoteForm />
                    </Suspense>
                </div>
            </section>

            <Footer />
        </main>
    )
}
