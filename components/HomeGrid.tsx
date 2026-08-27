'use client'

import { useState } from 'react'
import Image from 'next/image'
import NewsletterForm from './NewsletterForm'

type Article = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  cover_image: string
  created_at: string
}

const categoryColors: Record<string, string> = {
  Travel: 'bg-blue-100 text-blue-800',
  'World Stories': 'bg-amber-100 text-amber-800',
  Crime: 'bg-red-100 text-red-800',
  Culture: 'bg-purple-100 text-purple-800',
}

const filters = ['All', 'Travel', 'World Stories', 'Crime', 'Culture']

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function HomeGrid({ articles }: { articles: Article[] }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = articles.filter((a) => {
    const matchesCategory = activeFilter === 'All' || a.category === activeFilter
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const trending = articles.slice(0, 3)

  return (
    <div>
      <div className="text-center py-10 mb-10">
        <h2 className="text-4xl font-serif mb-3 leading-tight">Stories from every corner of the world</h2>
        <p className="text-gray-600 mb-5">Travel notes, world events, and the crime and culture stories behind them.</p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search stories"
          className="border border-gray-300 rounded-full px-4 py-2 text-sm w-full max-w-xs"
        />
      </div>

      {search === '' && (
        <div className="mb-10">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">Trending this week</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {trending.map((article) => (
              <a href={"/article/" + article.slug} key={article.id} className="block rounded-lg overflow-hidden bg-white border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-all duration-150">
                {article.cover_image && (
                  <div className="relative w-full h-24">
                    <Image src={article.cover_image} alt={article.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                  </div>
                )}
                <div className="p-3">
                  <span className={"text-xs px-2 py-0.5 rounded " + (categoryColors[article.category] || 'bg-gray-200 text-gray-800')}>
                    {article.category}
                  </span>
                  <p className="text-sm font-medium mt-1">{article.title}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={activeFilter === f ? 'text-sm px-4 py-1.5 rounded-full border bg-gray-900 text-white border-gray-900' : 'text-sm px-4 py-1.5 rounded-full border bg-white text-gray-600 border-gray-300 hover:border-gray-400'}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((article, index) => (
          <a href={"/article/" + article.slug} key={article.id} className="block hover:-translate-y-1 hover:shadow-md transition-all duration-150 rounded-lg overflow-hidden bg-white border border-transparent hover:border-gray-200 p-1">
            {article.cover_image && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden mb-2">
                <Image src={article.cover_image} alt={article.title} fill priority={index === 0} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
              </div>
            )}
            <div className="px-2 pb-2">
              <span className={"text-xs px-2 py-1 rounded " + (categoryColors[article.category] || 'bg-gray-200 text-gray-800')}>
                {article.category}
              </span>
              <h4 className="text-base font-medium mt-2 mb-1">{article.title}</h4>
              <p className="text-sm text-gray-600 mb-1">{article.excerpt}</p>
              <p className="text-xs text-gray-400">{formatDate(article.created_at)}</p>
            </div>
          </a>
        ))}

        <NewsletterForm variant="purple" />
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-500 mt-6">No stories match your search.</p>
      )}
    </div>
  )
}