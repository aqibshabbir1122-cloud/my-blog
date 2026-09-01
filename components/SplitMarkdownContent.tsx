'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import AdBanner300x250 from '@/components/AdBanner300x250'

interface SplitMarkdownContentProps {
  content: string
}

export default function SplitMarkdownContent({ content }: SplitMarkdownContentProps) {
  if (!content) return null

  const smartLinkUrl =
    'https://www.profitableratecpmnetwork.com/xjncp48q2z?key=bff7cd809dc4bcbf7d8a029a1997c74f'

  const blocks = content.split(/\n\s*\n/)

  if (blocks.length < 4) {
    return (
      <article className="prose prose-lg max-w-none font-serif text-gray-800 leading-relaxed prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-950 prose-a:text-amber-800 prose-a:underline hover:prose-a:text-amber-950 prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-ul:list-disc prose-ol:list-decimal prose-img:rounded-xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    )
  }

  // Split into 3 sections across the reading flow
  const point1 = 2
  const point2 = Math.min(blocks.length - 1, 5)

  const section1 = blocks.slice(0, point1).join('\n\n')
  const section2 = blocks.slice(point1, point2).join('\n\n')
  const section3 = blocks.slice(point2).join('\n\n')

  return (
    <article className="prose prose-lg max-w-none font-serif text-gray-800 leading-relaxed prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-950 prose-a:text-amber-800 prose-a:underline hover:prose-a:text-amber-950 prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-ul:list-disc prose-ol:list-decimal prose-img:rounded-xl">
      {/* 1. Introduction Paragraphs */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{section1}</ReactMarkdown>

      {/* 2. Contextual Mid-Content SmartLink Bulletin Card */}
      <div className="not-prose my-6 p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-700 animate-pulse shrink-0" />
          <span className="text-sm font-sans font-medium text-zinc-900">
            Official Bulletin: View verified data sheet & incident timeline
          </span>
        </div>
        <a
          href={smartLinkUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-900 bg-amber-200/60 hover:bg-amber-200 px-3.5 py-2 rounded-lg transition-colors shrink-0"
        >
          Access Briefing →
        </a>
      </div>

      {/* 3. Middle Paragraphs */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{section2}</ReactMarkdown>

      {/* 4. In-Article 300x250 Ad Display Unit */}
      <div className="not-prose my-8 flex flex-col items-center justify-center">
        <span className="text-[10px] tracking-widest uppercase font-mono text-zinc-500 mb-2">
          Advertisement
        </span>
        <AdBanner300x250 />
      </div>

      {/* 5. Concluding Paragraphs */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{section3}</ReactMarkdown>
    </article>
  )
}