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

    // Prevent duplicate injections on fast hot-reload or hydration
    if (container.firstChild) return

    const atOptions = {
      key: '92fb45cee330c56f2914966ceaa656d6',
      format: 'iframe',
      height: 250,
      width: 300,
      params: {},
    }

    const confScript = document.createElement('script')
    confScript.type = 'text/javascript'
    confScript.innerHTML = `atOptions = ${JSON.stringify(atOptions)};`

    const invokeScript = document.createElement('script')
    invokeScript.type = 'text/javascript'
    invokeScript.src = `https://www.highrevenueformat.com/${atOptions.key}/invoke.js`

    container.appendChild(confScript)
    container.appendChild(invokeScript)
  }, [])

  return (
    <div className={`w-full flex justify-center my-6 overflow-hidden ${className}`}>
      <div
        ref={containerRef}
        style={{ width: '300px', height: '250px', minHeight: '250px' }}
      />
    </div>
  )
}