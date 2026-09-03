import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import AdBanner300x250 from '@/components/AdBanner300x250'
import NativeAdBanner from '@/components/NativeAdBanner'
import SmartLinkButton from '@/components/SmartLinkButton'
import SplitMarkdownContent from '@/components/SplitMarkdownContent'
import StickySidebarAd from '@/components/StickySidebarAd'
import ReadingProgress from '@/components/ReadingProgress'
import StickyAd from '@/components/StickyAd'
import ReactionBar from '@/components/ReactionBar'
import ShareButtons from '@/components/ShareButtons'
import NewsletterForm from '@/components/NewsletterForm'
import { calculateReadingTime } from '@/lib/reading-time'
import { supabase } from '@/lib/supabase'

export const revalidate = 300

type PageProps = {
  params: Promise<{ slug: string }>
}

const formatDateToISO = (dateStr?: string) => {
  if (!dateStr) return new Date().toISOString()
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

export async function generateStaticParams() {
  const { data: articles } = await supabase
    .from('articles')
    .select('slug')

  if (!articles) return []

  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { data: article } = await supabase
    .from('articles')
    .select('title, excerpt, cover_image, category, created_at, updated_at')
    .eq('slug', slug)
    .single()

  if (!article) return { title: 'Article Not Found | Wanderline' }

  const canonicalUrl = `https://www.wanderline.site/article/${slug}`

  return {
    title: `${article.title} | Wanderline`,
    description: article.excerpt || '',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      url: canonicalUrl,
      siteName: 'Wanderline',
      images: article.cover_image ? [{ url: article.cover_image }] : [],
      type: 'article',
      publishedTime: formatDateToISO(article.created_at),
      modifiedTime: formatDateToISO(article.updated_at || article.created_at),
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
  const { slug } = await params

  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
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
    datePublished: formatDateToISO(article.created_at),
    dateModified: formatDateToISO(article.updated_at || article.created_at),
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

      {/* 3. Floating Dismissible Sticky Ad */}
      <StickyAd />

      <div>
        <SiteHeader variant="plain" />

        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Breadcrumb Header */}
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

          {/* Two-Column Grid: Content Column + Sticky Sidebar */}
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Left/Main Reading Column */}
            <div className="w-full lg:flex-1 min-w-0">
              {/* Cover Image */}
              {article.cover_image && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl mb-8 shadow-sm border border-gray-100">
                  <Image
                    src={article.cover_image}
                    alt={article.title}
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Top In-Article 300x250 Ad Banner */}
              <div className="my-6">
                <AdBanner300x250 />
              </div>

              {/* Formatted Markdown Body with Automated Mid-Article Ad & SmartLink Insertion */}
              <SplitMarkdownContent content={article.content || ''} />

              {/* Contextual SmartLink Direct Link Button */}
              <SmartLinkButton
                label="Explore Official Investigation & Related Reports"
                subtext="Access verified source coverage & timeline"
              />

              {/* In-Article Native Adsterra Widget */}
              <div className="my-10 border-t border-zinc-200 pt-6">
                <NativeAdBanner />
              </div>

              {/* Native Reaction & Sharing Section */}
              <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4">
                <ReactionBar
                  articleSlug={article.slug}
                  initialCounts={article.reactions || {}}
                />
                <ShareButtons
                  title={article.title}
                />
              </div>

              {/* Newsletter Form */}
              <div className="my-12">
                <NewsletterForm />
              </div>
            </div>

            {/* Right Desktop Sticky Sidebar */}
            <StickySidebarAd />
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}