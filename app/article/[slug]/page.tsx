import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import AdSlot from '@/components/AdSlot'
import TableOfContents from '@/components/TableOfContents'
import ShareButtons from '@/components/ShareButtons'
import ReadingProgress from '@/components/ReadingProgress'

export const revalidate = 3600

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

async function getArticle(rawSlug: string) {
  const cleanSlug = decodeURIComponent(rawSlug).trim()

  let { data } = await supabase
    .from('articles')
    .select('id, title, slug, content, excerpt, cover_image, category, created_at')
    .ilike('slug', cleanSlug)
    .eq('status', 'published')
    .maybeSingle()

  if (!data) {
    const fallback = await supabase
      .from('articles')
      .select('id, title, slug, content, excerpt, cover_image, category, created_at')
      .ilike('slug', cleanSlug)
      .maybeSingle()
    data = fallback.data
  }

  return data || null
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Story Not Found | Wanderline' }

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
      images: [{ url: article.cover_image }],
      type: 'article',
    },
  }
}

function renderMarkdownBlocks(content: string) {
  const blocks = content.split(/\n\n+/)

  return blocks.map((block, idx) => {
    const trimmed = block.trim()

    if (trimmed.startsWith('## ')) {
      const text = trimmed.replace(/^##\s+/, '')
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')

      return (
        <h2
          key={idx}
          id={id}
          className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-10 mb-4 scroll-mt-24"
        >
          {text}
        </h2>
      )
    }

    if (trimmed.startsWith('### ')) {
      const text = trimmed.replace(/^###\s+/, '')
      return (
        <h3 key={idx} className="text-xl font-serif font-bold text-gray-900 mt-8 mb-3">
          {text}
        </h3>
      )
    }

    if (trimmed.startsWith('>')) {
      const text = trimmed.replace(/^>\s*/, '')
      return (
        <blockquote
          key={idx}
          className="border-l-2 border-amber-800 pl-4 my-6 italic text-gray-800 font-serif"
        >
          {text}
        </blockquote>
      )
    }

    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').map((item) => item.replace(/^[\*\-]\s+/, ''))
      return (
        <ul key={idx} className="list-disc pl-5 my-4 space-y-2 text-gray-800 font-serif">
          {items.map((item, itemIdx) => (
            <li key={itemIdx}>{item}</li>
          ))}
        </ul>
      )
    }

    return (
      <p key={idx} className="my-4 text-gray-800 font-serif leading-relaxed text-base">
        {trimmed}
      </p>
    )
  })
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) notFound()

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      <ReadingProgress />
      <SiteHeader variant="plain" />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block">
              {article.category}
            </span>
            <span className="text-gray-400">•</span>
            <time className="text-xs text-gray-700 font-medium">
              {new Date(article.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-950 leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-gray-700 font-serif leading-relaxed mb-6">
            {article.excerpt}
          </p>
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              priority
              quality={70}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 896px"
              className="object-cover"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-10">
          <article className="prose prose-gray max-w-none">
            {renderMarkdownBlocks(article.content)}

            <AdSlot format="native-4x1" />

            <div className="mt-8 pt-6 border-t border-gray-200 not-prose">
              <ShareButtons title={article.title} slug={article.slug} />
            </div>

            <section className="mt-12 pt-8 border-t border-gray-200 not-prose">
              <h2 className="text-xs uppercase tracking-wider text-gray-700 font-semibold mb-4">
                More in {article.category}
              </h2>
            </section>
          </article>

          <aside className="hidden lg:block space-y-8">
            <TableOfContents content={article.content} />
            <AdSlot format="sidebar" />
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}