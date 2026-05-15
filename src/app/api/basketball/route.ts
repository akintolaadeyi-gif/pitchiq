import { NextRequest, NextResponse } from 'next/server'

const KEY = process.env.API_FOOTBALL_KEY!

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const today = new Date().toISOString().split('T')[0]

  try {
    const res = await fetch(
      `https://v1.basketball.api-sports.io/games?date=${today}`,
      {
        headers: { 'x-apisports-key': KEY },
        next: { revalidate: 120 },
        signal: AbortSignal.timeout(8000),
      }
    )
    if (!res.ok) return NextResponse.json({ data: [] })
    const data = await res.json()

    const mapped = (data.response ?? []).map((g: any) => ({
      id: g.id,
      date: g.date,
      status: g.status?.long ?? 'Final',
      home_team_score: g.scores?.home?.total ?? 0,
      visitor_team_score: g.scores?.away?.total ?? 0,
      home_team: { full_name: g.teams?.home?.name ?? '', abbreviation: g.teams?.home?.code ?? '' },
      visitor_team: { full_name: g.teams?.away?.name ?? '', abbreviation: g.teams?.away?.code ?? '' },
      league: g.league?.name ?? '',
      country: g.country?.name ?? '',
    }))

    return NextResponse.json({ data: mapped }, {
      headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' }
    })
  } catch {
    return NextResponse.json({ data: [] })
  }
}
