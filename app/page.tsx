import Navigation from '@/components/navigation'
import Hero from '@/components/hero'
import TrustedCompanies from '@/components/trusted-companies'
import Services from '@/components/services'
import Solutions from '@/components/solutions'
import CTA from '@/components/cta'
import Footer from '@/components/footer'
import ChatWidget from '@/components/chat-widget'

export default function Home() {
  return (
    <>
      <Navigation />
      <Hero />
      <TrustedCompanies />
      <Services />
      <Solutions />
      <CTA />
      <Footer />
      <ChatWidget />
    </>
  )
}
