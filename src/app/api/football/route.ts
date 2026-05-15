import { NextRequest, NextResponse } from 'next/server'

const KEY = process.env.FOOTBALL_DATA_KEY!

const LEAGUE_MAP: Record<string, string> = {
  PL: 'Premier League',
  PD: 'La Liga',
  CL: 'Champions League',
  BL1: 'Bundesliga',
  SA: 'Serie A',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const league = searchParams.get('league') ?? 'PL'
  const type = searchParams.get('type') ?? 'results'

  if (!LEAGUE_MAP[league]) {
    return NextResponse.json({ error: 'Invalid league' }, { status: 400 })
  }

  const now = new Date()
  const fmt = (d: Date) => d.toISOString().split('T')[0]
  const from = new Date(now); from.setDate(now.getDate() - 14)
  const to = new Date(now); to.setDate(now.getDate() + 14)

  try {
    if (type === 'standings') {
      const res = await fetch(`https://api.football-data.org/v4/competitions/${league}/standings`, {
        headers: { 'X-Auth-Token': KEY },
        next: { revalidate: 300 },
      })
      const data = await res.json()
      const table = data.standings?.[0]?.table ?? []
      return NextResponse.json(table.map((t: any) => ({
        idStanding: String(t.position),
        intRank: String(t.position),
        strTeam: t.team?.shortName ?? t.team?.name ?? '',
        strTeamBadge: t.team?.crest ?? '',
        intPlayed: String(t.playedGames ?? 0),
        intWin: String(t.won ?? 0),
        intDraw: String(t.draw ?? 0),
        intLoss: String(t.lost ?? 0),
        intGoalsFor: String(t.goalsFor ?? 0),
        intGoalsAgainst: String(t.goalsAgainst ?? 0),
        intPoints: String(t.points ?? 0),
      })))
    }

    const status = type === 'results' ? 'FINISHED' : 'SCHEDULED,TIMED'
    const dateFrom = type === 'results' ? fmt(from) : fmt(now)
    const dateTo = type === 'results' ? fmt(now) : fmt(to)

    const res = await fetch(
      `https://api.football-data.org/v4/competitions/${league}/matches?status=${status}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
      { headers: { 'X-Auth-Token': KEY }, next: { revalidate: 120 } }
    )
    const data = await res.json()
    const matches = data.matches ?? []

    const mapped = matches.map((m: any) => {
      const date = m.utcDate ? new Date(m.utcDate) : null
      return {
        idEvent: String(m.id),
        strHomeTeam: m.homeTeam?.shortName ?? m.homeTeam?.name ?? '',
        strAwayTeam: m.awayTeam?.shortName ?? m.awayTeam?.name ?? '',
        intHomeScore: m.score?.fullTime?.home != null ? String(m.score.fullTime.home) : null,
        intAwayScore: m.score?.fullTime?.away != null ? String(m.score.fullTime.away) : null,
        dateEvent: date ? fmt(date) : '',
        strTime: date ? date.toTimeString().slice(0, 5) : '',
        strLeague: LEAGUE_MAP[league],
        strStatus: m.status ?? '',
        strVenue: m.venue ?? '',
        homeLogo: m.homeTeam?.crest ?? '',
        awayLogo: m.awayTeam?.crest ?? '',
      }
    })

    return NextResponse.json(type === 'results' ? mapped.slice(-10).reverse() : mapped.slice(0, 10))
  } catch (e) {
    return NextResponse.json([])
  }
}
