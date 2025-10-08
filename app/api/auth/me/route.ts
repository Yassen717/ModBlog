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
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format&q=80'
      },
      {
        id: '2',
        email: 'editor@modernblog.com',
        name: 'Editor User',
        role: 'editor',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b626e9d5?w=100&h=100&fit=crop&crop=face&auto=format&q=80'
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