'use client'

import { useState } from 'react'
import { Share2, Check, Twitter, Linkedin } from 'lucide-react'

interface SocialShareProps {
  title: string
  url: string
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link', err)
    }
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(url)}`

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`

  return (
    <div className="flex items-center space-x-3 my-6 py-3 border-y border-gray-100">
      <span className="text-xs uppercase font-sans tracking-widest text-gray-500 mr-2 flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5" /> Share
      </span>

      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        className="p-2 rounded-full text-gray-600 hover:text-black hover:bg-gray-100 transition"
      >
        <Twitter className="w-4 h-4" />
      </a>

      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="p-2 rounded-full text-gray-600 hover:text-blue-700 hover:bg-gray-100 transition"
      >
        <Linkedin className="w-4 h-4" />
      </a>

      <button
        onClick={handleCopy}
        aria-label="Copy article link"
        className="flex items-center gap-1 text-xs font-sans text-gray-600 hover:text-gray-950 px-2.5 py-1 rounded-md hover:bg-gray-100 transition"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-green-600" />
            <span className="text-green-600 font-medium">Copied</span>
          </>
        ) : (
          <span>Copy link</span>
        )}
      </button>
    </div>
  )
}