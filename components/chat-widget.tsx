'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, X, Send } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const botResponses: Record<string, string> = {
  hello: 'Hello! How can we help you today?',
  services: 'We offer web development, app design, UI/UX design, CRM solutions, e-commerce, cloud solutions, and more. Would you like to know about a specific service?',
  pricing: 'Our pricing varies based on project scope. I\'d recommend contacting our sales team for a custom quote.',
  contact: 'You can reach us at team@netmaxin.com or call +91 8062181974.',
  courses: 'We offer online courses! Visit our courses page to explore available programs and enroll.',
  ceo: 'NetMaxin Group was founded by Ritesh Penta in 2021. He is our visionary CEO who balances innovation with a commitment to social impact through the NetMaxin Foundation.',
  story: 'Founded in 2021, NetMaxin Group has grown to a user base of 1M+ and over 350 million page views. We offer cutting-edge solutions including AI tools and a loyalty program.',
  stats: 'We have 4+ years of experience, a team of 10+ members, and have successfully completed 200+ projects for over 100 happy clients!',
  default: 'That\'s a great question! Feel free to contact our team for more details or explore our website for more information.'
}

const getResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase()
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) return botResponses.hello
  if (lowerMessage.includes('service') || lowerMessage.includes('offer')) return botResponses.services
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) return botResponses.pricing
  if (lowerMessage.includes('contact') || lowerMessage.includes('email')) return botResponses.contact
  if (lowerMessage.includes('course') || lowerMessage.includes('training')) return botResponses.courses
  if (lowerMessage.includes('ceo') || lowerMessage.includes('founder') || lowerMessage.includes('ritesh') || lowerMessage.includes('penta')) return botResponses.ceo
  if (lowerMessage.includes('story') || lowerMessage.includes('history') || lowerMessage.includes('about') || lowerMessage.includes('foundation') || lowerMessage.includes('2021')) return botResponses.story
  if (lowerMessage.includes('stats') || lowerMessage.includes('client') || lowerMessage.includes('experience') || lowerMessage.includes('project')) return botResponses.stats
  return botResponses.default
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can we assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-96 glass dark:glass-dark rounded-2xl flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="font-semibold text-foreground dark:text-white">NETMAXIN Support</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'user'
                    ? 'bg-gradient-to-r from-primary to-accent text-white'
                    : 'bg-white/10 dark:bg-white/5 text-foreground dark:text-white'
                    }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 dark:bg-white/5 px-4 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 flex gap-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="glass dark:glass-dark border-white/20 dark:border-white/10 text-sm"
            />
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
      >
        <MessageCircle size={24} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  )
}
