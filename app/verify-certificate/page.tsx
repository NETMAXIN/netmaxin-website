'use client'

import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ChatWidget from '@/components/chat-widget'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, CheckCircle, AlertCircle, Award } from 'lucide-react'
import { useState } from 'react'

interface CertificateData {
  certificateId: string
  name: string
  course: string
  issueDate: string
  expiryDate: string
  status: 'valid' | 'expired' | 'not_found'
  score: number
}

const mockCertificates: Record<string, CertificateData> = {
  'CERT-2025-001': {
    certificateId: 'CERT-2025-001',
    name: 'John Doe',
    course: 'Web Development Fundamentals',
    issueDate: 'January 15, 2025',
    expiryDate: 'January 15, 2026',
    status: 'valid',
    score: 92
  },
  'CERT-2025-002': {
    certificateId: 'CERT-2025-002',
    name: 'Jane Smith',
    course: 'React Advanced Patterns',
    issueDate: 'December 1, 2024',
    expiryDate: 'December 1, 2025',
    status: 'valid',
    score: 95
  },
  'CERT-2024-089': {
    certificateId: 'CERT-2024-089',
    name: 'Mike Johnson',
    course: 'Cloud Architecture & DevOps',
    issueDate: 'January 10, 2024',
    expiryDate: 'January 10, 2025',
    status: 'expired',
    score: 88
  }
}

export default function VerifyCertificatePage() {
  const [certificateId, setCertificateId] = useState('')
  const [result, setResult] = useState<CertificateData | null>(null)
  const [searched, setSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!certificateId.trim()) return

    setIsLoading(true)
    setSearched(false)

    setTimeout(() => {
      let finalCert = mockCertificates[certificateId.toUpperCase()] || null;

      // Check local storage mock DB
      const localCerts = JSON.parse(localStorage.getItem('lms_certificates') || '[]');
      const foundLocal = localCerts.find((c: any) => c.certificateId.toUpperCase() === certificateId.toUpperCase());
      if (foundLocal) {
        finalCert = foundLocal;
      }

      if (finalCert) {
        setResult(finalCert)
      } else {
        setResult({
          certificateId: certificateId.toUpperCase(),
          name: '',
          course: '',
          issueDate: '',
          expiryDate: '',
          status: 'not_found',
          score: 0
        })
      }
      setSearched(true)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navigation />
      <ChatWidget />

      {/* Header */}
      <section className="pt-32 pb-16 dark:bg-gradient-to-b dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="px-4 py-2 rounded-full glass dark:glass-dark">
                <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Verify Credentials</span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance mb-6 leading-tight">
              <span className="text-foreground dark:text-white">Certificate </span>
              <span className="gradient-text font-black">Verification</span>
            </h1>
            <p className="text-lg text-foreground/70 dark:text-white/60 max-w-2xl mx-auto">
              Verify the authenticity of NETMAXIN Academy certificates. Enter a certificate ID to validate credentials.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20 lg:py-32 dark:bg-gradient-to-b dark:from-slate-900/50 dark:to-slate-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Form */}
          <div className="glass dark:glass-dark p-8 rounded-2xl mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground dark:text-white mb-3">
                  Certificate ID
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" size={20} />
                  <Input
                    type="text"
                    placeholder="e.g., CERT-2025-001"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    className="pl-12 glass dark:glass-dark border-white/20 dark:border-white/10 text-lg"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold gap-2 py-6 text-lg"
              >
                {isLoading ? 'Verifying...' : 'Verify Certificate'}
              </Button>
            </form>

            {/* Example IDs */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-foreground/60 dark:text-white/50 mb-3">Try these certificate IDs:</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(mockCertificates).map(id => (
                  <button
                    key={id}
                    onClick={() => {
                      setCertificateId(id)
                      const form = new FormData()
                      const e = new Event('submit') as any
                      e.preventDefault = () => { }
                      handleSearch(e)
                    }}
                    className="text-xs px-3 py-1 rounded-full glass dark:glass-dark hover:bg-white/20 dark:hover:bg-white/10 text-primary font-semibold transition-all"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          {searched && result && (
            <div className="animate-in">
              {result.status === 'valid' ? (
                <div className="glass dark:glass-dark p-8 rounded-2xl border border-green-500/30">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">Certificate Valid</h3>
                      <p className="text-foreground/70 dark:text-white/60 mt-1">This is a genuine NETMAXIN Academy certificate.</p>
                    </div>
                  </div>

                  <div className="space-y-4 bg-white/5 dark:bg-white/5 p-6 rounded-xl">
                    <div>
                      <p className="text-sm text-foreground/60 dark:text-white/50 mb-1">Certificate ID</p>
                      <p className="font-semibold text-foreground dark:text-white">{result.certificateId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60 dark:text-white/50 mb-1">Recipient Name</p>
                      <p className="font-semibold text-foreground dark:text-white">{result.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60 dark:text-white/50 mb-1">Course</p>
                      <p className="font-semibold text-foreground dark:text-white">{result.course}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-foreground/60 dark:text-white/50 mb-1">Issue Date</p>
                        <p className="font-semibold text-foreground dark:text-white">{result.issueDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60 dark:text-white/50 mb-1">Expiry Date</p>
                        <p className="font-semibold text-foreground dark:text-white">{result.expiryDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <Award className="text-primary" size={20} />
                      <div>
                        <p className="text-sm text-foreground/60 dark:text-white/50">Final Score</p>
                        <p className="font-bold text-lg text-foreground dark:text-white">{result.score}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : result.status === 'expired' ? (
                <div className="glass dark:glass-dark p-8 rounded-2xl border border-orange-500/30">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400">Certificate Expired</h3>
                      <p className="text-foreground/70 dark:text-white/60 mt-1">This certificate has expired and is no longer valid.</p>
                    </div>
                  </div>

                  <div className="space-y-4 bg-white/5 dark:bg-white/5 p-6 rounded-xl">
                    <div>
                      <p className="text-sm text-foreground/60 dark:text-white/50 mb-1">Recipient Name</p>
                      <p className="font-semibold text-foreground dark:text-white">{result.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60 dark:text-white/50 mb-1">Expiry Date</p>
                      <p className="font-semibold text-foreground dark:text-white">{result.expiryDate}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass dark:glass-dark p-8 rounded-2xl border border-red-500/30">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">Certificate Not Found</h3>
                      <p className="text-foreground/70 dark:text-white/60 mt-1">
                        The certificate ID "{result.certificateId}" does not exist in our database. Please verify and try again.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
