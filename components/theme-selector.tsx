'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const THEMES = [
  { id: 'light', name: 'Light', icon: '☀️' },
  { id: 'dark', name: 'Dark', icon: '🌙' },
]

export default function ThemeSelector() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('dark')

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme-netmaxin') || 'dark'
    setCurrentTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId)
    localStorage.setItem('theme-netmaxin', themeId)
    document.documentElement.setAttribute('data-theme', themeId)
    setIsOpen(false)
  }

  if (!mounted) return null

  const currentThemeObj = THEMES.find((t) => t.id === currentTheme)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 h-10 px-3 hover:bg-foreground/5 transition-colors"
      >
        <span className="text-lg">{currentThemeObj?.icon}</span>
        <ChevronDown size={16} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 backdrop-blur-2xl bg-background/80 border border-border shadow-2xl rounded-xl p-2 z-50 animate-fade-in">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${currentTheme === theme.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-foreground hover:bg-foreground/5'
                }`}
            >
              <span className="text-lg">{theme.icon}</span>
              <span className="text-sm font-medium">{theme.name}</span>
              {currentTheme === theme.id && <span className="ml-auto text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
