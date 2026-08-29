import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  if (!slug) return notFound()

  // Convert slug "digital-culture" to pattern "Digital Culture" or matching tokens
  const formattedCategory = decodeURIComponent(slug)
    .replace(/-/g, ' ')
    .trim()

  // Fetch articles where category matches case-insensitively (e.g. 'digital culture' or 'Digital Culture')
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, category, cover_image, excerpt, created_at')
    .eq('published', true)
    .ilike('category', formattedCategory)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Category fetch error:', error.message)
    return notFound()
  }

  const categoryDisplayName = formattedCategory
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-8 border-b border-zinc-200 pb-4">
        <h1 className="text-3xl font-serif text-gray-900">{categoryDisplayName}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {articles?.length || 0} dispatch{articles?.length === 1 ? '' : 'es'} filed
        </p>
      </header>

      {(!articles || articles.length === 0) ? (
        <div className="py-16 text-center">
          <p className="text-sm text-gray-500">No articles currently published under this desk.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <article
              key={article.id}
              className="border border-zinc-200 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                  {article.category}
                </span>
                <Link href={`/article/${article.slug}`}>
                  <h2 className="text-xl font-serif font-bold text-gray-900 hover:text-blue-600 transition mt-3 mb-2">
                    {article.title}
                  </h2>
                </Link>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
              </div>
              <div className="text-xs text-gray-400 font-mono">
                {new Date(article.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}