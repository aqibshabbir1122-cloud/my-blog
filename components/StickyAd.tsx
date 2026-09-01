'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface StickyAdProps {
  adKey?: string
  width?: number
  height?: number
}

export default function StickyAd({
  adKey = '60e4236c44b94a24cab74af2793745f3',
  width = 728,
  height = 90,
}: StickyAdProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Show sticky ad after 6 seconds of reading
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 6000)

    return () => clearTimeout(timer)
  }, [])

  if (isDismissed || !isVisible) {
    return null
  }

  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '${adKey}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highrevenueformat.com/${adKey}/invoke.js"></script>
      </body>
    </html>
  `

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
          style={{
            minHeight: `${height}px`,
            maxWidth: `${width}px`,
            width: '100%',
          }}
          className="flex items-center justify-center overflow-hidden"
        >
          <iframe
            title="sticky-bottom-ad"
            srcDoc={adHtml}
            width={width}
            height={height}
            className="border-0 overflow-hidden max-w-full"
            scrolling="no"
          />
        </div>
      </div>
    </div>
  )
}