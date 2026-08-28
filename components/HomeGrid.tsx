'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import NewsletterForm from './NewsletterForm'
import AdSlot from './AdSlot'

interface Article {
  id: string
  slug: string
  title: string
  excerpt: string | null
  category: string
  cover_image: string | null
  created_at: string
}

const categoryColors: Record<string, string> = {
  Travel: 'bg-blue-100 text-blue-800',
  'World Stories': 'bg-amber-100 text-amber-800',
  Crime: 'bg-red-100 text-red-800',
  Culture: 'bg-purple-100 text-purple-800',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function HomeGrid({ articles }: { articles: Article[] }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  // Derive unique categories from available articles
  const filterList = useMemo(() => {
    const unique = Array.from(
      new Set(articles.map((a) => a.category).filter(Boolean))
    )
    return ['All', ...unique]
  }, [articles])

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesCategory =
        activeFilter === 'All' ||
        a.category?.toLowerCase() === activeFilter.toLowerCase()

      const matchesSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(search.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [articles, activeFilter, search])

  const trending = useMemo(() => articles.slice(0, 3), [articles])

  return (
    <div>
      {/* Editorial Header & Search */}
      <div className="text-center py-10 mb-8 max-w-2xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-serif text-gray-900 mb-4 leading-tight">
          Stories from every corner of the world
        </h2>
        <p className="text-gray-600 mb-6 text-base sm:text-lg font-serif">
          Travel notes, world events, and the crime and culture stories behind them.
        </p>
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            id="homepage-search"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories, topics, places..."
            className="w-full border border-gray-300 rounded-full px-5 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
          />
        </div>
      </div>

      {/* Trending Section (Only displayed when not searching) */}
      {search === '' && trending.length > 0 && (
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">
            Trending this week
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {trending.map((article) => (
              <Link
                href={`/article/${article.slug}`}
                key={article.id}
                className="group block rounded-xl overflow-hidden bg-white border border-gray-200 hover:-translate-y-1 hover:shadow-md transition duration-200"
              >
                {article.cover_image && (
                  <div className="relative w-full h-32 bg-gray-100 overflow-hidden">
                    <Image
                      src={article.cover_image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      categoryColors[article.category] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {article.category}
                  </span>
                  <p className="text-sm font-serif font-medium text-gray-900 group-hover:text-blue-600 transition mt-2 leading-snug line-clamp-2">
                    {article.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Filter Pills */}
      <div className="flex gap-2 mb-8 flex-wrap items-center">
        {filterList.map((categoryName) => (
          <button
            key={categoryName}
            onClick={() => setActiveFilter(categoryName)}
            className={`text-xs sm:text-sm px-4 py-1.5 rounded-full border transition font-medium ${
              activeFilter === categoryName
                ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            {categoryName}
          </button>
        ))}
      </div>

      {/* Main Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((article, index) => (
          <div key={article.id} className="contents">
            <Link
              href={`/article/${article.slug}`}
              className="group flex flex-col justify-between rounded-xl overflow-hidden bg-white border border-gray-200 hover:-translate-y-1 hover:shadow-lg transition duration-200 p-3"
            >
              <div>
                {article.cover_image && (
                  <div className="relative w-full h-44 rounded-lg overflow-hidden mb-3 bg-gray-100">
                    <Image
                      src={article.cover_image}
                      alt={article.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    categoryColors[article.category] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {article.category}
                </span>
                <h3 className="text-lg font-serif font-semibold text-gray-900 group-hover:text-blue-600 transition mt-2 mb-1.5 leading-snug">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-gray-600 font-serif line-clamp-2 mb-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                {formatDate(article.created_at)}
              </p>
            </Link>

            {/* In-feed ad unit inserted after the 6th article */}
            {index === 5 && (
              <div className="sm:col-span-2 lg:col-span-3 my-4">
                <AdSlot slotId="home-in-feed" format="banner-728x90" />
              </div>
            )}
          </div>
        ))}

        <div className="sm:col-span-2 lg:col-span-1">
          <NewsletterForm variant="purple" />
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 font-serif text-lg">No stories match your search.</p>
          <button
            onClick={() => {
              setSearch('')
              setActiveFilter('All')
            }}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}