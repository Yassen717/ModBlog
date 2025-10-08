import { NextRequest, NextResponse } from 'next/server'

// Simple user store (in production, use a real database)
const users = [
  {
    id: '1',
    email: 'admin@modernblog.com',
    password: 'admin123', // In production, hash passwords
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format&q=80'
  },
  {
    id: '2',
    email: 'editor@modernblog.com',
    password: 'editor123',
    name: 'Editor User',
    role: 'editor',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b626e9d5?w=100&h=100&fit=crop&crop=face&auto=format&q=80'
  }
]

// POST /api/auth/login - Login endpoint
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // In production, use proper JWT or session management
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      }
    })

    // Set a simple session cookie (in production, use secure JWT)
    response.cookies.set('auth-token', JSON.stringify({ 
      userId: user.id, 
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}