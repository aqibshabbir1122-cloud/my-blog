'use client'

import { useEffect, useRef } from 'react'

export type AdFormat = 'native-4x1' | 'sidebar' | 'banner' | 'banner-728x90' | 'native'

interface AdSlotProps {
  format: AdFormat
  className?: string
}

export default function AdSlot({ format, className = '' }: AdSlotProps) {
  const adContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadAd = () => {
      if (!adContainerRef.current) return
    }

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(loadAd, { timeout: 2000 })
      return () => window.cancelIdleCallback(idleId)
    } else {
      const timerId = setTimeout(loadAd, 1500)
      return () => clearTimeout(timerId)
    }
  }, [format])

  const getContainerStyles = () => {
    switch (format) {
      case 'native-4x1':
        return 'min-h-[280px] w-full my-8'
      case 'sidebar':
        return 'min-h-[250px] w-full my-6'
      case 'banner':
      case 'banner-728x90':
        return 'min-h-[90px] w-full my-6'
      default:
        return 'min-h-[250px] w-full'
    }
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 bg-gray-100/70 rounded-xl border border-gray-200/80 text-center ${getContainerStyles()} ${className}`}
    >
      <span className="text-[10px] uppercase tracking-widest text-gray-700 font-sans font-medium mb-2">
        Advertisement
      </span>
      <div ref={adContainerRef} className="w-full flex items-center justify-center">
        <span className="text-xs text-gray-600 font-serif italic">
          Sponsor Placement
        </span>
      </div>
    </div>
  )
}