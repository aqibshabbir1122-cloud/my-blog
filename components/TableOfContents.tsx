'use client'

import { useMemo } from 'react'

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const headings = useMemo(() => {
    if (!content) return []
    const lines = content.split('\n')
    return lines
      .filter((line) => line.startsWith('## '))
      .map((line) => {
        const text = line.replace(/^##\s+/, '').trim()
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
        return { text, id }
      })
  }, [content])

  if (headings.length === 0) return null

  return (
    <nav className="p-4 bg-gray-50 rounded-xl border border-gray-200">
      <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
        In This Dispatch
      </h3>
      <ul className="space-y-2 text-sm font-serif">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="text-gray-600 hover:text-amber-700 transition block leading-snug"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}