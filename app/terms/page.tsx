import { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Terms of Service | Wanderline',
  description: 'Terms of Service and editorial conditions for Wanderline.',
  alternates: {
    canonical: 'https://www.wanderline.site/terms',
  },
}

export default function TermsPage() {
  return (
    <div className="bg-[#faf9f6] min-h-screen">
      <SiteHeader variant="plain" />
      <main className="max-w-3xl mx-auto px-6 py-14">
        <h1 className="text-4xl font-serif text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-xs text-gray-400 mb-8 font-mono">Last updated: August 2026</p>

        <div className="prose prose-gray max-w-none text-gray-800 space-y-6 font-serif leading-relaxed text-base">
          <p>
            By accessing Wanderline (https://www.wanderline.site), you agree to comply with and be bound by these Terms of Service.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-3">1. Intellectual Property</h2>
          <p>
            All original text, essays, analysis, and custom site layouts published on Wanderline are the intellectual property of Wanderline unless otherwise noted. Unauthorized reproduction, scraping, or redistribution without written permission is prohibited.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-3">2. Content Accuracy & Disclaimers</h2>
          <p>
            Our travel dispatches, culture essays, and reporting are provided for informational, historical, and educational purposes. While we strive for factual precision, conditions on the ground change rapidly. Wanderline is not liable for travel disruptions, visa changes, or logistical outcomes resulting from content on this site.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-3">3. External Links & Advertisements</h2>
          <p>
            Wanderline contains links to external sites and displays third-party advertisements. We do not endorse or assume liability for the content, privacy policies, or commercial practices of third-party platforms.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-3">4. Modifications</h2>
          <p>
            We reserve the right to revise these terms at any time. Continued use of Wanderline following updates constitutes acceptance of the modified terms.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}