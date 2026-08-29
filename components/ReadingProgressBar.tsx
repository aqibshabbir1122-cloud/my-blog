'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgressBar() {
  const [completion, setCompletion] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentProgress = window.scrollY
      const scrollHeight = document.body.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        setCompletion(
          Number((currentProgress / scrollHeight).toFixed(2)) * 100
        )
      }
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{ transform: `translateX(${completion - 100}%)` }}
      className="fixed top-0 left-0 w-full h-[3px] bg-amber-700 z-50 transition-transform duration-75 ease-out"
    />
  )
}