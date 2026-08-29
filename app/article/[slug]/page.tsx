import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import AdSlot from '@/components/AdSlot'
import { supabase } from '@/lib/supabase'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const { data: article } = await supabase
    .from('articles')
    .select('title, excerpt, cover_image, category')
    .eq('slug', slug)
    .single()

  if (!article) {
    return {
      title: 'Article Not Found | Wanderline',
    }
  }

  return {
    title: `${article.title} | Wanderline`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.cover_image],
      type: 'article',
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

  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !article) {
    notFound()
  }

  // Fetch related articles from same category
  const { data: relatedArticles } = await supabase
    .from('articles')
    .select('id, title, slug, cover_image, reading_time, published_at')
    .eq('category', article.category)
    .neq('id', article.id)
    .limit(2)

  return (
    <div className="bg-[#faf9f6] min-h-screen flex flex-col justify-between">
      <div>
        <SiteHeader variant="plain" />

        <main className="max-w-4xl mx-auto px-6 py-12">
          {/* Top Breadcrumb & Metadata */}
          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-amber-800 font-semibold mb-4">
            <Link
              href={`/category/${article.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="hover:underline"
            >
              {article.category}
            </Link>
            <span className="text-gray-400">•</span>
            <time className="text-gray-500 font-mono">
              {new Date(article.published_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{article.reading_time || '5 min read'}</span>
          </div>

          {/* Article Title Header */}
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-950 leading-tight mb-6">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-gray-700 font-serif italic mb-8 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Top Ad Unit */}
          <AdSlot format="banner" />

          {/* Hero Article Image */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-12 shadow-sm bg-gray-100">
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              priority
              quality={65}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 896px"
              className="object-cover"
            />
          </div>

          {/* Article Content Body */}
          <article className="prose prose-lg prose-amber mx-auto font-serif text-gray-800 leading-relaxed max-w-none">
            <div
              className="space-y-6"
              dangerouslySetInnerHTML={{
                __html: article.content.replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').concat('</p>'),
              }}
            />
          </article>

          {/* Inline Content Ad Unit */}
          <AdSlot format="banner-728x90" className="my-12" />

          {/* Related Stories Section */}
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
                      <Image
                        src={rel.cover_image}
                        alt={rel.title}
                        fill
                        quality={65}
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
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

      <SiteFooter />
    </div>
  )
}