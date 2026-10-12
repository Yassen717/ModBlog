export const AUTH_COOKIE = 'auth-token'

export interface AuthPayload {
  userId: string
  role: 'admin' | 'editor'
  exp: number
}

export interface AuthUser {
  id: string
  email: string
  password: string
  name: string
  role: AuthPayload['role']
  avatar: string
}

// Simple user store (in production, use a real database)
export const USERS: AuthUser[] = [
  {
    id: '1',
    email: process.env.ADMIN_EMAIL ?? 'admin@modernblog.com',
    password: process.env.ADMIN_PASSWORD ?? 'admin123', // In production, hash passwords
    name: 'Admin User',
    role: 'admin',
    avatar: '/images/caspar-camille-rubin-0qvBNep1Y04-unsplash.webp'
  },
  {
    id: '2',
    email: process.env.EDITOR_EMAIL ?? 'editor@modernblog.com',
    password: process.env.EDITOR_PASSWORD ?? 'editor123',
    name: 'Editor User',
    role: 'editor',
    avatar: '/images/markus-spiske-MI9-PY5cyNs-unsplash.webp'
  }
]

const AUTH_SECRET = process.env.AUTH_SECRET ?? 'dev-only-secret-change-me'

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const bytes = Uint8Array.from(atob(padded), char => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

async function hmacSha256(data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(AUTH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return new Uint8Array(signature)
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

export async function signAuthToken(payload: AuthPayload): Promise<string> {
  const body = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)))
  const signature = toBase64Url(await hmacSha256(body))
  return `${body}.${signature}`
}

export async function verifyAuthToken(token: string): Promise<AuthPayload | null> {
  try {
    const [body, signature] = token.split('.')
    if (!body || !signature) return null

    const expected = toBase64Url(await hmacSha256(body))
    if (!timingSafeEqual(signature, expected)) return null

    const payload = JSON.parse(fromBase64Url(body)) as AuthPayload
    if (
      typeof payload.userId !== 'string' ||
      (payload.role !== 'admin' && payload.role !== 'editor') ||
      typeof payload.exp !== 'number' ||
      Date.now() > payload.exp
    ) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
