'use client'

import { useState } from 'react'
import { Check, Twitter, Facebook, Link2 } from 'lucide-react'

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
      <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
        Share
      </span>
      <button
        onClick={shareTwitter}
        aria-label="Share on X"
        className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
      >
        <Twitter className="w-4 h-4" />
      </button>
      <button
        onClick={shareFacebook}
        aria-label="Share on Facebook"
        className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
      >
        <Facebook className="w-4 h-4" />
      </button>
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link2 className="w-3.5 h-3.5" />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  )
}