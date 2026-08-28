'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // If the user is on the login page, don't block rendering
    if (pathname === '/admin/login') {
      setAuthenticated(true)
      return
    }

    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setAuthenticated(false)
        router.replace('/admin/login')
      } else {
        setAuthenticated(true)
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== '/admin/login') {
        setAuthenticated(false)
        router.replace('/admin/login')
      } else if (session && pathname === '/admin/login') {
        router.replace('/admin')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [pathname, router])

  // Show a clean loading state while verifying auth session
  if (authenticated === null && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center text-sm font-mono text-gray-500">
        Authenticating admin session...
      </div>
    )
  }

  return <>{children}</>
}