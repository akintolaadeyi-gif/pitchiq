'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleReset(e: any) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/update-password',
    })
    if (error) { setError(error.message); setLoading(false) }
    else setSent(true)
  }

  if (sent) return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e8e8', padding: '40px 36px', width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Check your email</h2>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>We sent a password reset link to <strong>{email}</strong></p>
        <Link href="/login" style={{ color: '#00873d', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Back to sign in</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e8e8', padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 32, height: 32, background: '#00873d', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>P</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#1a1a1a' }}>PitchIQ</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', marginBottom: 6 }}>Reset password</h1>
        <p style={{ fontSize: 13, color: '#999', marginBottom: 28 }}>Enter your email and we'll send a reset link</p>
        <form onSubmit={handleReset}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="you@example.com"
              style={{ width: '100%', height: 42, padding: '0 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#1a1a1a', backgroundColor: '#fff' }} />
          </div>
          {error && <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#e53935', marginBottom: 16 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', height: 44, background: '#00873d', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 13, color: '#999', marginTop: 24 }}>
          <Link href="/login" style={{ color: '#00873d', fontWeight: 600, textDecoration: 'none' }}>Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}
