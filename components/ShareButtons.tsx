'use client'

import { useEffect, useState } from 'react'

export default function ShareButtons({ title }: { title: string }) {
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    alert('Link copied!')
  }

  return (
    <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 my-8">
      <p className="text-sm text-gray-500">Share this story</p>
      <div className="flex gap-2">
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs hover:bg-gray-200">X</a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs hover:bg-gray-200">f</a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs hover:bg-gray-200">in</a>
        <button onClick={copyLink} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs hover:bg-gray-200">Link</button>
      </div>
    </div>
  )
}