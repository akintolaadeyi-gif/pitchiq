import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({
    hasKey: !!process.env.FOOTBALL_DATA_KEY,
    keyPrefix: process.env.FOOTBALL_DATA_KEY?.slice(0, 5)
  })
}
