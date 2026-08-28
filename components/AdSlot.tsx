'use client'

import { useEffect, useRef } from 'react'

export type AdFormat =
  | 'banner'
  | 'banner-728x90'
  | 'sidebar'
  | 'sidebar-300x250'
  | 'horizontal'
  | 'horizontal-468x60'

interface AdSlotProps {
  format?: AdFormat
  className?: string
}

const ADSTERRA_CONFIG: Record<
  AdFormat,
  { key: string; width: number; height: number; format: string }
> = {
  banner: {
    key: 'adsterra_banner_slot_key_here',
    width: 728,
    height: 90,
    format: 'iframe',
  },
  'banner-728x90': {
    key: 'adsterra_banner_slot_key_here',
    width: 728,
    height: 90,
    format: 'iframe',
  },
  sidebar: {
    key: 'adsterra_sidebar_slot_key_here',
    width: 300,
    height: 250,
    format: 'iframe',
  },
  'sidebar-300x250': {
    key: 'adsterra_sidebar_slot_key_here',
    width: 300,
    height: 250,
    format: 'iframe',
  },
  horizontal: {
    key: 'adsterra_horizontal_slot_key_here',
    width: 468,
    height: 60,
    format: 'iframe',
  },
  'horizontal-468x60': {
    key: 'adsterra_horizontal_slot_key_here',
    width: 468,
    height: 60,
    format: 'iframe',
  },
}

export default function AdSlot({ format = 'banner', className = '' }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isLoadedRef = useRef(false)
  const config = ADSTERRA_CONFIG[format] || ADSTERRA_CONFIG['banner']

  useEffect(() => {
    if (isLoadedRef.current || !containerRef.current) return

    const loadAd = () => {
      if (!containerRef.current || isLoadedRef.current) return
      isLoadedRef.current = true

      try {
        const confScript = document.createElement('script')
        confScript.type = 'text/javascript'
        confScript.text = `
          atOptions = {
            'key': '${config.key}',
            'format': '${config.format}',
            'height': ${config.height},
            'width': ${config.width},
            'params': {}
          };
        `

        const invokeScript = document.createElement('script')
        invokeScript.type = 'text/javascript'
        invokeScript.async = true
        invokeScript.src = `//www.highperformanceformat.com/${config.key}/invoke.js`

        containerRef.current.appendChild(confScript)
        containerRef.current.appendChild(invokeScript)
      } catch (err) {
        console.error('Adsterra initialization error:', err)
      }
    }

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = (window as any).requestIdleCallback(loadAd, { timeout: 2500 })
      return () => {
        if ('cancelIdleCallback' in window) {
          ;(window as any).cancelIdleCallback(handle)
        }
      }
    } else {
      const timer = setTimeout(loadAd, 1500)
      return () => clearTimeout(timer)
    }
  }, [config])

  return (
    <div
      className={`my-8 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-300 ${className}`}
    >
      <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-sans select-none">
        Advertisement
      </span>

      <div
        ref={containerRef}
        style={{
          minWidth: `${Math.min(config.width, 300)}px`,
          minHeight: `${config.height}px`,
          maxWidth: `${config.width}px`,
          width: '100%',
        }}
        className="flex items-center justify-center bg-gray-50/50 rounded-lg border border-gray-100"
      />
    </div>
  )
}