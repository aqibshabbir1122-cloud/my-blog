'use client'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings: TocItem[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  if (!headings || headings.length < 2) return null

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="my-8 p-5 bg-white rounded-xl border border-gray-200/80 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
        Table of Contents
      </p>
      <ul className="space-y-2 text-sm font-serif">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`${heading.level === 3 ? 'pl-4 text-xs' : 'text-sm'}`}
          >
            <button
              onClick={() => scrollToHeading(heading.id)}
              className="text-gray-700 hover:text-blue-600 transition text-left leading-relaxed"
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}