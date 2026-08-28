'use client'

import { useEffect, useRef } from 'react'

interface AdSlotProps {
  format: 'banner-728x90' | 'rectangle-300x250' | 'mobile-320x50'
  className?: string
}

const adDimensions = {
  'banner-728x90': 'min-h-[90px] max-w-[728px]',
  'rectangle-300x250': 'min-h-[250px] max-w-[300px]',
  'mobile-320x50': 'min-h-[50px] max-w-[320px]',
}

export default function AdSlot({ format, className = '' }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Adsterra / network script mounting entry point
    // Scripts will execute inside containerRef safely without layout jumps
  }, [])

  return (
    <div
      className={`w-full my-8 flex flex-col items-center justify-center overflow-hidden transition-all ${className}`}
    >
      <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
        Advertisement
      </span>
      <div
        ref={containerRef}
        className={`w-full flex items-center justify-center bg-gray-50/50 rounded border border-dashed border-gray-200 ${adDimensions[format]}`}
      >
        {/* Placeholder label visible only in development */}
        {process.env.NODE_ENV === 'development' && (
          <span className="text-xs text-gray-400 font-mono">
            Ad Slot: {format}
          </span>
        )}
      </div>
    </div>
  )
}