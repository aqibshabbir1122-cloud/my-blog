export const revalidate = 3600

import { cache, Fragment, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import AdSlot from '@/components/AdSlot'
import ReadingProgressBar from '@/components/ReadingProgressBar'
import TableOfContents from '@/components/TableOfContents'
import dynamic from 'next/dynamic'

const ShareButtons = dynamic(() => import('@/components/ShareButtons'))
const ReactionBar = dynamic(() => import('@/components/ReactionBar'))
const NewsletterForm = dynamic(() => import('@/components/NewsletterForm'))

interface Article {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string | null
  cover_image: string | null
  content: string
  created_at: string
  updated_at?: string
}

interface CategoryConfig {
  id: string
  name: string
  slug: string
  badge_color?: string
  text_color?: string
  bar_color?: string
  border_color?: string
  sidebar_bg?: string
}

// 1. Cached Data Fetching
const getArticleData = cache(async (slug: string) => {
  const [articleRes, categoriesRes] = await Promise.all([
    supabase.from('articles').select('*').eq('slug', slug).single(),
    supabase.from('categories').select('*'),
  ])

  const article: Article | null = articleRes.data
  const categories: CategoryConfig[] = categoriesRes.data || []

  if (!article) return null

  // Parallel fetch for related category stories, recent articles, and reactions
  const [relatedRes, recentRes, reactionsRes] = await Promise.all([
    supabase
      .from('articles')
      .select('id, title, slug, cover_image, created_at, category')
      .eq('category', article.category)
      .neq('id', article.id)
      .eq('published', true)
      .limit(3),
    supabase
      .from('articles')
      .select('id, title, slug, cover_image, created_at, category')
      .neq('id', article.id)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('reactions')
      .select('reaction_type, count')
      .eq('article_slug', slug),
  ])

  const categoryConfig =
    categories.find(
      (c) =>
        c.name?.toLowerCase() === article.category?.toLowerCase() ||
        c.slug?.toLowerCase() === article.category?.toLowerCase()
    ) || null

  const reactionCounts: Record<string, number> = {}
  reactionsRes.data?.forEach((r) => {
    reactionCounts[r.reaction_type] = r.count
  })

  return {
    article,
    categoryConfig,
    relatedArticles: relatedRes.data || [],
    recentArticles: recentRes.data || [],
    reactionCounts,
  }
})

// 2. Dynamic SEO Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getArticleData(slug)

  if (!data || !data.article) {
    return { title: 'Article Not Found | Wanderline' }
  }

  const { article } = data
  const canonicalUrl = `https://www.wanderline.site/article/${article.slug}`
  const description =
    article.excerpt ||
    article.content.slice(0, 160).replace(/[#*>`]/g, '').trim()

  return {
    title: `${article.title} | Wanderline`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: article.created_at,
      modifiedTime: article.updated_at || article.created_at,
      images: article.cover_image ? [{ url: article.cover_image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: article.cover_image ? [article.cover_image] : [],
    },
  }
}

// 3. Helpers for Headings and Inline Markdown
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

function extractHeadings(content: string) {
  const lines = content.split('\n')
  const headings: { id: string; text: string; level: number }[] = []

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('## ')) {
      const text = trimmed.replace(/^##\s+/, '')
      headings.push({ id: slugifyHeading(text), text, level: 2 })
    } else if (trimmed.startsWith('### ')) {
      const text = trimmed.replace(/^###\s+/, '')
      headings.push({ id: slugifyHeading(text), text, level: 3 })
    }
  })

  return headings
}

function formatInlineText(text: string): ReactNode[] {
  const tokens = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g)

  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-gray-900">
          {token.slice(2, -2)}
        </strong>
      )
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return (
        <em key={i} className="italic">
          {token.slice(1, -1)}
        </em>
      )
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code
          key={i}
          className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800"
        >
          {token.slice(1, -1)}
        </code>
      )
    }
    return token
  })
}

// 4. Block Markdown Renderer
function renderContentBlocks(content: string) {
  const rawBlocks = content
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)

  let paragraphCounter = 0

  return rawBlocks.map((block, idx) => {
    // Heading 2
    if (block.startsWith('## ')) {
      const cleanHeading = block.replace(/^##\s+/, '')
      return (
        <h2
          key={idx}
          id={slugifyHeading(cleanHeading)}
          className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-10 mb-4 tracking-tight leading-snug scroll-mt-20"
        >
          {formatInlineText(cleanHeading)}
        </h2>
      )
    }

    // Heading 3
    if (block.startsWith('### ')) {
      const cleanHeading = block.replace(/^###\s+/, '')
      return (
        <h3
          key={idx}
          id={slugifyHeading(cleanHeading)}
          className="text-xl sm:text-2xl font-serif font-semibold text-gray-900 mt-8 mb-3 tracking-tight scroll-mt-20"
        >
          {formatInlineText(cleanHeading)}
        </h3>
      )
    }

    // Blockquote
    if (block.startsWith('>')) {
      const cleanQuote = block
        .split('\n')
        .map((l) => l.replace(/^>\s?/, ''))
        .join(' ')

      return (
        <blockquote
          key={idx}
          className="my-8 pl-6 border-l-4 border-gray-900 italic font-serif text-xl sm:text-2xl text-gray-800 leading-relaxed bg-gray-50/60 py-4 pr-4 rounded-r-lg"
        >
          &ldquo;{formatInlineText(cleanQuote)}&rdquo;
        </blockquote>
      )
    }

    // Unordered List
    if (block.startsWith('- ') || block.startsWith('* ')) {
      const items = block.split('\n').map((l) => l.replace(/^[-*]\s+/, ''))
      return (
        <ul
          key={idx}
          className="my-6 space-y-2 list-disc list-inside text-gray-800 leading-relaxed pl-2"
        >
          {items.map((item, itemIdx) => (
            <li key={itemIdx}>{formatInlineText(item)}</li>
          ))}
        </ul>
      )
    }

    // Paragraph
    paragraphCounter++
    const isThirdParagraph = paragraphCounter === 3

    return (
      <Fragment key={idx}>
        <p className="text-gray-800 text-lg leading-relaxed mb-6 font-serif">
          {formatInlineText(block)}
        </p>
        {isThirdParagraph && (
          <div className="my-10 clear-both">
            <AdSlot slotId="article-in-feed" format="banner-728x90" />
          </div>
        )}
      </Fragment>
    )
  })
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getArticleData(slug)

  if (!data || !data.article) {
    notFound()
  }

  const { article, categoryConfig, relatedArticles, recentArticles, reactionCounts } = data

  const headings = extractHeadings(article.content)

  const formattedDate = new Date(article.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const words = article.content.trim().split(/\s+/).length
  const readTime = Math.max(1, Math.round(words / 200))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.wanderline.site/article/${article.slug}`,
    },
    headline: article.title,
    description:
      article.excerpt ||
      article.content.slice(0, 160).replace(/[#*>`]/g, '').trim(),
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

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      <SiteHeader variant="plain" />
      <ReadingProgressBar color={categoryConfig?.bar_color || 'bg-gray-700'} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article */}
          <article className="lg:col-span-8">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-800 transition block mb-6"
            >
              &larr; Back to Wanderline
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <Link
                href={`/category/${categoryConfig?.slug || article.category.toLowerCase()}`}
                className={`text-xs font-semibold px-3 py-1 rounded transition ${
                  categoryConfig?.badge_color || 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {article.category}
              </Link>
              <time className="text-xs text-gray-400">
                {formattedDate} · {readTime} min read
              </time>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif text-gray-900 tracking-tight leading-tight mb-6">
              {article.title}
            </h1>

            {article.cover_image && (
              <div className="relative w-full h-[320px] sm:h-[460px] rounded-2xl overflow-hidden mb-8 shadow-sm bg-gray-100">
                <Image
                  src={article.cover_image}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 750px"
                  className="object-cover"
                />
              </div>
            )}

            {article.excerpt && (
              <div
                className={`border-l-4 ${
                  categoryConfig?.border_color || 'border-gray-300'
                } pl-4 my-6`}
              >
                <p
                  className={`font-serif italic text-lg ${
                    categoryConfig?.text_color || 'text-gray-700'
                  }`}
                >
                  &ldquo;{article.excerpt}&rdquo;
                </p>
              </div>
            )}

            {/* Dynamic Table of Contents */}
            <TableOfContents headings={headings} />

            {/* Parsed Body */}
            <div className="prose prose-lg max-w-none text-gray-800">
              {renderContentBlocks(article.content)}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 space-y-6">
              <ShareButtons title={article.title} />
              <ReactionBar
                articleSlug={slug}
                initialCounts={reactionCounts}
              />
            </div>

            {/* Recent Stories Grid */}
            {recentArticles.length > 0 && (
              <div className="mt-12 border-t border-gray-200 pt-8">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-4 font-semibold">
                  You might also like
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {recentArticles.map((s) => (
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
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
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
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-8 space-y-8">
              {relatedArticles.length > 0 && (
                <div
                  className={`p-6 rounded-2xl border ${
                    categoryConfig?.sidebar_bg || 'bg-white'
                  } ${categoryConfig?.border_color || 'border-gray-200'}`}
                >
                  <h3 className="text-xs uppercase tracking-wider text-gray-600 font-semibold mb-4">
                    More in {article.category}
                  </h3>
                  <div className="space-y-4">
                    {relatedArticles.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/article/${rel.slug}`}
                        className="block group"
                      >
                        <p className="text-sm font-serif font-medium text-gray-900 group-hover:text-blue-600 transition leading-snug">
                          {rel.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <NewsletterForm variant="blue" />

              <AdSlot slotId="sidebar-banner" format="rectangle-300x250" />
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}