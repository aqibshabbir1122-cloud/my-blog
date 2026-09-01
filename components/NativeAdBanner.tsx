'use client'

import { useEffect, useRef } from 'react'

export default function NativeAdBanner() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Prevent duplicate injections
    const existingScript = document.getElementById('adsterra-native-script')
    if (existingScript) return

    const script = document.createElement('script')
    script.id = 'adsterra-native-script'
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    script.src =
      'https://pl31123021.profitableratecpmnetwork.com/4f49be0b2a8803bf305dbede7a33eba6/invoke.js'

    containerRef.current.appendChild(script)
  }, [])

  return (
    <div ref={containerRef} className="my-8 w-full flex justify-center">
      <div id="container-4f49be0b2a8803bf305dbede7a33eba6" className="w-full" />
    </div>
  )
}