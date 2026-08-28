'use client'

import { useEffect, useRef, useState } from 'react'

interface AdSlotProps {
  slotId?: string
  format: 'banner-728x90' | 'rectangle-300x250' | 'native-4x1' | 'sidebar' | 'social-bar'
  adKey?: string
  className?: string
}

const adConfigMap: Record<
  string,
  { width: number; height: number; defaultKey: string; containerClass: string }
> = {
  'banner-728x90': {
    width: 728,
    height: 90,
    defaultKey: '',
    containerClass: 'min-h-[90px] max-w-[728px]',
  },
  'rectangle-300x250': {
    width: 300,
    height: 250,
    defaultKey: '',
    containerClass: 'min-h-[250px] max-w-[300px]',
  },
  'sidebar': {
    width: 300,
    height: 250,
    defaultKey: '',
    containerClass: 'min-h-[250px] max-w-[300px]',
  },
  'native-4x1': {
    width: 728,
    height: 180,
    defaultKey: '',
    containerClass: 'min-h-[180px] max-w-full sm:max-w-[728px]',
  },
  'social-bar': {
    width: 0,
    height: 0,
    defaultKey: '',
    containerClass: 'h-0 w-0 overflow-hidden',
  },
}

export default function AdSlot({
  slotId,
  format,
  adKey,
  className = '',
}: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const isLoadedRef = useRef(false)

  const config = adConfigMap[format] || adConfigMap['banner-728x90']
  const activeKey = adKey || config.defaultKey

  // Social Bar loads globally with delay
  useEffect(() => {
    if (format === 'social-bar' && activeKey && !isLoadedRef.current) {
      const loadSocialBar = () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `//www.highperformanceformat.com/${activeKey}/invoke.js`
        script.async = true
        document.body.appendChild(script)
        isLoadedRef.current = true
      }

      if (typeof window !== 'undefined') {
        setTimeout(loadSocialBar, 3500)
      }
    }
  }, [format, activeKey])

  // Lazy-load display units
  useEffect(() => {
    if (format === 'social-bar') return

    const target = containerRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [format])

  // Mount scripts only during idle time
  useEffect(() => {
    if (
      format === 'social-bar' ||
      !isVisible ||
      isLoadedRef.current ||
      !activeKey ||
      !containerRef.current
    ) {
      return
    }

    const container = containerRef.current

    const injectAd = () => {
      container.innerHTML = ''

      const optScript = document.createElement('script')
      optScript.type = 'text/javascript'
      optScript.text = `
        atOptions = {
          'key': '${activeKey}',
          'format': 'iframe',
          'height': ${config.height},
          'width': ${config.width},
          'params': {}
        };
      `

      const invokeScript = document.createElement('script')
      invokeScript.type = 'text/javascript'
      invokeScript.src = `//www.highperformanceformat.com/${activeKey}/invoke.js`
      invokeScript.async = true

      container.appendChild(optScript)
      container.appendChild(invokeScript)
      isLoadedRef.current = true
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(injectAd, { timeout: 2000 })
    } else {
      setTimeout(injectAd, 1500)
    }
  }, [isVisible, activeKey, config.height, config.width, format])

  if (format === 'social-bar') return null

  return (
    <div
      className={`w-full flex flex-col items-center justify-center overflow-hidden my-6 transition-all ${className}`}
    >
      <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-sans">
        Advertisement
      </span>
      <div
        ref={containerRef}
        className={`w-full flex items-center justify-center bg-gray-50/75 rounded-lg border border-dashed border-gray-200 ${config.containerClass}`}
      >
        {!activeKey && process.env.NODE_ENV === 'development' && (
          <span className="text-xs text-gray-400 font-mono">
            Ad Slot: {slotId || format} ({config.width}x{config.height})
          </span>
        )}
      </div>
    </div>
  )
}