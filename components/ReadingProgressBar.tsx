'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgressBar({ color }: { color: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(scrolled)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-50">
      <div
        className={`h-full ${color} transition-all duration-150`}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}