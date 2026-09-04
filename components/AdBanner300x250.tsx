'use client'

import { useEffect, useRef } from 'react'

interface AdBanner300x250Props {
  className?: string
}

export default function AdBanner300x250({ className = '' }: AdBanner300x250Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clear any previous iframe/content to prevent duplicates
    container.innerHTML = ''

    // Create a standalone iframe programmatically
    const iframe = document.createElement('iframe')
    iframe.width = '300'
    iframe.height = '250'
    iframe.style.border = 'none'
    iframe.style.overflow = 'hidden'
    iframe.scrolling = 'no'
    iframe.title = 'ad-300x250'

    container.appendChild(iframe)

    const doc = iframe.contentWindow?.document
    if (doc) {
      doc.open()
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
            </style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : '92fb45cee330c56f2914966ceaa656d6',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://www.highrevenueformat.com/92fb45cee330c56f2914966ceaa656d6/invoke.js"></script>
          </body>
        </html>
      `)
      doc.close()
    }
  }, [])

  return (
    <div className={`w-full flex justify-center my-6 overflow-hidden ${className}`}>
      <div ref={containerRef} className="w-[300px] h-[250px] min-h-[250px]" />
    </div>
  )
}