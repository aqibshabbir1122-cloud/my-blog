export const revalidate = 3600

import { supabase } from '@/lib/supabase'
import HomeGrid from '@/components/HomeGrid'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import AdSlot from '@/components/AdSlot'

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
        {/* Top Leaderboard Ad Unit */}
        <AdSlot format="banner-728x90" className="mb-10" />

        <HomeGrid articles={articles || []} />
      </main>

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

      <SiteFooter />
    </div>
  )
}