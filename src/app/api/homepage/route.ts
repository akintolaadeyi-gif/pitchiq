import { NextResponse } from 'next/server'

const FD_KEY = process.env.FOOTBALL_DATA_KEY!

function fmt(d: Date) { return d.toISOString().split('T')[0] }

async function fdMatches(code: string, leagueName: string, country: string) {
  try {
    const now = new Date()
    const from = new Date(now); from.setDate(now.getDate() - 4)
    const to = new Date(now); to.setDate(now.getDate() + 7)
    const res = await fetch(
      `https://api.football-data.org/v4/competitions/${code}/matches?dateFrom=${fmt(from)}&dateTo=${fmt(to)}`,
      { headers: { 'X-Auth-Token': FD_KEY }, next: { revalidate: 180 }, signal: AbortSignal.timeout(8000) }
    )
    if (!res.ok) return null
    const data = await res.json()
    if (!data.matches?.length) return null
    return { code, name: leagueName, country, matches: data.matches }
  } catch { return null }
}

function mapMatch(m: any) {
  const date = m.utcDate ? new Date(m.utcDate) : null
  const s = m.status ?? ''
  const isLive = ['IN_PLAY','PAUSED'].includes(s)
  const isFinished = s === 'FINISHED'
  return {
    id: m.id,
    homeTeam: m.homeTeam?.shortName ?? m.homeTeam?.name ?? '',
    awayTeam: m.awayTeam?.shortName ?? m.awayTeam?.name ?? '',
    homeLogo: m.homeTeam?.crest ?? '',
    awayLogo: m.awayTeam?.crest ?? '',
    homeScore: m.score?.fullTime?.home ?? null,
    awayScore: m.score?.fullTime?.away ?? null,
    date: date ? fmt(date) : '',
    time: date ? date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) : '',
    status: s,
    isLive,
    isFinished,
    elapsed: null,
  }
}

export async function GET() {
  const COMPS = [
    { code: 'PL',  name: 'Premier League',  country: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { code: 'ELC', name: 'Championship',    country: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { code: 'PD',  name: 'La Liga',         country: 'Spain 🇪🇸' },
    { code: 'BL1', name: 'Bundesliga',      country: 'Germany 🇩🇪' },
    { code: 'SA',  name: 'Serie A',         country: 'Italy 🇮🇹' },
    { code: 'FL1', name: 'Ligue 1',         country: 'France 🇫🇷' },
    { code: 'DED', name: 'Eredivisie',      country: 'Netherlands 🇳🇱' },
    { code: 'CL',  name: 'Champions League',country: 'Europe ⭐' },
    { code: 'BSA', name: 'Brasileirão',     country: 'Brazil 🇧🇷' },
  ]

  const results = await Promise.all(COMPS.map(c => fdMatches(c.code, c.name, c.country)))
  const leagues = results
    .filter(Boolean)
    .map(l => ({ ...l, matches: l!.matches.map(mapMatch) }))

  return NextResponse.json(
    { leagues },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
