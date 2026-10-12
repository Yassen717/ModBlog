import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE, USERS, verifyAuthToken } from '@/lib/auth'

// GET /api/auth/me - Get current user info
export async function GET(request: NextRequest) {
  try {
    const payload = await verifyAuthToken(request.cookies.get(AUTH_COOKIE)?.value ?? '')

    if (!payload) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = USERS.find(u => u.id === payload.userId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      }
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }
}
