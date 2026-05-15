'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: any) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false) }
      else { window.location.href = '/' }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e8e8', padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 32, height: 32, background: '#00873d', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>P</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#1a1a1a' }}>PitchIQ</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', marginBottom: 6 }}>Sign in</h1>
        <p style={{ fontSize: 13, color: '#999', marginBottom: 28 }}>Welcome back to PitchIQ</p>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="you@example.com"
              style={{ width: '100%', height: 42, padding: '0 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#1a1a1a', background: '#fff' }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" required placeholder="••••••••"
              style={{ width: '100%', height: 42, padding: '0 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#1a1a1a', background: '#fff' }} />
          </div>
          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <Link href="/reset-password" style={{ fontSize: 12, color: '#00873d', textDecoration: 'none' }}>Forgot password?</Link>
          </div>
          {error && <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#e53935', marginBottom: 16 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', height: 44, background: '#00873d', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 13, color: '#999', marginTop: 24 }}>
          Don't have an account? <Link href="/signup" style={{ color: '#00873d', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}
