'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  cover_image: string
  category: string
  created_at: string
}

interface HomeGridProps {
  articles: Article[]
}

export default function HomeGrid({ articles }: HomeGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category)))]
  const filteredArticles =
    activeCategory === 'All'
      ? articles
      : articles.filter((a) => a.category === activeCategory)

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 font-serif">
        No stories published yet.
      </div>
    )
  }

  const featured = filteredArticles[0]
  const listArticles = filteredArticles.slice(1)

  return (
    <div className="w-full">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-gray-200 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Article (LCP Element) */}
      {featured && (
        <article className="mb-12 group">
          <Link href={`/article/${featured.slug}`} className="block">
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-gray-100 mb-4 border border-gray-200">
              <Image
                src={featured.cover_image}
                alt={featured.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1024px"
                className="object-cover group-hover:scale-[1.02] transition duration-500 ease-out"
              />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 block mb-1">
              {featured.category}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif text-gray-900 font-bold group-hover:text-amber-700 transition leading-tight mb-2">
              {featured.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-serif line-clamp-2 leading-relaxed">
              {featured.excerpt}
            </p>
          </Link>
        </article>
      )}

      {/* Secondary Stories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {listArticles.map((article) => (
          <article key={article.id} className="group flex flex-col justify-between">
            <Link href={`/article/${article.slug}`} className="block">
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 mb-3 border border-gray-200">
                <Image
                  src={article.cover_image}
                  alt={article.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-[1.03] transition duration-300"
                />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 block mb-1">
                {article.category}
              </span>
              <h3 className="text-lg font-serif text-gray-900 font-bold group-hover:text-amber-700 transition leading-snug mb-1.5">
                {article.title}
              </h3>
              <p className="text-xs text-gray-600 font-serif line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}