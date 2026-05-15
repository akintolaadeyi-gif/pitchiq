import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { rateLimit } from '@/lib/rateLimit'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const FD_KEY = process.env.FOOTBALL_DATA_KEY!
const API_SPORTS_KEY = process.env.API_FOOTBALL_KEY!

async function fetchPLMatches() {
  try {
    const now = new Date()
    const from = new Date(now); from.setDate(now.getDate() - 7)
    const to = new Date(now); to.setDate(now.getDate() + 7)
    const fmt = (d: Date) => d.toISOString().split('T')[0]
    const res = await fetch(
      `https://api.football-data.org/v4/competitions/PL/matches?dateFrom=${fmt(from)}&dateTo=${fmt(to)}`,
      { headers: { 'X-Auth-Token': FD_KEY }, signal: AbortSignal.timeout(5000) }
    )
    const data = await res.json()
    return (data.matches ?? []).slice(0, 10).map((m: any) => {
      const finished = m.status === 'FINISHED'
      return `${m.homeTeam?.shortName} vs ${m.awayTeam?.shortName}: ${finished ? m.score?.fullTime?.home + '-' + m.score?.fullTime?.away + ' FT' : m.status + ' ' + m.utcDate?.split('T')[0]}`
    }).join('\n')
  } catch { return '' }
}

async function fetchPLStandings() {
  try {
    const res = await fetch('https://api.football-data.org/v4/competitions/PL/standings',
      { headers: { 'X-Auth-Token': FD_KEY }, signal: AbortSignal.timeout(5000) }
    )
    const data = await res.json()
    return (data.standings?.[0]?.table ?? []).slice(0, 8).map((t: any) =>
      `${t.position}. ${t.team?.shortName}: ${t.points}pts, ${t.won}W ${t.draw}D ${t.lost}L, GD${t.goalDifference}`
    ).join('\n')
  } catch { return '' }
}

async function fetchNBA() {
  try {
    const now = new Date()
    const from = new Date(now); from.setDate(now.getDate() - 7)
    const fmt = (d: Date) => d.toISOString().split('T')[0]
    const res = await fetch(
      `https://v1.basketball.api-sports.io/games?league=12&season=2024-2025&date=${fmt(now)}`,
      { headers: { 'x-apisports-key': API_SPORTS_KEY }, signal: AbortSignal.timeout(5000) }
    )
    const data = await res.json()
    if (data.response?.length) {
      return (data.response ?? []).slice(0, 8).map((g: any) =>
        `${g.teams?.home?.name} ${g.scores?.home?.total ?? '?'} - ${g.scores?.away?.total ?? '?'} ${g.teams?.away?.name} (${g.status?.long ?? g.status?.short})`
      ).join('\n')
    }
    // fallback: recent games
    const res2 = await fetch(
      `https://v1.basketball.api-sports.io/games?league=12&season=2024-2025&from=${fmt(from)}&to=${fmt(now)}`,
      { headers: { 'x-apisports-key': API_SPORTS_KEY }, signal: AbortSignal.timeout(5000) }
    )
    const data2 = await res2.json()
    return (data2.response ?? []).slice(0, 8).map((g: any) =>
      `${g.teams?.home?.name} ${g.scores?.home?.total ?? '?'} - ${g.scores?.away?.total ?? '?'} ${g.teams?.away?.name} (${g.status?.long ?? g.status?.short})`
    ).join('\n')
  } catch { return '' }
}

async function fetchLaLiga() {
  try {
    const now = new Date()
    const from = new Date(now); from.setDate(now.getDate() - 7)
    const to = new Date(now); to.setDate(now.getDate() + 7)
    const fmt = (d: Date) => d.toISOString().split('T')[0]
    const res = await fetch(
      `https://api.football-data.org/v4/competitions/PD/matches?dateFrom=${fmt(from)}&dateTo=${fmt(to)}`,
      { headers: { 'X-Auth-Token': FD_KEY }, signal: AbortSignal.timeout(5000) }
    )
    const data = await res.json()
    return (data.matches ?? []).slice(0, 8).map((m: any) => {
      const finished = m.status === 'FINISHED'
      return `${m.homeTeam?.shortName} vs ${m.awayTeam?.shortName}: ${finished ? m.score?.fullTime?.home + '-' + m.score?.fullTime?.away + ' FT' : m.status + ' ' + m.utcDate?.split('T')[0]}`
    }).join('\n')
  } catch { return '' }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const limited = rateLimit(request, { max: 10, windowMs: 60 * 1000, key: 'ai' })
  if (limited) return limited

  let body: any
  try { body = await request.json() } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }) }

  const { messages, context } = body
  if (!Array.isArray(messages) || messages.length === 0) return Response.json({ error: 'Invalid messages.' }, { status: 400 })

  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() ?? ''
  const wantsNBA = /nba|basketball|playoff|lakers|celtics|warriors|nuggets|heat|knicks|pacers|thunder|wolves|timberwolves|mavs|clippers|suns|bucks|performer|scorer/i.test(lastMsg)
  const wantsLaLiga = /la liga|laliga|spain|real madrid|barcelona|atletico|sevilla|valencia/i.test(lastMsg)
  const wantsStandings = /standing|table|top|rank|position|points|league|who.s (first|leading|winning)/i.test(lastMsg)

  const [plMatches, plStandings, nbaGames, laLigaMatches] = await Promise.all([
    fetchPLMatches(),
    wantsStandings ? fetchPLStandings() : Promise.resolve(''),
    wantsNBA ? fetchNBA() : Promise.resolve(''),
    wantsLaLiga ? fetchLaLiga() : Promise.resolve(''),
  ])

  const sections = [
    plMatches ? `PREMIER LEAGUE (recent/upcoming):\n${plMatches}` : '',
    plStandings ? `PREMIER LEAGUE STANDINGS:\n${plStandings}` : '',
    nbaGames ? `NBA PLAYOFFS (recent):\n${nbaGames}` : '',
    laLigaMatches ? `LA LIGA (recent/upcoming):\n${laLigaMatches}` : '',
  ].filter(Boolean)

  const liveData = sections.join('\n\n')

  const systemPrompt = `You are PitchIQ's AI sports analyst. You have REAL live data fetched right now:

${liveData ? `=== LIVE DATA ===\n${liveData}\n=== END ===` : 'No live data fetched for this query.'}

Today's date: ${new Date().toDateString()}
${context ? `User is on: ${context}` : ''}

Instructions:
- Use the live data to give specific answers with real scores, teams, results
- For NBA questions: if no live data loaded, use your training knowledge about the 2024-25 NBA playoffs and name real players/teams/stats
- Keep answers to 3-5 sentences, be specific and confident
- Never say you lack access — give the best answer with available data`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 512,
    system: systemPrompt,
    messages: messages.slice(-10).map((m: any) => ({
      role: m.role,
      content: String(m.content).slice(0, 2000),
    })),
  })

  const text = (response.content.find((b: any) => b.type === 'text') as any)?.text ?? ''
  return Response.json({ reply: text })
}
