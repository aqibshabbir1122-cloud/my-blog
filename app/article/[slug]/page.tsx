import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ReadingProgress from '@/components/ReadingProgress'
import ShareButtons from '@/components/ShareButtons'
import ReactionBar from '@/components/ReactionBar'
import AdSlot from '@/components/AdSlot'

export const revalidate = 3600

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

async function getArticleData(slug: string) {
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !article) {
    return null
  }

  const { data: reactions } = await supabase
    .from('reactions')
    .select('reaction_type, count')
    .eq('article_slug', slug)

  const initialCounts = (reactions || []).reduce(
    (acc: Record<string, number>, curr: any) => {
      acc[curr.reaction_type] = curr.count || 0
      return acc
    },
    {}
  )

  const { data: related } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, cover_image, category, created_at')
    .eq('category', article.category)
    .neq('id', article.id)
    .limit(3)

  return {
    article,
    initialCounts,
    related: related || [],
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getArticleData(slug)

  if (!data || !data.article) {
    return {
      title: 'Dispatch Not Found | Wanderline',
    }
  }

  const { article } = data

  return {
    title: `${article.title} | Wanderline`,
    description: article.excerpt,
    alternates: {
      canonical: `https://www.wanderline.site/article/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://www.wanderline.site/article/${article.slug}`,
      siteName: 'Wanderline',
      type: 'article',
      publishedTime: article.created_at,
      images: [
        {
          url: article.cover_image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.cover_image],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const data = await getArticleData(slug)

  if (!data || !data.article) {
    notFound()
  }

  const { article, initialCounts, related } = data

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      <ReadingProgress />
      <SiteHeader variant="plain" />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-10 text-center max-w-2xl mx-auto">
          <Link
            href={`/category/${article.category.toLowerCase().replace(/\s+/g, '-')}`}
            className="inline-block text-xs uppercase tracking-widest text-amber-800 font-semibold mb-4 hover:underline"
          >
            {article.category}
          </Link>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-950 leading-tight mb-6">
            {article.title}
          </h1>
          <p className="text-lg text-gray-700 font-serif italic mb-6">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-center space-x-3 text-xs text-gray-500 font-sans border-y border-gray-200 py-3">
            <span>By Editorial Staff</span>
            <span>•</span>
            <time>
              {new Date(article.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>
        </header>

        <div className="relative w-full aspect-[16/9] mb-12 rounded-2xl overflow-hidden shadow-sm bg-gray-100">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            priority
            fetchPriority="high"
            loading="eager"
            quality={65}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 896px"
            className="object-cover"
          />
        </div>

        <AdSlot format="banner" />

        <article className="prose prose-lg prose-amber mx-auto font-serif text-gray-800 leading-relaxed max-w-none my-8">
          {article.content.split('\n\n').map((paragraph: string, idx: number) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </article>

        <AdSlot format="banner" />

        <div className="my-10 border-t border-b border-gray-200 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <ShareButtons title={article.title} />
          <ReactionBar articleSlug={article.slug} initialCounts={initialCounts} />
        </div>

        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-serif font-bold text-gray-950 mb-8">
              Related Dispatches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel: any) => (
                <article key={rel.id} className="group">
                  <Link href={`/article/${rel.slug}`} className="block">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-gray-100">
                      <Image
                        src={rel.cover_image}
                        alt={rel.title}
                        fill
                        quality={65}
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <h3 className="font-serif font-bold text-gray-900 group-hover:text-amber-900 leading-snug">
                      {rel.title}
                    </h3>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}