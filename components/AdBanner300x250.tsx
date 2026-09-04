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

    // Avoid duplicate script runs
    if (container.querySelector('iframe') || container.querySelector('script')) {
      return
    }

    const confScript = document.createElement('script')
    confScript.type = 'text/javascript'
    confScript.innerHTML = `
      atOptions = {
        'key': '92fb45cee330c56f2914966ceaa656d6',
        'format': 'iframe',
        'height': 250,
        'width': 300,
        'params': {}
      };
    `

    const invokeScript = document.createElement('script')
    invokeScript.type = 'text/javascript'
    invokeScript.src = 'https://www.highrevenueformat.com/92fb45cee330c56f2914966ceaa656d6/invoke.js'

    container.appendChild(confScript)
    container.appendChild(invokeScript)
  }, [])

  return (
    <div className={`w-full flex justify-center my-4 overflow-hidden ${className}`}>
      <div
        ref={containerRef}
        id="adsterra-300x250-container"
        className="w-[300px] h-[250px] min-h-[250px] bg-transparent"
      />
    </div>
  )
}