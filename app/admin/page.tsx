'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import LogoutButton from '@/components/LogoutButton'

interface Article {
  id: string
  title: string
  slug: string
  category: string
  published: boolean
  created_at: string
  updated_at?: string
}

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [categories, setCategories] = useState<string[]>([])
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  useEffect(() => {
    fetchArticles()
  }, [])

  async function fetchArticles() {
    setLoading(true)
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, category, published, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (data && !error) {
      setArticles(data)
      const uniqueCategories = Array.from(new Set(data.map((a) => a.category).filter(Boolean)))
      setCategories(uniqueCategories)
    }
    setLoading(false)
  }

  const togglePublishStatus = async (article: Article) => {
    setActionLoadingId(article.id)
    const newStatus = !article.published

    const { error } = await supabase
      .from('articles')
      .update({
        published: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', article.id)

    if (!error) {
      setArticles((prev) =>
        prev.map((item) =>
          item.id === article.id ? { ...item, published: newStatus } : item
        )
      )
    }
    setActionLoadingId(null)
  }

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.slug.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'published'
          ? article.published
          : !article.published

      const matchesCategory =
        categoryFilter === 'all' ? true : article.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [articles, searchQuery, statusFilter, categoryFilter])

  const publishedCount = articles.filter((a) => a.published).length
  const draftCount = articles.length - publishedCount

  return (
    <div className="min-h-screen bg-[#faf9f6] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif text-gray-900">Articles Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage, search, and publish your dispatches
            </p>
          </div>
          <div className="flex items-center gap-3">
            <LogoutButton />
            <Link
              href="/admin/new"
              className="bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-800 transition"
            >
              + New Article
            </Link>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-full md:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                statusFilter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({articles.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                statusFilter === 'published'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                statusFilter === 'draft'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Drafts ({draftCount})
            </button>
          </div>

          {/* Search and Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search title or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-lg px-3.5 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        {/* Article Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-sm text-gray-500 font-mono">
              Loading articles...
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-500 text-sm">No articles matched your filter criteria.</p>
              {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('all')
                    setCategoryFilter('all')
                  }}
                  className="mt-2 text-xs text-blue-600 hover:underline"
                >
                  Reset all filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/75 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3.5">Title & Path</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Created</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/edit/${article.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600 transition block"
                        >
                          {article.title}
                        </Link>
                        <span className="text-xs text-gray-400 font-mono">
                          /article/{article.slug}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-medium">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => togglePublishStatus(article)}
                          disabled={actionLoadingId === article.id}
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition ${
                            article.published
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              article.published ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {actionLoadingId === article.id
                            ? 'Updating...'
                            : article.published
                            ? 'Published'
                            : 'Draft'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(article.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        {article.published && (
                          <Link
                            href={`/article/${article.slug}`}
                            target="_blank"
                            className="text-xs text-gray-500 hover:text-gray-900 transition"
                          >
                            View &nearr;
                          </Link>
                        )}
                        <Link
                          href={`/admin/edit/${article.id}`}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 transition"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}