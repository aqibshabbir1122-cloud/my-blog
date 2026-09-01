'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import AdBanner300x250 from '@/components/AdBanner300x250'

interface SplitMarkdownContentProps {
  content: string
}

export default function SplitMarkdownContent({ content }: SplitMarkdownContentProps) {
  if (!content) return null

  // Split content by paragraph blocks
  const blocks = content.split(/\n\s*\n/)

  // If the article is short (less than 4 paragraphs), render normally without mid-ad
  if (blocks.length < 4) {
    return (
      <article className="prose prose-lg max-w-none font-serif text-gray-800 leading-relaxed prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-950 prose-a:text-amber-800 prose-a:underline hover:prose-a:text-amber-950 prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-ul:list-disc prose-ol:list-decimal prose-img:rounded-xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    )
  }

  // Split roughly in half (or after the 3rd paragraph)
  const midPoint = Math.min(Math.floor(blocks.length / 2), 3)
  const firstHalf = blocks.slice(0, midPoint).join('\n\n')
  const secondHalf = blocks.slice(midPoint).join('\n\n')

  return (
    <article className="prose prose-lg max-w-none font-serif text-gray-800 leading-relaxed prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-950 prose-a:text-amber-800 prose-a:underline hover:prose-a:text-amber-950 prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-ul:list-disc prose-ol:list-decimal prose-img:rounded-xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{firstHalf}</ReactMarkdown>

      {/* Mid-Article Ad Banner */}
      <div className="not-prose my-8 flex flex-col items-center justify-center">
        <span className="text-[10px] tracking-widest uppercase font-mono text-zinc-500 mb-2">
          Advertisement
        </span>
        <AdBanner300x250 />
      </div>

      <ReactMarkdown remarkPlugins={[remarkGfm]}>{secondHalf}</ReactMarkdown>
    </article>
  )
}