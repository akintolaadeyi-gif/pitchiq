import { NextRequest } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'

const KEY = process.env.API_FOOTBALL_KEY!

const BASE_URLS: Record<string, string> = {
  football: 'https://v3.football.api-sports.io',
  basketball: 'https://v1.basketball.api-sports.io',
  tennis: 'https://v1.tennis.api-sports.io',
}

// Only allow specific paths
const ALLOWED_PATHS = [
  'fixtures', 'standings', 'games', 'leagues',
  'teams', 'players/squads',
]

export async function GET(request: NextRequest) {
  // Rate limit: 30 requests per minute per IP
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'anonymous'
  const limited = rateLimit(request, { max: 30, windowMs: 60 * 1000, key: 'sports' })
  if (limited) return limited
  if (!success) {
    return Response.json({ error: 'Too many requests.' }, { status: 429 })
  }

  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') ?? ''
  const params = searchParams.get('params') ?? ''
  const sport = searchParams.get('sport') ?? 'football'

  // Validate sport
  if (!BASE_URLS[sport]) {
    return Response.json({ error: 'Invalid sport.' }, { status: 400 })
  }

  // Validate path — only allow whitelisted endpoints
  if (!ALLOWED_PATHS.includes(path)) {
    return Response.json({ error: 'Invalid path.' }, { status: 400 })
  }

  // Validate params — no injections
  if (params.length > 200 || /[<>"{}|\\^`]/.test(params)) {
    return Response.json({ error: 'Invalid parameters.' }, { status: 400 })
  }

  const base = BASE_URLS[sport]
  const url = `${base}/${path}?${params}`

  const res = await fetch(url, {
    headers: { 'x-apisports-key': KEY },
  })
  const data = await res.json()
  return Response.json(data)
}
