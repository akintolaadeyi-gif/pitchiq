'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const NAV = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/football', label: 'Football', icon: '⚽' },
  { href: '/basketball', label: 'Basketball', icon: '🏀' },
  { href: '/tennis', label: 'Tennis', icon: '🎾' },
  { href: '/worldcup', label: 'WC26', icon: '🏆' },
]

const SEARCH_INDEX = [
  { name: 'Premier League', href: '/football', flag: '🏴' },
  { name: 'La Liga', href: '/football', flag: '🇪🇸' },
  { name: 'Champions League', href: '/football', flag: '⭐' },
  { name: 'Bundesliga', href: '/football', flag: '🇩🇪' },
  { name: 'Serie A', href: '/football', flag: '🇮🇹' },
  { name: 'Ligue 1', href: '/football', flag: '🇫🇷' },
  { name: 'Eredivisie', href: '/football', flag: '🇳🇱' },
  { name: 'Championship', href: '/football', flag: '🏴' },
  { name: 'NBA', href: '/basketball', flag: '🏀' },
  { name: 'NBA Playoffs', href: '/basketball', flag: '🏀' },
  { name: 'Roland Garros', href: '/tennis', flag: '🎾' },
  { name: 'Wimbledon', href: '/tennis', flag: '🎾' },
  { name: 'ATP Rankings', href: '/tennis', flag: '🎾' },
  { name: 'World Cup 2026', href: '/worldcup', flag: '🌍' },
  { name: 'Arsenal', href: '/football', flag: '⚽' },
  { name: 'Chelsea', href: '/football', flag: '⚽' },
  { name: 'Liverpool', href: '/football', flag: '⚽' },
  { name: 'Manchester City', href: '/football', flag: '⚽' },
  { name: 'Real Madrid', href: '/football', flag: '⚽' },
  { name: 'Barcelona', href: '/football', flag: '⚽' },
]

export default function Navbar() {
  const path = usePathname()
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => setUser(d.user))
  }, [])

  const results = search.length >= 2
    ? SEARCH_INDEX.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : []

  return (
    <>
      {/* Top navbar */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
        height: 56, display: 'flex', alignItems: 'center',
      }}>
        <div style={{ maxWidth: 1800, margin: '0 auto', width: '100%', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 16 }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, background: '#00873d', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 14 }}>P</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>PitchIQ</span>
          </Link>

          {/* Search */}
          <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
              placeholder="Search teams, leagues..."
              style={{
                width: '100%', height: 34, padding: '0 12px 0 34px',
                border: `1px solid ${focused ? '#00873d' : 'var(--border)'}`,
                borderRadius: 20, background: focused ? 'var(--bg-surface)' : 'var(--bg-base)',
                fontSize: 13, color: 'var(--text-primary)', outline: 'none',
              }}
            />
            <svg style={{ position: 'absolute', left: 10, top: 9, color: 'var(--text-muted)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            {focused && results.length > 0 && (
              <div style={{ position: 'absolute', top: 40, left: 0, width: '100%', minWidth: 260, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 300, overflow: 'hidden' }}>
                {results.map(r => (
                  <Link key={r.name} href={r.href} onClick={() => { setSearch(''); setFocused(false) }}
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 13, fontWeight: 500, borderBottom: '1px solid var(--border)', background: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-base)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: 16 }}>{r.flag}</span>
                    <span>{r.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop nav */}
          <nav className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            {NAV.map(n => {
              const active = n.href === '/' ? path === '/' : path.startsWith(n.href)
              return (
                <Link key={n.href} href={n.href} style={{
                  textDecoration: 'none', padding: '6px 10px', borderRadius: 6,
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  color: active ? '#00873d' : 'var(--text-secondary)',
                  background: active ? 'rgba(0,135,61,0.08)' : 'transparent',
                  whiteSpace: 'nowrap',
                }}>{n.label}</Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div className="live-dot" />
              <span className="hide-mobile" style={{ fontSize: 11, fontWeight: 700, color: '#e53935', letterSpacing: '0.04em' }}>LIVE</span>
            </div>
            {user ? (
              <Link href="/settings" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 30, height: 30, background: '#00873d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                  {(user.username || user.email || 'U')[0].toUpperCase()}
                </div>
                <span className="hide-mobile" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.username}</span>
              </Link>
            ) : (
              <div style={{ display: 'flex', gap: 6 }}>
                <Link href="/login" className="hide-mobile" style={{ textDecoration: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>Sign in</Link>
                <Link href="/signup" style={{ textDecoration: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, color: '#fff', background: '#00873d', whiteSpace: 'nowrap' }}>Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        {NAV.map(n => {
          const active = n.href === '/' ? path === '/' : path.startsWith(n.href)
          return (
            <Link key={n.href} href={n.href} style={{
              flex: 1, textDecoration: 'none', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 2, padding: '4px 0',
              color: active ? '#00873d' : 'var(--text-muted)',
            }}>
              <span style={{ fontSize: 18 }}>{n.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.02em' }}>{n.label}</span>
            </Link>
          )
        })}
        {user ? (
          <Link href="/settings" style={{ flex: 1, textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '4px 0', color: 'var(--text-muted)' }}>
            <div style={{ width: 22, height: 22, background: '#00873d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 11 }}>
              {(user.username || 'U')[0].toUpperCase()}
            </div>
            <span style={{ fontSize: 9, fontWeight: 600 }}>Profile</span>
          </Link>
        ) : (
          <Link href="/login" style={{ flex: 1, textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '4px 0', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: 18 }}>👤</span>
            <span style={{ fontSize: 9, fontWeight: 600 }}>Sign in</span>
          </Link>
        )}
      </nav>
    </>
  )
}
