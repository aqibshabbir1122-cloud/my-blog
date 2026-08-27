'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const reactions = [
  { type: 'love', emoji: '❤️' },
  { type: 'wow', emoji: '😮' },
  { type: 'sad', emoji: '😢' },
  { type: 'clap', emoji: '👏' },
]

type ReactionBarProps = {
  articleSlug: string
  initialCounts: Record<string, number>
}

export default function ReactionBar({ articleSlug, initialCounts }: ReactionBarProps) {
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(`reacted-${articleSlug}`)
    if (saved) setSelected(saved)
  }, [articleSlug])

  async function handleReact(type: string) {
    if (selected) return

    setSelected(type)
    localStorage.setItem(`reacted-${articleSlug}`, type)
    setCounts((prev) => ({ ...prev, [type]: (prev[type] || 0) + 1 }))

    const { error } = await supabase.rpc('increment_reaction', {
      p_slug: articleSlug,
      p_type: type,
    })

    if (error) {
      console.error('Failed to save reaction:', error)
    }
  }

  return (
    <div className="text-center mb-10">
      <p className="text-sm text-gray-500 mb-3">Did you find this story</p>
      <div className="flex justify-center gap-6 text-2xl">
        {reactions.map(({ type, emoji }) => (
          <button
            key={type}
            onClick={() => handleReact(type)}
            disabled={!!selected}
            className={`flex flex-col items-center transition transform hover:scale-125 ${
              selected === type ? 'scale-125' : selected ? 'opacity-40' : 'opacity-70'
            } ${selected ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <span>{emoji}</span>
            <span className="text-xs text-gray-400 mt-1">{counts[type] || 0}</span>
          </button>
        ))}
      </div>
    </div>
  )
}