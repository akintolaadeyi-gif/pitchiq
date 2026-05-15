'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleUpdate(e: any) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e8e8', padding: '40px 36px', width: '100%', maxWidth: 400 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Set new password</h1>
        <form onSubmit={handleUpdate}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>New Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" required
              style={{ width: '100%', height: 42, padding: '0 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Confirm Password</label>
            <input value={confirm} onChange={e => setConfirm(e.target.value)} type="password" required
              style={{ width: '100%', height: 42, padding: '0 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {error && <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#e53935', marginBottom: 16 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', height: 44, background: '#00873d', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
