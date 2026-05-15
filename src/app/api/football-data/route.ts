import { NextRequest, NextResponse } from 'next/server'

const KEY = process.env.FOOTBALL_DATA_KEY!

const ALLOWED = [
  'competitions/PL/matches',
  'competitions/PD/matches',
  'competitions/CL/matches',
  'competitions/PL/standings',
  'competitions/PD/standings',
  'competitions/CL/standings',
  'competitions/WC/matches',
  'competitions/WC/standings',
  'competitions/WC/groups',
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = decodeURIComponent(searchParams.get('path') ?? '')

  const base = path.split('?')[0]
  if (!ALLOWED.some(a => base.startsWith(a))) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  const url = 'https://api.football-data.org/v4/' + path

  const res = await fetch(url, {
    headers: { 'X-Auth-Token': KEY },
    next: { revalidate: 300 },
  })

  const data = await res.json()

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
