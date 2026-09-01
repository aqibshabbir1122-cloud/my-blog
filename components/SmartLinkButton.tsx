'use client'

interface SmartLinkButtonProps {
  label?: string
  subtext?: string
}

export default function SmartLinkButton({
  label = 'Explore Verified Live Updates',
  subtext = 'External report & resources',
}: SmartLinkButtonProps) {
  const directLinkUrl =
    'https://www.profitableratecpmnetwork.com/xjncp48q2z?key=bff7cd809dc4bcbf7d8a029a1997c74f'

  return (
    <div className="my-8 flex justify-center">
      <a
        href={directLinkUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="group relative inline-flex items-center justify-between gap-4 w-full max-w-lg px-6 py-4 rounded-xl bg-gradient-to-r from-amber-900 to-zinc-900 text-white font-sans shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-200 border border-amber-800/40"
      >
        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold tracking-wide text-amber-100 group-hover:text-white transition-colors">
            {label}
          </span>
          <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
            {subtext}
          </span>
        </div>
        <span className="text-amber-300 group-hover:translate-x-1 transition-transform font-bold text-lg">
          →
        </span>
      </a>
    </div>
  )
}