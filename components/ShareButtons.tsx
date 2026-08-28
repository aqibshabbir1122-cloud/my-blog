'use client'

import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  slug?: string
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl =
    typeof window !== 'undefined'
      ? slug
        ? `${window.location.origin}/article/${slug}`
        : window.location.href
      : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link', err)
    }
  }

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    )
  }

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs uppercase tracking-wider text-gray-700 font-semibold">
        Share
      </span>
      <button
        onClick={shareTwitter}
        aria-label="Share on X"
        className="p-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-950 transition"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
      <button
        onClick={shareFacebook}
        aria-label="Share on Facebook"
        className="p-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-950 transition"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-700 font-medium hover:bg-gray-100 hover:text-gray-950 transition"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-600" />
        ) : (
          <Link2 className="w-3.5 h-3.5" />
        )}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  )
}