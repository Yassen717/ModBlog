import { NextRequest, NextResponse } from 'next/server'

// GET /api/auth/me - Get current user info
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token')
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Parse the auth token (in production, verify JWT)
    const tokenData = JSON.parse(authToken.value)
    
    // Check if token is expired
    if (Date.now() > tokenData.exp) {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      )
    }

    // Simple user store (in production, fetch from database)
    const users = [
      {
        id: '1',
        email: 'admin@modernblog.com',
        name: 'Admin User',
        role: 'admin',
        avatar: '/images/caspar-camille-rubin-0qvBNep1Y04-unsplash.webp'
      },
      {
        id: '2',
        email: 'editor@modernblog.com',
        name: 'Editor User',
        role: 'editor',
        avatar: '/images/markus-spiske-MI9-PY5cyNs-unsplash.webp'
      }
    ]

    const user = users.find(u => u.id === tokenData.userId)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }
}