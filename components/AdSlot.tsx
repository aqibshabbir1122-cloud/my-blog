'use client'

import { useEffect, useRef } from 'react'

interface AdSlotProps {
  slotId?: string
  format: 'banner-728x90' | 'rectangle-300x250' | 'mobile-320x50' | 'in-article' | 'sidebar'
  className?: string
}

const adDimensions: Record<string, string> = {
  'banner-728x90': 'min-h-[90px] max-w-[728px]',
  'rectangle-300x250': 'min-h-[250px] max-w-[300px]',
  'mobile-320x50': 'min-h-[50px] max-w-[320px]',
  'in-article': 'min-h-[120px] max-w-full sm:max-w-[728px]',
  'sidebar': 'min-h-[250px] max-w-[300px]',
}

export default function AdSlot({ slotId, format, className = '' }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Ad network script mounting point
  }, [slotId])

  return (
    <div
      className={`w-full flex flex-col items-center justify-center overflow-hidden transition-all ${className}`}
    >
      <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-sans">
        Advertisement
      </span>
      <div
        ref={containerRef}
        className={`w-full flex items-center justify-center bg-gray-50/75 rounded-lg border border-dashed border-gray-200 ${
          adDimensions[format] || 'min-h-[100px]'
        }`}
      >
        {process.env.NODE_ENV === 'development' && (
          <span className="text-xs text-gray-400 font-mono">
            Ad Slot: {slotId || format}
          </span>
        )}
      </div>
    </div>
  )
}