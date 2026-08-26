'use client'

import { useState } from 'react'

const reactions = ['❤️', '😮', '😢', '👏']

export default function ReactionBar() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="text-center mb-10">
      <p className="text-sm text-gray-500 mb-3">Did you find this story</p>
      <div className="flex justify-center gap-4 text-2xl">
        {reactions.map((emoji, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`transition transform hover:scale-125 ${selected === i ? 'scale-125' : 'opacity-70'}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}