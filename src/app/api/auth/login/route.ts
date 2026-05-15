import { NextRequest, NextResponse } from 'next/server'
import { findByEmail, verifyPassword } from '@/lib/users'
import { sign } from '@/lib/jwt'
import { rateLimit } from '@/lib/rateLimit'
import { logSecurityEvent } from '@/lib/securityLog'

function getIP(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown'
}

export async function POST(req: NextRequest) {
  const ip = getIP(req)
  const limited = rateLimit(req, { max: 5, windowMs: 15 * 60 * 1000, key: 'login' })
  if (limited) {
    logSecurityEvent({ event: 'RATE_LIMIT_HIT', ip, path: '/api/auth/login', detail: 'Login brute force attempt' })
    return limited
  }

  try {
    const body = await req.json().catch(() => null)
    if (!body) {
      logSecurityEvent({ event: 'INVALID_INPUT', ip, path: '/api/auth/login', detail: 'Malformed request body' })
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { email, password } = body
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      logSecurityEvent({ event: 'INVALID_INPUT', ip, path: '/api/auth/login', detail: 'Missing or invalid fields' })
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    if (email.length > 254 || password.length > 128) {
      logSecurityEvent({ event: 'SUSPICIOUS_REQUEST', ip, path: '/api/auth/login', detail: 'Oversized input fields' })
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const user = findByEmail(email.trim().toLowerCase())
    const dummyHash = '$2a$12$invalidhashfortimingprotection000000000000000000000000'
    const valid = user
      ? await verifyPassword(user, password)
      : await import('bcryptjs').then(b => b.compare(password, dummyHash))

    if (!user || !valid) {
      logSecurityEvent({ event: 'FAILED_LOGIN', ip, path: '/api/auth/login', detail: `Failed attempt for: ${email.slice(0, 30)}` })
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

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
  } catch {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}
