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
    key: '',
    width: 728,
    height: 90,
    format: 'iframe',
  },
  'banner-728x90': {
    key: '',
    width: 728,
    height: 90,
    format: 'iframe',
  },
  sidebar: {
    key: '',
    width: 300,
    height: 250,
    format: 'iframe',
  },
  'sidebar-300x250': {
    key: '',
    width: 300,
    height: 250,
    format: 'iframe',
  },
  horizontal: {
    key: '',
    width: 468,
    height: 60,
    format: 'iframe',
  },
  'horizontal-468x60': {
    key: '',
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
    // Only execute if a valid non-empty Adsterra key is provided
    if (
      !config.key ||
      config.key.includes('slot_key_here') ||
      isLoadedRef.current ||
      !containerRef.current
    ) {
      return
    }

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
      const handle = (window as Window & { requestIdleCallback: Function }).requestIdleCallback(
        loadAd,
        { timeout: 2500 }
      )
      return () => {
        if ('cancelIdleCallback' in window) {
          ;(window as Window & { cancelIdleCallback: Function }).cancelIdleCallback(handle)
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
      <span className="text-[10px] uppercase tracking-widest text-gray-600 mb-1 font-sans select-none">
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
        className="flex items-center justify-center bg-gray-50/50 rounded-lg border border-gray-200"
      />
    </div>
  )
}