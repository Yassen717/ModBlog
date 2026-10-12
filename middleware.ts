import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE, verifyAuthToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    const payload = await verifyAuthToken(request.cookies.get(AUTH_COOKIE)?.value ?? '')

    if (!payload) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete(AUTH_COOKIE)
      return response
    }

    if (payload.role !== 'admin' && payload.role !== 'editor') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    return NextResponse.next()
  }

  // Protect mutating API routes (login/logout stay public)
  if (
    pathname.startsWith('/api/') &&
    !pathname.startsWith('/api/auth/') &&
    request.method !== 'GET'
  ) {
    const payload = await verifyAuthToken(request.cookies.get(AUTH_COOKIE)?.value ?? '')

    if (!payload) {
      const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      response.cookies.delete(AUTH_COOKIE)
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*'
  ]
}
