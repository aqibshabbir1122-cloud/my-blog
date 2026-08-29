import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import AdSlot from '@/components/AdSlot'
import ReadingProgress from '@/components/ReadingProgress'
import StickyAd from '@/components/StickyAd'
import ReactionBar from '@/components/ReactionBar'
import ShareButtons from '@/components/ShareButtons'
import NewsletterForm from '@/components/NewsletterForm'
import { calculateReadingTime } from '@/lib/reading-time'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type PageProps = {
  params: { slug: string } | Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { data: article } = await supabase
    .from('articles')
    .select('title, excerpt, cover_image, category, created_at, updated_at')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!article) return { title: 'Article Not Found | Wanderline' }

  return {
    title: `${article.title} | Wanderline`,
    description: article.excerpt || '',
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      url: `https://www.wanderline.site/article/${resolvedParams.slug}`,
      siteName: 'Wanderline',
      images: article.cover_image ? [{ url: article.cover_image }] : [],
      type: 'article',
      publishedTime: article.created_at,
      modifiedTime: article.updated_at || article.created_at,
      section: article.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || '',
      images: article.cover_image ? [article.cover_image] : [],
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await params

  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single()

  if (error || !article) {
    return notFound()
  }

  const readTime = calculateReadingTime ? calculateReadingTime(article.content || '') : '5 min read'
  const categorySlug = (article.category || 'general').toLowerCase().replace(/\s+/g, '-')
  const articleUrl = `https://www.wanderline.site/article/${article.slug}`
  const articleImage = article.cover_image || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt || '',
    image: [articleImage],
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: [
      {
        '@type': 'Person',
        name: 'Wanderline Editorial Desk',
        url: 'https://www.wanderline.site/about',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Wanderline',
      url: 'https://www.wanderline.site',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.wanderline.site/icon.png',
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: article.category || 'General',
  }

  return (
    <div className="bg-[#faf9f6] min-h-screen flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900 relative">
      {/* 1. Google Verified JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 2. Reading Progress Bar */}
      <ReadingProgress />

      {/* 3. Floating Dismissible Sticky Ad with Close Button */}
      <StickyAd />

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

          {/* Article Title */}
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-950 leading-tight mb-6">
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-lg sm:text-xl font-serif italic text-gray-700 leading-relaxed mb-8 border-l-2 border-amber-800 pl-4">
              {article.excerpt}
            </p>
          )}

          {/* Cover Image (Optimized for LCP Discovery) */}
          {article.cover_image && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl mb-10 shadow-sm border border-gray-100">
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          )}

          {/* Top Banner Ad */}
          <div className="my-8">
            <AdSlot format="banner" className="w-full flex justify-center" />
          </div>

          {/* Formatted Markdown Body */}
          <article className="prose prose-lg max-w-none font-serif text-gray-800 leading-relaxed prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-950 prose-a:text-amber-800 prose-a:underline hover:prose-a:text-amber-950 prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-ul:list-disc prose-ol:list-decimal prose-img:rounded-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content || ''}
            </ReactMarkdown>
          </article>

          {/* Native Reaction & Sharing Section */}
          <div className="mt-12 pt-6 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4">
            <ReactionBar
              articleSlug={article.slug}
              initialCounts={article.reactions || {}}
            />
            <ShareButtons
              title={article.title}
            />
          </div>

          {/* Newsletter Box */}
          <div className="my-12">
            <NewsletterForm />
          </div>

          {/* Dedicated Bottom Full-Width Ad Section (WCAG Compliant Contrast) */}
          <section className="mt-8 pt-8 border-t border-zinc-200">
            <div className="bg-zinc-100/70 border border-zinc-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[120px]">
              <span className="text-[10px] tracking-widest uppercase font-mono text-zinc-600 mb-2">
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