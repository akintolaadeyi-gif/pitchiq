import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.FOOTBALL_DATA_KEY
  
  try {
    const res = await fetch(
      'https://api.football-data.org/v4/competitions/PL/matches?dateFrom=2026-05-15&dateTo=2026-05-20',
      { headers: { 'X-Auth-Token': key ?? '' } }
    )
    const data = await res.json()
    return NextResponse.json({ 
      hasKey: !!key, 
      status: res.status, 
      matchCount: data.matches?.length ?? 0,
      error: data.error ?? null
    })
  } catch (e: any) {
    return NextResponse.json({ hasKey: !!key, fetchError: e.message })
  }
}
