import { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Disclaimer | Wanderline',
  description: 'Editorial, travel safety, advertising, and illustration disclaimers for Wanderline.',
  alternates: {
    canonical: 'https://www.wanderline.site/disclaimer',
  },
}

export default function DisclaimerPage() {
  return (
    <div className="bg-[#faf9f6] min-h-screen">
      <SiteHeader variant="plain" />

      <main className="max-w-3xl mx-auto px-6 py-14">
        <header className="mb-10 pb-6 border-b border-gray-200">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block mb-2">
            Legal & Editorial
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif text-gray-900 leading-tight">
            Editorial Disclaimer
          </h1>
          <p className="text-xs text-gray-400 mt-2 font-mono">Last updated: August 2026</p>
        </header>

        <div className="prose prose-gray max-w-none text-gray-800 space-y-6 font-serif leading-relaxed text-base">
          <p>
            The information published on <strong className="font-semibold text-gray-900">Wanderline</strong> (https://www.wanderline.site) is provided for general informational, educational, and narrative storytelling purposes only.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-3">
            1. Travel & Field Safety
          </h2>
          <p>
            Field dispatches, route descriptions, and travel advisories reflect conditions at the time of reporting. Border regulations, transit availability, political stability, and safety conditions change without notice. Readers are solely responsible for verifying travel requirements, visa regulations, and local laws with official governmental authorities before embarking on any journey. Wanderline assumes no liability for travel disruptions, financial losses, or physical injury.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-3">
            2. Editorial & Narrative Independence
          </h2>
          <p>
            Wanderline publishes independent narrative journalism, investigative essays, and cultural analyses. Opinions expressed in individual dispatches belong to the respective contributors and authors. While we apply standard fact-checking practices, historical narratives and investigative pieces may involve differing perspectives and interpretations.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-3">
            3. Advertising & Sponsored Content
          </h2>
          <p>
            Wanderline displays third-party programmatic advertisements and may feature sponsored content or affiliate links. Displaying an advertisement does not constitute an endorsement, warranty, or recommendation of the advertised product, service, or business entity. Wanderline is not responsible for the claims, fulfillment, or practices of third-party advertisers.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-3">
            4. External Links
          </h2>
          <p>
            Our articles may link to external websites that are not maintained or controlled by Wanderline. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on external sites.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-3">
            5. Contact Information
          </h2>
          <p>
            If you have questions regarding our editorial standards, corrections, or legal notices, please reach out through our{' '}
            <Link href="/contact" className="text-amber-700 underline hover:text-amber-900 transition">
              contact desk
            </Link>.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}