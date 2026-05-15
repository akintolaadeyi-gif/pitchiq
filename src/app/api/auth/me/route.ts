import { NextRequest, NextResponse } from 'next/server'
import { verify } from '@/lib/jwt'
import { findById } from '@/lib/users'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('pitchiq_token')?.value
    if (!token) return NextResponse.json({ user: null })
    const payload = verify(token) as any
    const user = findById(payload.id)
    if (!user) return NextResponse.json({ user: null })
    return NextResponse.json({ user: { id: user.id, email: user.email, username: user.username } })
  } catch {
    return NextResponse.json({ user: null })
  }
}
