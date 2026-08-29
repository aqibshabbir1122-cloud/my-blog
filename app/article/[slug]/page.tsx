import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import AdSlot from '@/components/AdSlot'
import StickyAd from '@/components/StickyAd'
import ReadingProgressBar from '@/components/ReadingProgressBar'
import SocialShare from '@/components/SocialShare'
import { supabase } from '@/lib/supabase'

export const revalidate = 3600

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
  const { data: articles } = await supabase
    .from('articles')
    .select('slug')
    .limit(50)

  return (articles || []).map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params
  const { data: article } = await supabase
    .from('articles')
    .select('title, excerpt, cover_image, category, published_at')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!article) {
    return {
      title: 'Article Not Found | Wanderline',
    }
  }

  return {
    title: `${article.title} | Wanderline`,
    description: article.excerpt || '',
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      images: article.cover_image ? [article.cover_image] : [],
      type: 'article',
      publishedTime: article.published_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || '',
      images: article.cover_image ? [article.cover_image] : [],
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const resolvedParams = await params

  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single()

  if (error || !article) {
    notFound()
  }

  const { data: relatedArticles } = await supabase
    .from('articles')
    .select('id, title, slug, cover_image, reading_time, published_at')
    .eq('category', article.category)
    .neq('id', article.id)
    .limit(2)

  const articleUrl = `https://www.wanderline.site/article/${article.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: [article.cover_image],
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at || article.published_at || article.created_at,
    author: [
      {
        '@type': 'Organization',
        name: 'Wanderline Editorial Staff',
        url: 'https://www.wanderline.site',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Wanderline',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.wanderline.site/favicon.ico',
      },
    },
  }

  return (
    <div className="bg-[#faf9f6] min-h-screen flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900">
      <ReadingProgressBar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <SiteHeader variant="plain" />

        <main className="max-w-4xl mx-auto px-6 py-12">
          {/* Category & Date Metadata */}
          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-amber-800 font-semibold mb-4">
            <Link
              href={`/category/${(article.category || 'general').toLowerCase().replace(/\s+/g, '-')}`}
              className="hover:underline"
            >
              {article.category || 'General'}
            </Link>
            <span className="text-gray-400">•</span>
            <time className="text-gray-500 font-mono">
              {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{article.reading_time || '5 min read'}</span>
          </div>

          {/* Title Header */}
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-950 leading-tight mb-6">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg sm:text-xl text-gray-700 font-serif italic mb-6 leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Share Action Bar */}
          <SocialShare title={article.title} url={articleUrl} />

          {/* Top Ad Slot */}
          <AdSlot format="banner" />

          {/* Hero Article Image */}
          {article.cover_image && (
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-12 shadow-sm bg-gray-100">
              <Image
                src={article.cover_image}
                alt={article.title || 'Article cover image'}
                fill
                priority
                quality={65}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 896px"
                className="object-cover"
              />
            </div>
          )}

          {/* Article Body Content */}
          <article className="prose prose-lg prose-amber mx-auto font-serif text-gray-800 leading-relaxed max-w-none">
            <div
              className="space-y-6"
              dangerouslySetInnerHTML={{
                __html: (article.content || '')
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/^/, '<p>')
                  .concat('</p>'),
              }}
            />
          </article>

          {/* Inline Content Ad Slot */}
          <AdSlot format="banner-728x90" className="my-12" />

          {/* Related Articles Section */}
          {relatedArticles && relatedArticles.length > 0 && (
            <section className="mt-16 pt-12 border-t border-gray-200">
              <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block mb-6">
                Related Dispatches
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/article/${rel.slug}`}
                    className="group flex flex-col space-y-3"
                  >
                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-gray-100">
                      {rel.cover_image && (
                        <Image
                          src={rel.cover_image}
                          alt={rel.title}
                          fill
                          quality={65}
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover group-hover:scale-105 transition duration-500"
                        />
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-gray-900 group-hover:text-amber-800 transition text-lg leading-snug">
                      {rel.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Floating Bottom Monetization Bar */}
      <StickyAd />

      <SiteFooter />
    </div>
  )
}