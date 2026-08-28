export const revalidate = 3600

import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import ReadingProgressBar from '@/components/ReadingProgressBar'
import dynamic from 'next/dynamic'

const ShareButtons = dynamic(() => import('@/components/ShareButtons'))
const ReactionBar = dynamic(() => import('@/components/ReactionBar'))
const NewsletterForm = dynamic(() => import('@/components/NewsletterForm'))
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!article) {
    return { title: 'Article not found' }
  }

  return {
    title: article.title,
    description: article.excerpt || article.content.slice(0, 150),
       alternates: {
     canonical: `https://www.wanderline.site/article/${slug}`,
   },
    openGraph: {
      title: article.title,
      description: article.excerpt || article.content.slice(0, 150),
      images: article.cover_image ? [article.cover_image] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.content.slice(0, 150),
      images: article.cover_image ? [article.cover_image] : [],
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!article) {
    notFound()
  }

  const { data: related } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .eq('category', article.category)
    .neq('slug', slug)
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: moreStories } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .neq('category', article.category)
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: reactionRows } = await supabase
    .from('reactions')
    .select('reaction_type, count')
    .eq('article_slug', slug)

  const reactionCounts: Record<string, number> = {}
  reactionRows?.forEach((r) => {
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
    headline: article.title,
    description: article.excerpt || article.content.slice(0, 150),
    image: article.cover_image ? [article.cover_image] : [],
    datePublished: article.created_at,
    author: {
      '@type': 'Organization',
      name: 'Wanderline',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Wanderline',
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
          <a href="/" className="text-sm text-gray-500 hover:text-gray-800">&larr; Back to Wanderline</a>

          {article.cover_image && (
            <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden mt-6 mb-6">
              <Image src={article.cover_image} alt={article.title} fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded ${badgeColor}`}>
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl font-serif mb-4 leading-tight">{article.title}</h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-600 font-medium">
              W
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Wanderline Staff</p>
              <p className="text-xs text-gray-400">{formatDate(article.created_at)} · {readTime} min read</p>
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
            <p key={i} className="text-lg leading-relaxed text-gray-800 mb-5">
              {para}
            </p>
          ))}

          <ShareButtons title={article.title} />

          <ReactionBar articleSlug={slug} initialCounts={reactionCounts} />

          {moreStories && moreStories.length > 0 && (
            <div className="mt-12">
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-4">You might also like</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {moreStories.map((s) => (
                  <a href={`/article/${s.slug}`} key={s.id} className="block hover:opacity-90 transition">
                    {s.cover_image && (
                      <div className="relative w-full h-24 rounded-lg overflow-hidden mb-2">
                        <Image src={s.cover_image} alt={s.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                      </div>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[s.category] || 'bg-gray-200 text-gray-800'}`}>
                      {s.category}
                    </span>
                    <p className="text-sm font-medium mt-1">{s.title}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-1">
          {related && related.length > 0 && (
            <div className={`${sidebarBg} rounded-xl p-5 mb-6`}>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-4">More in {article.category}</p>
              <div className="space-y-4">
                {related.map((r) => (
                  <a href={`/article/${r.slug}`} key={r.id} className="block hover:opacity-80 transition">
                    <p className="text-sm font-medium text-gray-800">{r.title}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          <NewsletterForm variant="blue" />

          <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center text-xs text-gray-400">
            Ad space
          </div>
        </aside>

      </main>

      <SiteFooter />
    </div>
  )
}