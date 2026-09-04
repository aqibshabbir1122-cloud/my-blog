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

    // Prevent duplicate injections on re-render
    if (container.querySelector('iframe')) return

    const iframe = document.createElement('iframe')
    iframe.width = '300'
    iframe.height = '250'
    iframe.scrolling = 'no'
    iframe.frameBorder = '0'
    iframe.style.border = 'none'
    iframe.style.overflow = 'hidden'
    iframe.style.width = '300px'
    iframe.style.height = '250px'

    container.appendChild(iframe)

    const doc = iframe.contentWindow?.document
    if (!doc) return

    doc.open()
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            html, body {
              margin: 0;
              padding: 0;
              overflow: hidden;
              width: 300px;
              height: 250px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key': '92fb45cee330c56f2914966ceaa656d6',
              'format': 'iframe',
              'height': 250,
              'width': 300,
              'params': {}
            };
          </script>
          <script type="text/javascript" src="https://www.highrevenueformat.com/92fb45cee330c56f2914966ceaa656d6/invoke.js"></script>
        </body>
      </html>
    `)
    doc.close()
  }, [])

  return (
    <div className={`w-full flex justify-center my-4 overflow-hidden ${className}`}>
      <div
        ref={containerRef}
        className="w-[300px] h-[250px] min-w-[300px] min-h-[250px] flex items-center justify-center bg-transparent"
      />
    </div>
  )
}