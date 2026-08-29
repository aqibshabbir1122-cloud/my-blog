import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  const siteUrl = 'https://www.wanderline.site'

  const itemsXml = (articles || [])
    .map(
      (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${siteUrl}/article/${item.slug}</link>
      <guid>${siteUrl}/article/${item.slug}</guid>
      <pubDate>${new Date(item.created_at).toUTCString()}</pubDate>
      <description><![CDATA[${item.excerpt || ''}]]></description>
      <category>${item.category || 'General'}</category>
    </item>`
    )
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Wanderline Dispatches</title>
      <link>${siteUrl}</link>
      <description>Independent global journalism covering digital culture, international stories, travel, and investigative features.</description>
      <language>en</language>
      <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
      ${itemsXml}
    </channel>
  </rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}