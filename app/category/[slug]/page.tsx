import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import AdSlot from '@/components/AdSlot'
import { calculateReadingTime } from '@/lib/reading-time'
import { supabase } from '@/lib/supabase'

export const revalidate = 3600

const CATEGORY_MAP: Record<string, string> = {
  'digital-culture': 'Digital Culture',
  travel: 'Travel',
  'world-stories': 'World Stories',
  crime: 'Crime',
  culture: 'Culture',
}

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const categorySlug = resolvedParams.slug.toLowerCase()
  const categoryTitle = CATEGORY_MAP[categorySlug] || categorySlug.replace(/-/g, ' ')

  const formattedTitle =
    categoryTitle.charAt(0).toUpperCase() + categoryTitle.slice(1)

  return {
    title: `${formattedTitle} Dispatches | Wanderline`,
    description: `Explore investigative reports, cultural dispatches, and in-depth analysis on ${formattedTitle}.`,
    openGraph: {
      title: `${formattedTitle} | Wanderline`,
      description: `In-depth journalism and cultural analysis on ${formattedTitle}.`,
      url: `https://www.wanderline.site/category/${categorySlug}`,
      type: 'website',
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params
  const categorySlug = resolvedParams.slug.toLowerCase()
  const categoryTitle = CATEGORY_MAP[categorySlug] || categorySlug.replace(/-/g, ' ')

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, cover_image, created_at, content, category')
    .ilike('category', categoryTitle)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error loading category articles:', error)
  }

  return (
    <div className="bg-[#faf9f6] min-h-screen flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900">
      <div>
        <SiteHeader variant="plain" />

        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="border-b border-gray-200 pb-8 mb-10">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block mb-2 font-mono">
              Archive Category
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-gray-950 capitalize">
              {categoryTitle}
            </h1>
            <p className="text-gray-600 font-serif italic mt-3 text-lg max-w-2xl">
              Curated dispatches, field investigations, and perspectives on {categoryTitle.toLowerCase()}.
            </p>
          </div>

          {/* Top Banner Monetization Slot */}
          <AdSlot format="banner" className="mb-12" />

          {/* Articles Grid */}
          {!articles || articles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-gray-600 font-serif text-lg">
                No dispatches published in this category yet.
              </p>
              <Link
                href="/"
                className="mt-4 inline-block text-sm font-semibold text-amber-800 hover:underline font-mono uppercase tracking-wider"
              >
                ← Return to Front Page
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => {
                const readTime = calculateReadingTime(article.content)

                return (
                  <article
                    key={article.id}
                    className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition duration-300 group"
                  >
                    {article.cover_image && (
                      <Link
                        href={`/article/${article.slug}`}
                        className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 block"
                      >
                        <Image
                          src={article.cover_image}
                          alt={article.title}
                          fill
                          quality={65}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition duration-500"
                        />
                      </Link>
                    )}

                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center space-x-2 text-[11px] uppercase tracking-widest text-gray-500 font-mono mb-3">
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

                        <h2 className="text-xl font-serif font-bold text-gray-950 group-hover:text-amber-800 transition leading-snug mb-3">
                          <Link href={`/article/${article.slug}`}>
                            {article.title}
                          </Link>
                        </h2>

                        {article.excerpt && (
                          <p className="text-gray-600 text-sm font-serif line-clamp-3 leading-relaxed mb-4">
                            {article.excerpt}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-100 mt-auto">
                        <Link
                          href={`/article/${article.slug}`}
                          className="text-xs uppercase tracking-wider font-semibold text-amber-800 hover:text-amber-950 inline-flex items-center gap-1 font-mono"
                        >
                          Read Dispatch →
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {/* Bottom Grid Ad Placement */}
          <AdSlot format="banner-728x90" className="mt-16" />
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}