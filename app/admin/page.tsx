'use client'

import { useState } from 'react'
import { publishArticle } from './actions'

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ success: boolean; text: string } | null>(null)

  function autoGenerateSlug(e: React.ChangeEvent<HTMLInputElement>) {
    const slugField = document.getElementById('article-slug') as HTMLInputElement
    if (slugField && !slugField.dataset.modified) {
      slugField.value = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    const response = await publishArticle(formData)

    setLoading(false)
    setStatus({ success: response.success, text: response.message })

    if (response.success) {
      form.reset()
      const slugField = document.getElementById('article-slug') as HTMLInputElement
      if (slugField) delete slugField.dataset.modified
    }
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <div className="border-b pb-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Wanderline Publishing Studio</h1>
        <span className="text-xs px-2.5 py-1 bg-zinc-100 rounded font-mono">Server Action Active</span>
      </div>

      {status && (
        <div
          className={`p-4 mb-6 rounded text-sm ${
            status.success
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {status.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            required
            onChange={autoGenerateSlug}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Article title"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              id="article-slug"
              name="slug"
              required
              onChange={() => {
                const el = document.getElementById('article-slug')
                if (el) el.dataset.modified = 'true'
              }}
              className="w-full px-3 py-2 border rounded-md font-mono text-sm"
              placeholder="article-url-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select name="category" className="w-full px-3 py-2 border rounded-md">
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Travel">Travel</option>
              <option value="Culture">Culture</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cover Image URL</label>
          <input
            name="cover_image"
            type="url"
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea
            name="excerpt"
            rows={2}
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Brief summary for indexing and cards"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content (Markdown)</label>
          <textarea
            name="content"
            rows={10}
            required
            className="w-full px-3 py-2 border rounded-md font-mono text-sm"
            placeholder="# Write dispatch content here..."
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="published"
            name="published"
            type="checkbox"
            defaultChecked
            className="h-4 w-4"
          />
          <label htmlFor="published" className="text-sm font-medium">
            Publish immediately (triggers cache flush & IndexNow)
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-black text-white rounded-md hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? 'Publishing & Clearing Cache...' : 'Publish Article'}
        </button>
      </form>
    </main>
  )
}