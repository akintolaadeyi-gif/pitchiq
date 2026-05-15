import { createHmac } from 'crypto'

const SECRET = process.env.JWT_SECRET
if (!SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production')
}
const KEY = SECRET || 'dev-only-secret-do-not-use-in-prod'

const TOKEN_TTL = 60 * 60 * 24 * 7 // 7 days in seconds

export function sign(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64url')
  const body = Buffer.from(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL,
  })).toString('base64url')
  const sig = createHmac('sha256', KEY).update(header + '.' + body).digest('base64url')
  return header + '.' + body + '.' + sig
}

export function verify(token: string): any {
  const [h, b, s] = token.split('.')
  if (!h || !b || !s) throw new Error('Invalid token format')
  const expected = createHmac('sha256', KEY).update(h + '.' + b).digest('base64url')
  if (s !== expected) throw new Error('Invalid token signature')
  const payload = JSON.parse(Buffer.from(b, 'base64url').toString())
  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
    throw new Error('Token expired')
  }
  return payload
}
