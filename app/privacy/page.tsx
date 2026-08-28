import { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Privacy Policy | Wanderline',
  description: 'Privacy Policy and data practices for Wanderline.',
  alternates: {
    canonical: 'https://www.wanderline.site/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <div className="bg-[#faf9f6] min-h-screen">
      <SiteHeader variant="plain" />
      <main className="max-w-3xl mx-auto px-6 py-14">
        <h1 className="text-4xl font-serif text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-xs text-gray-400 mb-8 font-mono">Last updated: August 2026</p>

        <div className="prose prose-gray max-w-none text-gray-800 space-y-6 font-serif leading-relaxed text-base">
          <p>
            At Wanderline (accessible from https://www.wanderline.site), reader privacy is a priority. This document outlines the types of information collected and how it is used.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-3">1. Information We Collect</h2>
          <p>
            When you subscribe to our newsletter, we collect your email address solely to deliver article dispatches and platform updates. We do not sell, rent, or trade email lists.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-3">2. Log Files & Analytics</h2>
          <p>
            Wanderline uses standard log files and privacy-focused analytics tools (such as Vercel Speed Insights and Web Analytics). These logs record non-personally identifiable data, including browser type, referring pages, timestamps, and page interactions to monitor site performance and Core Web Vitals.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-3">3. Advertising Partners & Cookies</h2>
          <p>
            Third-party advertising networks (including Adsterra and programmatic ad exchanges) may use cookies, web beacons, and JavaScript to measure ad effectiveness and serve relevant advertisements. These networks automatically receive technical identifiers such as IP addresses. Wanderline has no direct control over third-party advertising cookies.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-3">4. GDPR & CCPA Rights</h2>
          <p>
            You have the right to request access to, correction of, or permanent deletion of your personal data (such as newsletter subscriptions). You can unsubscribe anytime using the link in our emails or by contacting our team.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-3">5. Contact</h2>
          <p>
            For privacy-related inquiries, reach out via our <a href="/contact" className="text-amber-700 underline">contact page</a>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}