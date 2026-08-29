'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export interface ArticleSubmitState {
  success: boolean
  message: string
  slug?: string
}

export async function publishArticle(formData: FormData): Promise<ArticleSubmitState> {
  const title = (formData.get('title') as string || '').trim()
  const slug = (formData.get('slug') as string || '').trim()
  const category = (formData.get('category') as string || '').trim()
  const cover_image = (formData.get('cover_image') as string || '').trim()
  const excerpt = (formData.get('excerpt') as string || '').trim()
  const content = (formData.get('content') as string || '').trim()
  const published = formData.get('published') === 'on'

  if (!title || !slug || !content) {
    return {
      success: false,
      message: 'Title, slug, and content are required fields.',
    }
  }

  // 1. Insert record into Supabase with explicit UTC timestamps
  const now = new Date().toISOString()
  const { error: dbError } = await supabase.from('articles').insert({
    title,
    slug,
    category,
    cover_image,
    excerpt,
    content,
    published,
    created_at: now,
    updated_at: now,
  })

  if (dbError) {
    return {
      success: false,
      message: `Database error: ${dbError.message}`,
    }
  }

  // 2. Clear static Next.js cache so the homepage updates immediately
  try {
    revalidatePath('/')
    revalidatePath('/feed.xml')
    revalidatePath('/sitemap.xml')
    revalidatePath(`/article/${slug}`)
  } catch (cacheError) {
    console.error('Cache revalidation warning:', cacheError)
  }

  // 3. Dispatch IndexNow ping for search engines
  if (published) {
    try {
      await fetch('https://www.wanderline.site/api/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urls: [`https://www.wanderline.site/article/${slug}`],
        }),
      })
    } catch (indexError) {
      console.error('IndexNow trigger warning:', indexError)
    }
  }

  return {
    success: true,
    message: 'Article published and site cache cleared successfully.',
    slug,
  }
}