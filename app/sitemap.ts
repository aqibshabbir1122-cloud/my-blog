import { supabase } from '@/lib/supabase'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.wanderline.com'

  const { data: articles } = await supabase
    .from('articles')
    .select('slug, created_at')
    .eq('published', true)

  const articleUrls = (articles || []).map((article) => ({
    url: `${baseUrl}/article/${article.slug}`,
    lastModified: new Date(article.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const categoryUrls = ['travel', 'world-stories', 'crime', 'culture'].map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...categoryUrls,
    ...articleUrls,
  ]
}