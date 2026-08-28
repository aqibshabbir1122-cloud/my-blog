'use client'

import { useState, FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: null, message: '' })

    try {
      const { error } = await supabase.from('messages').insert([
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        },
      ])

      if (error) throw error

      setStatus({
        type: 'success',
        message: 'Your dispatch has been received. Our editorial team will review it shortly.',
      })
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again or email us directly.',
      })
    } finally {
      setLoading(false)
    }
  }

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

          {status.type === 'success' && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
              {status.message}
            </div>
          )}

          {status.type === 'error' && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5 block">
                Your Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message here..."
                className="w-full border border-gray-300 rounded-lg p-3.5 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Dispatch'}
            </button>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}