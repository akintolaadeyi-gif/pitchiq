import { NextRequest, NextResponse } from 'next/server'

const attempts = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(req: NextRequest, options: {
  max: number
  windowMs: number
  key?: string
}): NextResponse | null {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown'
  const key = options.key ? `${ip}:${options.key}` : ip
  const now = Date.now()
  const record = attempts.get(key)

  if (!record || now > record.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + options.windowMs })
    return null
  }

  record.count++
  if (record.count > options.max) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000)
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': options.max.toString(),
          'X-RateLimit-Remaining': '0',
        }
      }
    )
  }
  return null
}

// Clean up stale entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of attempts.entries()) {
    if (now > record.resetAt) attempts.delete(key)
  }
}, 10 * 60 * 1000)
