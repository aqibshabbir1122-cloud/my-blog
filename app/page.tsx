export const dynamic = 'force-dynamic'
export const revalidate = 3600

import { supabase } from '@/lib/supabase'
import HomeGrid from '@/components/HomeGrid'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import AdBanner728 from '@/components/AdBanner728'
import NativeAdBanner from '@/components/NativeAdBanner'

export default async function Home() {
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, cover_image, category, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const totalArticles = articles?.length || 0

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      <SiteHeader variant="gradient" logoAsH1 />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* 1. Top Leaderboard Ad Unit */}
        <div className="mb-10 flex flex-col items-center justify-center">
          <span className="text-[10px] tracking-widest uppercase font-mono text-zinc-500 mb-2">
            Advertisement
          </span>
          <AdBanner728 />
        </div>

        <HomeGrid articles={articles || []} />

        {/* 2. Mid-Page Native Recommendation Widget */}
        <div className="my-16 border-t border-zinc-200 pt-8">
          <span className="text-[10px] tracking-widest uppercase font-mono text-zinc-500 block text-center mb-4">
            Sponsored Recommendations
          </span>
          <NativeAdBanner />
        </div>
      </main>

      {/* 3. By The Numbers Banner */}
      <div className="w-full bg-gray-900 text-white mt-12">
        <div className="max-w-5xl mx-auto px-6 py-14 text-center">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
            By the numbers
          </p>
          <p className="text-5xl font-serif mb-2">{totalArticles}+ stories</p>
          <p className="text-gray-400 text-sm">
            Travel notes, investigations, and culture pieces from around the world.
          </p>
        </div>
      </div>

      {/* 4. Bottom Leaderboard Ad Section */}
      <section className="bg-zinc-100 border-t border-zinc-200 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center justify-center min-h-[120px]">
          <span className="text-[10px] tracking-widest uppercase font-mono text-zinc-600 mb-2">
            Advertisement
          </span>
          <AdBanner728 />
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}