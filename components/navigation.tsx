'use client'

import { Menu, X, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import ThemeSelector from '@/components/theme-selector'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [user, setUser] = useState<{ name: string } | null>(null)

  useEffect(() => {
    setMounted(true)
    const savedUser = localStorage.getItem('netmaxin_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        // failed parse
      }
    }
  }, [])

  return (
    <nav className={`fixed top-0 sm:top-6 left-0 sm:left-1/2 sm:-translate-x-1/2 backdrop-blur-3xl bg-white/40 dark:bg-slate-950/40 border sm:border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-white/5 z-50 px-4 sm:px-8 py-3 w-full sm:max-w-5xl sm:w-[calc(100%-48px)] transition-all duration-300 ${isOpen ? 'rounded-b-2xl sm:rounded-3xl' : 'rounded-none sm:rounded-full'}`}>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full">
          <a href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img
              src="/Logo%20Design%20Sec.png"
              alt="Netmaxin Logo"
              className="h-8 sm:h-10 w-auto object-contain block dark:hidden transition-all duration-300"
            />
            <img
              src="/Logo%20Design%20Sec%20White.png"
              alt="Netmaxin Logo"
              className="h-8 sm:h-10 w-auto object-contain hidden dark:block transition-all duration-300"
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            <a href="/" className="text-foreground/70 hover:text-foreground transition-colors">Home</a>
            <a href="/services" className="text-foreground/70 hover:text-foreground transition-colors">Services</a>
            <a href="/solutions" className="text-foreground/70 hover:text-foreground transition-colors">Solutions</a>
            <a href="/courses" className="text-foreground/70 hover:text-foreground transition-colors">Courses</a>
            <a href="/about" className="text-foreground/70 hover:text-foreground transition-colors">About</a>
            <a href="/blogs" className="text-foreground/70 hover:text-foreground transition-colors">Blogs</a>
            <a href="/announcements" className="text-foreground/70 hover:text-foreground transition-colors">News</a>
            <a href="/contact" className="text-foreground/70 hover:text-foreground transition-colors">Contact</a>
            {mounted && <ThemeSelector />}
            {mounted && user ? (
              <a href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={14} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{user.name ? user.name.split(' ')[0] : 'Profile'}</span>
              </a>
            ) : mounted ? (
              <a href="/login">
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white text-sm px-6 rounded-full">Sign In</Button>
              </a>
            ) : (
              <Button disabled className="bg-gradient-to-r from-primary to-accent opacity-50 text-white text-sm px-6 rounded-full">Loading...</Button>
            )}
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex items-center gap-2 md:hidden">
            {mounted && <ThemeSelector />}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:bg-foreground/5 p-2 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 mt-4 border-t border-border flex flex-col gap-1 animate-fade-in">
            <a href="/services" className="block px-4 py-2 rounded-lg text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-colors text-base font-medium">Services</a>
            <a href="/solutions" className="block px-4 py-2 rounded-lg text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-colors text-base font-medium">Solutions</a>
            <a href="/contact" className="block px-4 py-2 rounded-lg text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-colors text-base font-medium">Contact</a>
            <a href="/about" className="block px-4 py-2 rounded-lg text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-colors text-base font-medium">About</a>
            <a href="/blogs" className="block px-4 py-2 rounded-lg text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-colors text-base font-medium">Blogs</a>
            <a href="/courses" className="block px-4 py-2 rounded-lg text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-colors text-base font-medium">Courses</a>
            <a href="/careers" className="block px-4 py-2 rounded-lg text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-colors text-base font-medium">Careers</a>
            {mounted && user ? (
              <a href="/profile" className="flex items-center gap-3 p-3 mt-4 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
                <span className="text-base font-medium text-foreground">{user.name ? user.name : 'Profile'}</span>
              </a>
            ) : mounted ? (
              <a href="/login" className="block w-full mt-4">
                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white text-base py-6 rounded-xl">Sign In</Button>
              </a>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  )
}
