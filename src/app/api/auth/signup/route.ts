import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/users'
import { sign } from '@/lib/jwt'
import { rateLimit } from '@/lib/rateLimit'
import { logSecurityEvent } from '@/lib/securityLog'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/

function getIP(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown'
}

export async function POST(req: NextRequest) {
  const ip = getIP(req)
  const limited = rateLimit(req, { max: 3, windowMs: 60 * 60 * 1000, key: 'signup' })
  if (limited) {
    logSecurityEvent({ event: 'SIGNUP_SPAM', ip, path: '/api/auth/signup', detail: 'Signup rate limit hit' })
    return limited
  }

  try {
    const body = await req.json().catch(() => null)
    if (!body) {
      logSecurityEvent({ event: 'INVALID_INPUT', ip, path: '/api/auth/signup', detail: 'Malformed request body' })
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { email, password, username } = body

    if (!email || !password || !username ||
        typeof email !== 'string' || typeof password !== 'string' || typeof username !== 'string') {
      logSecurityEvent({ event: 'INVALID_INPUT', ip, path: '/api/auth/signup', detail: 'Missing or invalid fields' })
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (!EMAIL_REGEX.test(email) || email.length > 254) {
      logSecurityEvent({ event: 'INVALID_INPUT', ip, path: '/api/auth/signup', detail: `Bad email format: ${email.slice(0, 30)}` })
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (password.length < 8)
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })

    if (password.length > 128) {
      logSecurityEvent({ event: 'SUSPICIOUS_REQUEST', ip, path: '/api/auth/signup', detail: 'Oversized password' })
      return NextResponse.json({ error: 'Password too long' }, { status: 400 })
    }

    if (username.length < 3 || username.length > 30 || !USERNAME_REGEX.test(username))
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 })

    const user = await createUser(email, password, username)
    const token = sign({ id: user.id, email: user.email, username: user.username })
    const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email, username: user.username } })
    res.cookies.set('pitchiq_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'strict',
    })
    return res
  } catch (e: any) {
    const safeErrors = ['Email already registered', 'Username already taken']
    const msg = e.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
