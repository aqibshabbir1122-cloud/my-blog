import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const revalidate = 3600

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

function normalizeCategoryName(slug: string): string {
  const decoded = decodeURIComponent(slug).trim()
  return decoded
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

async function getArticlesByCategory(rawSlug: string) {
  const decodedSlug = decodeURIComponent(rawSlug).trim()
  const formattedName = normalizeCategoryName(decodedSlug)
  const spacedSlug = decodedSlug.replace(/[-_]+/g, ' ')

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, cover_image, category, created_at')
    .or(
      `category.ilike.${formattedName},category.ilike.${decodedSlug},category.ilike.${spacedSlug}`
    )
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    return { articles: [], displayName: formattedName }
  }

  if (!data || data.length === 0) {
    const fallback = await supabase
      .from('articles')
      .select('id, title, slug, excerpt, cover_image, category, created_at')
      .or(
        `category.ilike.${formattedName},category.ilike.${decodedSlug},category.ilike.${spacedSlug}`
      )
      .order('created_at', { ascending: false })

    return {
      articles: fallback.data || [],
      displayName: formattedName,
    }
  }

  return { articles: data, displayName: formattedName }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const displayName = normalizeCategoryName(slug)

  return {
    title: `${displayName} Dispatches | Wanderline`,
    description: `Explore in-depth articles, investigative reports, and dispatches in ${displayName}.`,
    alternates: {
      canonical: `https://www.wanderline.site/category/${slug}`,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const { articles, displayName } = await getArticlesByCategory(slug)

  return (
    <div className="bg-[#faf9f6] min-h-screen flex flex-col justify-between">
      <div>
        <SiteHeader variant="plain" />

        <main className="max-w-6xl mx-auto px-6 py-12">
          <header className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block mb-2">
              Category
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-950 capitalize">
              {displayName}
            </h1>
          </header>

          {articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-700 font-serif text-lg">
                No articles published in this category yet.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center text-sm font-semibold text-amber-800 hover:text-amber-900 underline underline-offset-4"
              >
                Return to all dispatches
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:shadow-lg transition flex flex-col"
                >
                  <Link
                    href={`/article/${article.slug}`}
                    className="relative w-full aspect-[16/10] block bg-gray-100 overflow-hidden"
                  >
                    <Image
                      src={article.cover_image}
                      alt={article.title}
                      fill
                      quality={75}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      className="object-cover hover:scale-105 transition duration-500"
                    />
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[11px] uppercase tracking-wider text-amber-800 font-semibold">
                          {article.category}
                        </span>
                        <span className="text-gray-400">•</span>
                        <time className="text-[11px] text-gray-700 font-medium">
                          {new Date(article.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      </div>

                      <h2 className="text-xl font-serif font-bold text-gray-950 mb-2 leading-snug hover:text-amber-900 transition">
                        <Link href={`/article/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h2>

                      <p className="text-sm text-gray-700 font-serif line-clamp-3 leading-relaxed mb-4">
                        {article.excerpt}
                      </p>
                    </div>

                    <Link
                      href={`/article/${article.slug}`}
                      className="text-xs uppercase tracking-wider text-amber-800 font-semibold hover:text-amber-950 inline-flex items-center gap-1 mt-auto"
                    >
                      Read story &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}