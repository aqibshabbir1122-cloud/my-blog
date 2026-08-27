export const revalidate = 300

import { supabase } from '@/lib/supabase'
import Image from 'next/image'

const categoryColors: Record<string, string> = {
  Travel: 'bg-blue-100 text-blue-800',
  'World Stories': 'bg-amber-100 text-amber-800',
  Crime: 'bg-red-100 text-red-800',
  Culture: 'bg-purple-100 text-purple-800',
}

const categoryHeroBg: Record<string, string> = {
  Travel: 'bg-blue-50',
  'World Stories': 'bg-amber-50',
  Crime: 'bg-red-50',
  Culture: 'bg-purple-50',
}

const categoryHeroText: Record<string, string> = {
  Travel: 'text-blue-900',
  'World Stories': 'text-amber-900',
  Crime: 'text-red-900',
  Culture: 'text-purple-900',
}

const categoryNames: Record<string, string> = {
  travel: 'Travel',
  'world-stories': 'World Stories',
  crime: 'Crime',
  culture: 'Culture',
}

const categoryDescriptions: Record<string, string> = {
  travel: 'Notes, guides, and misadventures from the road.',
  'world-stories': 'Events shaping communities around the globe.',
  crime: 'Investigations into the cases that gripped a place.',
  culture: 'The traditions, art, and people that define a culture.',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categoryName = categoryNames[slug] || slug
  const description = categoryDescriptions[slug] || 'Stories from Wanderline.'

  return {
    title: categoryName,
    description: description,
    alternates: {
      canonical: `https://www.wanderline.com/category/${slug}`,
    },
    openGraph: {
      title: `${categoryName} | Wanderline`,
      description: description,
      url: `https://www.wanderline.com/category/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} | Wanderline`,
      description: description,
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categoryName = categoryNames[slug] || slug
  const heroBg = categoryHeroBg[categoryName] || 'bg-gray-50'
  const heroText = categoryHeroText[categoryName] || 'text-gray-900'
  const description = categoryDescriptions[slug] || ''

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .eq('category', categoryName)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-8">
          <a href="/" className="text-2xl font-serif text-amber-700">Wanderline</a>
          <nav className="flex gap-4 text-sm text-gray-600">
            <a href="/category/travel" className="hover:text-amber-700">Travel</a>
            <a href="/category/world-stories" className="hover:text-amber-700">World Stories</a>
            <a href="/category/crime" className="hover:text-amber-700">Crime</a>
            <a href="/category/culture" className="hover:text-amber-700">Culture</a>
          </nav>
        </div>

        <div className={heroBg + " rounded-2xl p-10 text-center mb-10"}>
          <h1 className={"text-4xl font-serif mb-2 " + heroText}>{categoryName}</h1>
          <p className="text-gray-600">{description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles?.map((article) => (
            <a href={"/article/" + article.slug} key={article.id} className="block hover:opacity-90 transition">
              {article.cover_image && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden mb-2">
                  <Image src={article.cover_image} alt={article.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                </div>
              )}
              <span className={"text-xs px-2 py-1 rounded " + (categoryColors[article.category] || 'bg-gray-200 text-gray-800')}>
                {article.category}
              </span>
              <h4 className="text-base font-medium mt-2 mb-1">{article.title}</h4>
              <p className="text-sm text-gray-600 mb-1">{article.excerpt}</p>
              <p className="text-xs text-gray-400">{formatDate(article.created_at)}</p>
            </a>
          ))}
        </div>

        {(!articles || articles.length === 0) && (
          <p className="text-gray-500">No articles in this category yet.</p>
        )}
      </main>
    </div>
  )
}