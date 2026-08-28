import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.wanderline.site'

  // 1. Static base routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]

  // 2. Fetch all published categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')

  const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // 3. Fetch all published articles (querying only essential fields)
  const { data: articles, error } = await supabase
    .from('articles')
    .select('slug, created_at')
    .eq('published', true)

  if (error) {
    console.error('Sitemap article query error:', error)
  }

  const articleRoutes: MetadataRoute.Sitemap = (articles || []).map((post) => ({
    url: `${baseUrl}/article/${post.slug}`,
    lastModified: post.created_at ? new Date(post.created_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes]
}