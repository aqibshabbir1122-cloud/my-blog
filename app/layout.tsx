import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.wanderline.site'),
  title: {
    default: 'Wanderline | Global Dispatches & Independent Journalism',
    template: '%s | Wanderline',
  },
  description:
    'In-depth global dispatches, investigative journalism, digital culture, and field reports.',
  keywords: [
    'journalism',
    'global reporting',
    'travel dispatches',
    'investigative culture',
  ],
  authors: [{ name: 'Wanderline Editorial' }],
  creator: 'Wanderline',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.wanderline.site',
    siteName: 'Wanderline',
    title: 'Wanderline | Global Dispatches',
    description:
      'In-depth global dispatches, investigative journalism, and field reports.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wanderline',
    description: 'Independent global dispatches and investigative reporting.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'p0U9Wl-GsIZT7wWx4gzL4qI5TLAz9wRjP9cdz7M1ZuM',
    other: {
      'google-adsense-account': 'ca-pub-8589841813564545',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased text-gray-900 bg-[#faf9f6]">
        {children}
        <Analytics />

        {/* Google AdSense Script */}
        <Script
          id="google-adsense"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8589841813564545"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  )
}