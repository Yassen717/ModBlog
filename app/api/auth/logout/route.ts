import { NextResponse } from 'next/server'

// POST /api/auth/logout - Logout endpoint
export async function POST() {
  try {
    const response = NextResponse.json({
      message: 'Logout successful'
    })

    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire the cookie immediately
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}