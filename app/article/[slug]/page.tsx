export const revalidate = 3600

import { cache } from 'react'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ReadingProgressBar from '@/components/ReadingProgressBar'
import dynamic from 'next/dynamic'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import AdSlot from '@/components/AdSlot'

const ShareButtons = dynamic(() => import('@/components/ShareButtons'))
const ReactionBar = dynamic(() => import('@/components/ReactionBar'))
const NewsletterForm = dynamic(() => import('@/components/NewsletterForm'))

const categoryColors: Record<string, string> = {
  Travel: 'bg-blue-100 text-blue-800',
  'World Stories': 'bg-amber-100 text-amber-800',
  Crime: 'bg-red-100 text-red-800',
  Culture: 'bg-purple-100 text-purple-800',
}

const categoryTextColors: Record<string, string> = {
  Travel: 'text-blue-700',
  'World Stories': 'text-amber-700',
  Crime: 'text-red-700',
  Culture: 'text-purple-700',
}

const categoryBarColors: Record<string, string> = {
  Travel: 'bg-blue-700',
  'World Stories': 'bg-amber-700',
  Crime: 'bg-red-700',
  Culture: 'bg-purple-700',
}

const categoryBorderColors: Record<string, string> = {
  Travel: 'border-blue-300',
  'World Stories': 'border-amber-300',
  Crime: 'border-red-300',
  Culture: 'border-purple-300',
}

const categorySidebarBg: Record<string, string> = {
  Travel: 'bg-blue-50',
  'World Stories': 'bg-amber-50',
  Crime: 'bg-red-50',
  Culture: 'bg-purple-50',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function estimateReadTime(text: string) {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

const getArticle = cache(async (slug: string) => {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  return data
})

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return { title: 'Article not found' }
  }

  const description = article.excerpt || article.content.slice(0, 155).trim()

  return {
    title: `${article.title} | Wanderline`,
    description,
    alternates: {
      canonical: `https://www.wanderline.site/article/${slug}`,
    },
    openGraph: {
      title: article.title,
      description,
      url: `https://www.wanderline.site/article/${slug}`,
      siteName: 'Wanderline',
      images: article.cover_image ? [{ url: article.cover_image, width: 1200, height: 630, alt: article.title }] : [],
      type: 'article',
      publishedTime: article.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: article.cover_image ? [article.cover_image] : [],
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const [relatedRes, moreStoriesRes, reactionsRes] = await Promise.all([
    supabase
      .from('articles')
      .select('id, title, slug, category')
      .eq('published', true)
      .eq('category', article.category)
      .neq('slug', slug)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('articles')
      .select('id, title, slug, cover_image, category')
      .eq('published', true)
      .neq('category', article.category)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('reactions')
      .select('reaction_type, count')
      .eq('article_slug', slug),
  ])

  const related = relatedRes.data || []
  const moreStories = moreStoriesRes.data || []
  const reactionRows = reactionsRes.data || []

  const reactionCounts: Record<string, number> = {}
  reactionRows.forEach((r) => {
    reactionCounts[r.reaction_type] = r.count
  })

  const readTime = estimateReadTime(article.content)
  const badgeColor = categoryColors[article.category] || 'bg-gray-200 text-gray-800'
  const textColor = categoryTextColors[article.category] || 'text-gray-700'
  const borderColor = categoryBorderColors[article.category] || 'border-gray-300'
  const sidebarBg = categorySidebarBg[article.category] || 'bg-gray-50'
  const barColor = categoryBarColors[article.category] || 'bg-gray-700'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.wanderline.site/article/${slug}`,
    },
    headline: article.title,
    description: article.excerpt || article.content.slice(0, 155),
    image: article.cover_image ? [article.cover_image] : [],
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: {
      '@type': 'Organization',
      name: 'Wanderline',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Wanderline',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.wanderline.site/icon.svg',
      },
    },
  }

  const paragraphs: string[] = article.content.split('\n').filter((p: string) => p.trim().length > 0)
  const firstParagraph = paragraphs[0] || ''
  const restParagraphs = paragraphs.slice(1)
  const firstLetter = firstParagraph.charAt(0)
  const restOfFirstParagraph = firstParagraph.slice(1)

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      <SiteHeader variant="plain" />
      <ReadingProgressBar color={barColor} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 transition">
            &larr; Back to Wanderline
          </Link>

          {article.cover_image && (
            <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden mt-6 mb-6">
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded ${badgeColor}`}>
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl font-serif mb-4 leading-tight text-gray-900">{article.title}</h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-600 font-medium">
              W
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Wanderline Staff</p>
              <p className="text-xs text-gray-400">
                {formatDate(article.created_at)} · {readTime} min read
              </p>
            </div>
          </div>

          {article.excerpt && (
            <div className={`border-l-4 ${borderColor} pl-4 mb-6`}>
              <p className={`font-serif italic text-lg ${textColor}`}>
                &ldquo;{article.excerpt}&rdquo;
              </p>
            </div>
          )}

          <p className="text-lg leading-relaxed text-gray-800 mb-5">
            <span className={`font-serif text-5xl float-left leading-[0.8] mr-2 mt-1 ${textColor}`}>
              {firstLetter}
            </span>
            {restOfFirstParagraph}
          </p>

          {restParagraphs.map((para, i) => (
            <div key={i}>
              <p className="text-lg leading-relaxed text-gray-800 mb-5">
                {para}
              </p>
              {/* Insert in-content banner after the 3rd paragraph */}
              {i === 2 && (
                <AdSlot format="banner-728x90" className="my-6" />
              )}
            </div>
          ))}

          <ShareButtons title={article.title} />
          <ReactionBar articleSlug={slug} initialCounts={reactionCounts} />

          {moreStories.length > 0 && (
            <div className="mt-12 border-t border-gray-200 pt-8">
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-4">You might also like</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {moreStories.map((s) => (
                  <Link href={`/article/${s.slug}`} key={s.id} className="block group">
                    {s.cover_image && (
                      <div className="relative w-full h-24 rounded-lg overflow-hidden mb-2">
                        <Image
                          src={s.cover_image}
                          alt={s.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[s.category] || 'bg-gray-200 text-gray-800'}`}>
                      {s.category}
                    </span>
                    <p className="text-sm font-medium mt-1 text-gray-900 group-hover:text-blue-600 transition">
                      {s.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-1 space-y-6">
          {related.length > 0 && (
            <div className={`${sidebarBg} rounded-xl p-5 border border-gray-100`}>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-4 font-semibold">
                More in {article.category}
              </p>
              <div className="space-y-4">
                {related.map((r) => (
                  <Link
                    href={`/article/${r.slug}`}
                    key={r.id}
                    className="block text-sm font-medium text-gray-800 hover:text-blue-600 transition"
                  >
                    {r.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <NewsletterForm variant="blue" />

          {/* Reserved sidebar rectangle ad */}
          <AdSlot format="rectangle-300x250" />
        </aside>
      </main>

      <SiteFooter />
    </div>
  )
}