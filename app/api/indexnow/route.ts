import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const HOST = 'www.wanderline.site'
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const expectedSecret = process.env.INDEXNOW_SECRET

    // Optional bearer authentication for webhook protection
    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const key = process.env.INDEXNOW_KEY
    if (!key) {
      return NextResponse.json(
        { error: 'INDEXNOW_KEY is not configured in environment variables' },
        { status: 500 }
      )
    }

    const body = await req.json().catch(() => ({}))
    let urlsToIndex: string[] = []

    if (body.urls && Array.isArray(body.urls) && body.urls.length > 0) {
      urlsToIndex = body.urls
    } else if (body.slug) {
      urlsToIndex = [`https://${HOST}/article/${body.slug}`]
    } else {
      // Fetch the 10 most recent dispatches from Supabase using created_at
      const { data: articles, error } = await supabase
        .from('articles')
        .select('slug')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error || !articles) {
        return NextResponse.json(
          { error: 'Failed to fetch article slugs from database', details: error?.message },
          { status: 500 }
        )
      }

      urlsToIndex = [
        `https://${HOST}`,
        `https://${HOST}/feed.xml`,
        ...articles.map((art) => `https://${HOST}/article/${art.slug}`),
      ]
    }

    const payload = {
      host: HOST,
      key: key,
      keyLocation: `https://${HOST}/${key}.txt`,
      urlList: urlsToIndex,
    }

    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    })

    if (response.ok || response.status === 202) {
      return NextResponse.json({
        success: true,
        message: 'URLs submitted to IndexNow successfully',
        submittedCount: urlsToIndex.length,
        urlList: urlsToIndex,
      })
    }

    const errText = await response.text()
    return NextResponse.json(
      { error: 'IndexNow submission failed', status: response.status, details: errText },
      { status: response.status }
    )
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Internal Server Error', details: errMessage }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'IndexNow endpoint active',
    endpoint: INDEXNOW_ENDPOINT,
    host: HOST,
  })
}