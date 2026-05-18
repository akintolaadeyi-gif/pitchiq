import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.FOOTBALL_DATA_KEY
  const now = new Date()
  const from = new Date(now); from.setDate(now.getDate() - 4)
  const to = new Date(now); to.setDate(now.getDate() + 7)
  const dateFrom = from.toISOString().split('T')[0]
  const dateTo = to.toISOString().split('T')[0]
  
  const url = `https://api.football-data.org/v4/competitions/PL/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`
  
  const res = await fetch(url, { headers: { 'X-Auth-Token': key ?? '' } })
  const data = await res.json()
  
  return NextResponse.json({ 
    url,
    status: res.status,
    message: data.message ?? null,
    matchCount: data.matches?.length ?? 0
  })
}
