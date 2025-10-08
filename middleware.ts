import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authToken = request.cookies.get('auth-token')
    
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // Parse the auth token
      const tokenData = JSON.parse(authToken.value)
      
      // Check if token is expired
      if (Date.now() > tokenData.exp) {
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('auth-token')
        return response
      }

      // Check if user has admin or editor role
      if (tokenData.role !== 'admin' && tokenData.role !== 'editor') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

    } catch (error) {
      console.error('Token parsing error:', error)
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}