'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface StickyAdProps {
  adKey?: string
  width?: number
  height?: number
}

export default function StickyAd({
  adKey = 'PASTE_YOUR_728x90_KEY_HERE',
  width = 728,
  height = 90,
}: StickyAdProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isLoadedRef = useRef(false)

  useEffect(() => {
    // Show sticky ad after 6 seconds of reading
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 6000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (
      !isVisible ||
      isDismissed ||
      isLoadedRef.current ||
      !containerRef.current ||
      adKey.includes('PASTE_YOUR')
    ) {
      return
    }

    isLoadedRef.current = true

    try {
      const confScript = document.createElement('script')
      confScript.type = 'text/javascript'
      confScript.text = `
        atOptions = {
          'key': '${adKey}',
          'format': 'iframe',
          'height': ${height},
          'width': ${width},
          'params': {}
        };
      `

      const invokeScript = document.createElement('script')
      invokeScript.type = 'text/javascript'
      invokeScript.async = true
      invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`

      containerRef.current.appendChild(confScript)
      containerRef.current.appendChild(invokeScript)
    } catch (err) {
      console.error('Sticky Ad initialization error:', err)
    }
  }, [isVisible, isDismissed, adKey, width, height])

  if (isDismissed || !isVisible) {
    return null
  }

  return (
    <div
      aria-label="Bottom promotional placement"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl py-2 px-4 transition-transform duration-500 ease-in-out flex flex-col items-center justify-center"
    >
      <div className="relative w-full max-w-[728px] flex items-center justify-center">
        <button
          onClick={() => setIsDismissed(true)}
          aria-label="Close advertisement"
          className="absolute -top-3 -right-3 z-50 bg-gray-900 text-white hover:bg-gray-700 rounded-full p-1 shadow-md transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div
          ref={containerRef}
          style={{
            minWidth: `${Math.min(width, 300)}px`,
            minHeight: `${height}px`,
            maxWidth: `${width}px`,
            width: '100%',
          }}
          className="flex items-center justify-center overflow-hidden"
        />
      </div>
    </div>
  )
}