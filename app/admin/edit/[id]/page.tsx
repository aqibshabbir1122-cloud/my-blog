'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Category {
  id: string
  name: string
  slug: string
}

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      const [categoriesRes, articleRes] = await Promise.all([
        supabase
          .from('categories')
          .select('id, name, slug')
          .order('name', { ascending: true }),
        supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single(),
      ])

      if (categoriesRes.data) {
        setCategories(categoriesRes.data)
      }

      if (articleRes.data) {
        const article = articleRes.data
        setTitle(article.title || '')
        setSlug(article.slug || '')
        setCategory(article.category || (categoriesRes.data?.[0]?.name ?? ''))
        setExcerpt(article.excerpt || '')
        setCoverImage(article.cover_image || '')
        setContent(article.content || '')
        setPublished(Boolean(article.published))
      }

      if (articleRes.error) {
        setError('Could not load article data.')
      }

      setLoading(false)
    }

    if (id) {
      loadData()
    }
  }, [id])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const { error: updateError } = await supabase
      .from('articles')
      .update({
        title: title.trim(),
        slug: slug.trim(),
        category,
        excerpt: excerpt.trim(),
        cover_image: coverImage.trim(),
        content: content.trim(),
        published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this article? This action cannot be undone.'
    )
    if (!confirmed) return

    setDeleting(true)
    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)

    setDeleting(false)

    if (deleteError) {
      setError(deleteError.message)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center text-sm text-gray-500 font-mono">
        Loading article data...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-gray-900">Edit Article</h1>
            <p className="text-xs text-gray-500 mt-1">ID: {id}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete Article'}
            </button>
            <a
              href="/admin"
              className="text-sm text-gray-500 hover:text-gray-900 transition"
            >
              &larr; Back to Dashboard
            </a>
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="space-y-6 bg-white p-8 rounded-xl border border-gray-200 shadow-sm"
        >
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5 block">
              Article Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5 block">
              URL Slug (Canonical Path)
            </label>
            <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden px-3 bg-gray-50 text-gray-500 text-sm">
              <span>https://www.wanderline.site/article/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full bg-transparent px-1 py-2.5 text-gray-900 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5 block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5 block">
                Cover Image URL
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                SEO Excerpt / Pull-Quote
              </label>
              <span
                className={`text-xs ${
                  excerpt.length > 160 ? 'text-amber-600' : 'text-gray-400'
                }`}
              >
                {excerpt.length}/160 chars
              </span>
            </div>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="Brief summary for Google search results and article pull-quotes..."
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5 block">
              Article Content (Markdown or plain paragraphs)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              required
              className="w-full border border-gray-300 rounded-lg p-3.5 text-sm font-sans leading-relaxed focus:ring-2 focus:ring-gray-900 focus:outline-none"
            />
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded text-gray-900 border-gray-300 focus:ring-gray-900"
              />
              <span className="text-sm font-medium text-gray-800">
                Published on Wanderline
              </span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="bg-gray-900 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}