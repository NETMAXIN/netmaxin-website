'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', company: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass dark:glass-dark p-8 rounded-2xl">
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-foreground dark:text-white mb-2">Thank you!</h3>
            <p className="text-foreground/70 dark:text-white/60">We'll get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground dark:text-white mb-2">Name</label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="glass dark:glass-dark border-white/20 dark:border-white/10"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground dark:text-white mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="glass dark:glass-dark border-white/20 dark:border-white/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground dark:text-white mb-2">Phone</label>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="+1 (123) 456-7890"
                  value={formData.phone}
                  onChange={handleChange}
                  className="glass dark:glass-dark border-white/20 dark:border-white/10"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground dark:text-white mb-2">Company</label>
                <Input
                  type="text"
                  name="company"
                  placeholder="Your company"
                  value={formData.company}
                  onChange={handleChange}
                  className="glass dark:glass-dark border-white/20 dark:border-white/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground dark:text-white mb-2">Message</label>
              <Textarea
                name="message"
                placeholder="Tell us about your project..."
                value={formData.message}
                onChange={handleChange}
                required
                className="glass dark:glass-dark border-white/20 dark:border-white/10 min-h-32"
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold gap-2">
              Send Message <Send size={18} />
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
