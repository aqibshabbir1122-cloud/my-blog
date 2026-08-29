'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import AdSlot from '@/components/AdSlot'
import { calculateReadingTime } from '@/lib/reading-time'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export default function ArticlePage({ params }: Props) {
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [readingProgress, setReadingProgress] = useState(0)

  // Scroll reading progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100
        setReadingProgress(Math.min(100, Math.max(0, progress)))
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch article data
  useEffect(() => {
    async function loadArticle() {
      const resolvedParams = await params
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', resolvedParams.slug)
        .single()

      if (error || !data) {
        setLoading(false)
        return
      }

      setArticle(data)
      setLoading(false)
    }

    loadArticle()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!article) {
    return notFound()
  }

  const readTime = calculateReadingTime(article.content || '')
  const categorySlug = (article.category || 'general').toLowerCase().replace(/\s+/g, '-')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt || '',
    image: article.cover_image ? [article.cover_image] : ['https://www.wanderline.site/og-default.jpg'],
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: [
      {
        '@type': 'Person',
        name: 'Wanderline Editorial Desk',
        url: 'https://www.wanderline.site',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Wanderline',
      url: 'https://www.wanderline.site',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.wanderline.site/icon.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.wanderline.site/article/${article.slug}`,
    },
    articleSection: article.category,
  }

  return (
    <div className="bg-[#faf9f6] min-h-screen flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900">
      {/* Google SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-transparent">
        <div
          className="h-full bg-amber-800 transition-all duration-75 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div>
        <SiteHeader variant="plain" />

        <main className="max-w-4xl mx-auto px-6 py-12">
          {/* Metadata Row */}
          <div className="mb-6 flex items-center space-x-2 text-xs uppercase tracking-widest font-mono text-zinc-500">
            <Link
              href={`/category/${categorySlug}`}
              className="text-amber-800 hover:underline font-semibold"
            >
              {article.category}
            </Link>
            <span>•</span>
            <time>
              {new Date(article.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            <span>•</span>
            <span>{readTime}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-950 leading-tight mb-6">
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-lg sm:text-xl font-serif italic text-gray-700 leading-relaxed mb-8 border-l-2 border-amber-800 pl-4">
              {article.excerpt}
            </p>
          )}

          {/* Featured Cover Image */}
          {article.cover_image && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl mb-10 shadow-sm border border-gray-100">
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          )}

          {/* Top Banner Ad Slot */}
          <div className="my-8">
            <AdSlot format="banner" className="w-full flex justify-center" />
          </div>

          {/* Formatted Markdown Content */}
          <article className="prose prose-lg max-w-none font-serif text-gray-800 leading-relaxed prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-950 prose-a:text-amber-800 prose-a:underline hover:prose-a:text-amber-950 prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-ul:list-disc prose-ol:list-decimal prose-img:rounded-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content || ''}
            </ReactMarkdown>
          </article>

          {/* Dedicated Bottom Full-Width Ad Slot */}
          <section className="mt-16 pt-8 border-t border-zinc-200">
            <div className="bg-zinc-100/70 border border-zinc-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[120px]">
              <span className="text-[10px] tracking-widest uppercase font-mono text-zinc-400 mb-2">
                Advertisement
              </span>
              <AdSlot format="banner-728x90" className="w-full flex justify-center" />
            </div>
          </section>
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}