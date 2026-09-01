'use client'

import { useEffect } from 'react'

export default function CappedPopunder() {
  useEffect(() => {
    // 1. Check if the popunder already triggered during this browser session
    const hasTriggered = sessionStorage.getItem('adsterra_popunder_loaded')

    if (!hasTriggered) {
      // 2. Mark as triggered so it won't load on subsequent page clicks
      sessionStorage.setItem('adsterra_popunder_loaded', 'true')

      // 3. Inject the Adsterra popunder script
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://pl31123022.profitableratecpmnetwork.com/d4/45/f0/d445f0a5934eef3090a48d3364c29e88.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return null
}