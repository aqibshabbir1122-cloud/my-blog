'use client'

import AdBanner300x250 from '@/components/AdBanner300x250'

export default function StickySidebarAd() {
  const smartLinkUrl =
    'https://www.profitableratecpmnetwork.com/xjncp48q2z?key=bff7cd809dc4bcbf7d8a029a1997c74f'

  return (
    <aside className="hidden lg:block w-[300px] shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* Sticky Ad Box */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
          <span className="text-[10px] tracking-widest uppercase font-mono text-zinc-500 mb-2">
            Advertisement
          </span>
          <AdBanner300x250 />
        </div>

        {/* Editorial Quick Briefing Card */}
        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/70 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-amber-800 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900">
              Verified Dossier
            </span>
          </div>
          <p className="text-xs font-serif text-zinc-700 leading-relaxed mb-4">
            Access corroborated primary sources, investigative timelines, and global records.
          </p>
          <a
            href={smartLinkUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="w-full inline-flex items-center justify-center text-xs font-mono font-bold uppercase tracking-wider text-amber-950 bg-amber-200/70 hover:bg-amber-200 py-2.5 rounded-lg transition-colors"
          >
            Open Document →
          </a>
        </div>
      </div>
    </aside>
  )
}
