'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('English (UK)')
  const [currency, setCurrency] = useState('USD')
  const [notifications, setNotifications] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
      // Load saved preferences
      const prefs = localStorage.getItem('pitchiq_prefs')
      if (prefs) {
        const p = JSON.parse(prefs)
        if (p.theme) setTheme(p.theme)
        if (p.language) setLanguage(p.language)
        if (p.currency) setCurrency(p.currency)
        if (p.notifications !== undefined) setNotifications(p.notifications)
      }
    })
  }, [])

  function savePrefs() {
    localStorage.setItem('pitchiq_prefs', JSON.stringify({ theme, language, currency, notifications })); window.dispatchEvent(new Event('pitchiq_theme_change'))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Loading...</div>

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', marginBottom: 24 }}>Settings</h1>

      {/* Account */}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '12px 16px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Account</span>
        </div>
        {user ? (
          <>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{user.user_metadata?.username || 'User'}</div>
                <div style={{ fontSize: 12, color: '#999' }}>{user.email}</div>
              </div>
              <div style={{ width: 36, height: 36, background: '#00873d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                {(user.user_metadata?.username || user.email || 'U')[0].toUpperCase()}
              </div>
            </div>
            <button onClick={handleLogout} style={{ width: '100%', padding: '13px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 13, color: '#e53935', fontWeight: 600 }}>
              Sign out
            </button>
          </>
        ) : (
          <div style={{ padding: '14px 16px', display: 'flex', gap: 12 }}>
            <Link href="/login" style={{ flex: 1, height: 38, background: '#00873d', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Sign in</Link>
            <Link href="/signup" style={{ flex: 1, height: 38, background: '#f5f5f5', color: '#1a1a1a', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Create account</Link>
          </div>
        )}
      </div>

      {/* Appearance */}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '12px 16px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Appearance</span>
        </div>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#1a1a1a' }}>Theme</span>
          <div style={{ display: 'flex', gap: 4, background: '#f5f5f5', borderRadius: 8, padding: 3 }}>
            {['light', 'dark'].map(t => (
              <button key={t} onClick={() => setTheme(t)} style={{ padding: '5px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: theme === t ? '#fff' : 'transparent', color: theme === t ? '#1a1a1a' : '#888', boxShadow: theme === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', textTransform: 'capitalize' }}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#1a1a1a' }}>Language</span>
          <select value={language} onChange={e => setLanguage(e.target.value)} style={{ border: '1px solid #e0e0e0', borderRadius: 6, padding: '5px 10px', fontSize: 13, outline: 'none', background: '#fff' }}>
            {['English (UK)', 'English (US)', 'French', 'Spanish', 'German', 'Portuguese'].map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Preferences */}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '12px 16px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Preferences</span>
        </div>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#1a1a1a' }}>Currency</span>
          <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ border: '1px solid #e0e0e0', borderRadius: 6, padding: '5px 10px', fontSize: 13, outline: 'none', background: '#fff' }}>
            {['USD', 'EUR', 'GBP', 'NGN', 'BRL'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#1a1a1a' }}>Match notifications</span>
          <button onClick={() => setNotifications(n => !n)} style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: notifications ? '#00873d' : '#e0e0e0', position: 'relative', transition: 'background 0.2s' }}>
            <div style={{ width: 18, height: 18, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, left: notifications ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
          </button>
        </div>
      </div>

      <button onClick={savePrefs} style={{ width: '100%', height: 44, background: '#00873d', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
        {saved ? '✓ Saved!' : 'Save preferences'}
      </button>
    </div>
  )
}
