import { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'About | Wanderline',
  description: 'The editorial mission, dispatches, and global reporting behind Wanderline.',
  alternates: {
    canonical: 'https://www.wanderline.site/about',
  },
}

export default function AboutPage() {
  return (
    <div className="bg-[#faf9f6] min-h-screen">
      <SiteHeader variant="plain" />
      <main className="max-w-3xl mx-auto px-6 py-14">
        <header className="mb-8 pb-6 border-b border-gray-200">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block mb-2">
            Our Mission
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif text-gray-900 leading-tight">
            Stories from every corner of the world.
          </h1>
        </header>

        <div className="prose prose-gray max-w-none text-gray-800 space-y-6 font-serif leading-relaxed text-lg">
          <p>
            <strong className="font-semibold text-gray-900">Wanderline</strong> is an independent digital publication dedicated to narrative journalism, global travel dispatches, investigative cultural pieces, and the human stories behind world events.
          </p>

          <p>
            In an era of generic aggregated content, Wanderline focuses on deliberate, long-form storytelling. We explore the disappearing fado houses of Lisbon, the isolated communities of the Atlas Mountains, the mechanics of modern travel scams, and the intersection of digital networks with local traditions.
          </p>

          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-4">
            Our Core Beats
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-8">
            <div className="p-5 bg-white rounded-xl border border-gray-200">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-100 text-blue-800 block w-fit mb-2">
                Travel
              </span>
              <p className="text-sm text-gray-600 font-serif">
                Field dispatches, remote transit routes, and slow-travel essays across overlooked geography.
              </p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-gray-200">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-800 block w-fit mb-2">
                World Stories
              </span>
              <p className="text-sm text-gray-600 font-serif">
                Human-interest investigations, historical shifts, and community rebuilding efforts worldwide.
              </p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-gray-200">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-red-100 text-red-800 block w-fit mb-2">
                Crime
              </span>
              <p className="text-sm text-gray-600 font-serif">
                Investigations into black-market networks, travel scams, and regional contraband economies.
              </p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-gray-200">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 block w-fit mb-2">
                Digital Culture
              </span>
              <p className="text-sm text-gray-600 font-serif">
                Surveillance, border technology, the remote economy, and how the internet reshapes modern societies.
              </p>
            </div>
          </div>

          <p>
            Have a story lead or field dispatch? Read our editorial standards or connect directly through our{' '}
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