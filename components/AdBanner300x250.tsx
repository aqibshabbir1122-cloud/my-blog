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
    if (container.hasChildNodes()) return

    // 1. Define atOptions on the window object
    ;(window as unknown as { atOptions: Record<string, unknown> }).atOptions = {
      key: '92fb45cee330c56f2914966ceaa656d6',
      format: 'iframe',
      height: 250,
      width: 300,
      params: {},
    }

    // 2. Create and inject invoke.js
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://www.highrevenueformat.com/92fb45cee330c56f2914966ceaa656d6/invoke.js'

    container.appendChild(script)
  }, [])

  return (
    <div className={`w-full flex justify-center my-4 overflow-hidden ${className}`}>
      <div
        ref={containerRef}
        className="w-[300px] h-[250px] min-h-[250px] min-w-[300px] flex items-center justify-center bg-transparent"
      />
    </div>
  )
}