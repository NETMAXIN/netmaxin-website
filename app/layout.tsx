import type { Metadata } from 'next'
import Script from 'next/script'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import ActivityTracker from '@/components/activity-tracker'
import ErrorBoundary from '@/components/error-boundary'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL('https://netmaxin.com'),
  title: 'netmaxin.com - Digital Solutions & Enterprise Software',
  description: 'We provide comprehensive design, development, and enterprise software solutions including web apps, mobile apps, CRM, e-commerce, and cloud-based solutions.',
  keywords: ['Digital Solutions', 'Enterprise Software', 'Web Apps', 'Mobile Apps', 'CRM', 'E-commerce', 'Cloud Solutions', 'Netmaxin'],
  authors: [{ name: 'Netmaxin' }],
  creator: 'Netmaxin',
  publisher: 'Netmaxin',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'netmaxin.com - Digital Solutions & Enterprise Software',
    description: 'We provide comprehensive design, development, and enterprise software solutions including web apps, mobile apps, CRM, e-commerce, and cloud-based solutions.',
    url: 'https://netmaxin.com',
    siteName: 'Netmaxin',
    images: [
      {
        url: '/Icon.png',
        width: 1200,
        height: 630,
        alt: 'Netmaxin Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'netmaxin.com - Digital Solutions & Enterprise Software',
    description: 'We provide comprehensive design, development, and enterprise software solutions including web apps, mobile apps, CRM, e-commerce, and cloud-based solutions.',
    images: ['/Icon.png'],
  },
  generator: 'Next.js',
  icons: {
    icon: '/Icon.png',
    apple: '/Icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground dark:bg-slate-950 transition-colors duration-300">
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem storageKey="theme-netmaxin">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <ActivityTracker />
          <Analytics />
        </ThemeProvider>

        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-8MLBM11BW7" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-8MLBM11BW7');
          `}
        </Script>
      </body>
    </html>
  )
}
