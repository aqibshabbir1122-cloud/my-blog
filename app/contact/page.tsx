import { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Contact Us | Wanderline',
  description: 'Get in touch with the editorial team at Wanderline for story tips, inquiries, and dispatches.',
  alternates: {
    canonical: 'https://www.wanderline.site/contact',
  },
}

export default function ContactPage() {
  return (
    <div className="bg-[#faf9f6] min-h-screen">
      <SiteHeader variant="plain" />

      <main className="max-w-3xl mx-auto px-6 py-14">
        <header className="mb-10 pb-6 border-b border-gray-200">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block mb-2">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif text-gray-900 leading-tight">
            Contact the Editorial Desk
          </h1>
          <p className="text-gray-600 font-serif text-lg mt-3">
            Have a dispatch, story lead, correction, or business inquiry? Reach out directly.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
              Story Pitches & Leads
            </h2>
            <p className="text-lg font-serif font-medium text-gray-900 mb-1">
              editorial@wanderline.site
            </p>
            <p className="text-xs text-gray-500">
              For on-the-ground reporting, dispatches, and culture essay pitches.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
              General & Partnerships
            </h2>
            <p className="text-lg font-serif font-medium text-gray-900 mb-1">
              desk@wanderline.site
            </p>
            <p className="text-xs text-gray-500">
              For technical inquiries, licensing, and advertising partnerships.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-serif text-gray-900 mb-6">Send a Message</h2>
          <form className="space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5 block">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5 block">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5 block">
                Subject
              </label>
              <input
                type="text"
                required
                placeholder="Story Pitch / Question"
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5 block">
                Message
              </label>
              <textarea
                rows={5}
                required
                placeholder="Write your message here..."
                className="w-full border border-gray-300 rounded-lg p-3.5 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-gray-900 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-gray-800 transition"
            >
              Send Dispatch
            </button>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}