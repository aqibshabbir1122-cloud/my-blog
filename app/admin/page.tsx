'use client'

import { useState, useTransition } from 'react'
import { publishArticle } from './actions'

const CATEGORIES = ['Technology', 'Finance', 'Travel', 'Culture', 'Crime', 'Investigation']

export default function AdminPage() {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [isSlugManual, setIsSlugManual] = useState(false)
  const [category, setCategory] = useState(CATEGORIES[0])
  const [coverImage, setCoverImage] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(true)

  // Auto-slugify title unless manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!isSlugManual) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      )
    }
  }

  // Calculate estimated reading time
  const readingTime = Math.max(1, Math.ceil((content.trim().split(/\s+/).filter(Boolean).length || 1) / 200))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await publishArticle(formData)
      if (res.success) {
        setStatus({ type: 'success', message: `Article published successfully! Slug: /article/${res.slug}` })
        setTitle('')
        setSlug('')
        setIsSlugManual(false)
        setCoverImage('')
        setExcerpt('')
        setContent('')
      } else {
        setStatus({ type: 'error', message: res.message })
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#0d0f12] text-zinc-100 antialiased py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-xl font-bold tracking-tight text-white uppercase tracking-wider font-mono">
                Wanderline / Studio
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Editorial Terminal & Real-Time ISR Dispatcher
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded">
              ~{readingTime} min read
            </span>
            <span className="text-xs font-mono px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded">
              {content.length} chars
            </span>
          </div>
        </header>

        {/* Status Toast */}
        {status && (
          <div
            className={`p-4 rounded-lg text-sm border font-mono ${
              status.type === 'success'
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                : 'bg-rose-950/40 text-rose-300 border-rose-800/60'
            }`}
          >
            {status.type === 'success' ? '✔ ' : '✖ '}
            {status.message}
          </div>
        )}

        {/* Editorial Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Content Column (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono tracking-wider text-zinc-400">
                  Headline
                </label>
                <input
                  name="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter investigative title..."
                  required
                  className="w-full px-4 py-3 bg-zinc-900/90 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 text-lg font-medium focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono tracking-wider text-zinc-400">
                  Deck / Subheading
                </label>
                <textarea
                  name="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  placeholder="Brief synopsis for feeds and search engines..."
                  required
                  className="w-full px-4 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 text-sm focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                />
              </div>

              {/* Markdown Content */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono tracking-wider text-zinc-400 flex justify-between">
                  <span>Markdown Content</span>
                  <span className="text-zinc-500">Supports headers, tables, code blocks</span>
                </label>
                <textarea
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={16}
                  placeholder="# Introduction&#10;&#10;Write the investigative report..."
                  required
                  className="w-full p-4 bg-zinc-900/90 border border-zinc-800 rounded-lg text-zinc-100 font-mono text-sm leading-relaxed focus:outline-none focus:border-zinc-500 transition-colors resize-y"
                />
              </div>
            </div>

            {/* Sidebar Column (1 Col) */}
            <div className="space-y-6">
              
              {/* Metadata Panel */}
              <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-lg space-y-5">
                <h2 className="text-xs uppercase font-mono tracking-wider text-zinc-400 border-b border-zinc-800/80 pb-2">
                  Publication Settings
                </h2>

                {/* Slug Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">URL Slug</label>
                  <input
                    name="slug"
                    value={slug}
                    onChange={(e) => {
                      setIsSlugManual(true)
                      setSlug(e.target.value)
                    }}
                    required
                    placeholder="article-slug"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Desk / Category</label>
                  <select
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cover Image Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Cover Image URL</label>
                  <input
                    name="cover_image"
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    required
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500"
                  />
                  {coverImage && (
                    <div className="mt-2 rounded overflow-hidden border border-zinc-800 h-28 bg-zinc-950">
                      <img
                        src={coverImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                      />
                    </div>
                  )}
                </div>

                {/* Published Checkbox */}
                <div className="pt-2 border-t border-zinc-800/60">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      name="published"
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="h-4 w-4 rounded bg-zinc-950 border-zinc-800 text-emerald-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-xs font-mono text-zinc-300">Publish to live feed</span>
                  </label>
                </div>
              </div>

              {/* Publish Action Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 bg-zinc-100 text-zinc-900 font-mono font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-white hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <span className="h-3 w-3 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                    Dispatching...
                  </>
                ) : (
                  'Deploy Dispatch'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}