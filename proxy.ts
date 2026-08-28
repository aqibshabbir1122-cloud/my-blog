import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname === '/admin/login'

  if (error || !user) {
    if (!isAuthPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return supabaseResponse
  }

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL('/admin/messages', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}