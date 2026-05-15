'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Match {
  id: number; homeTeam: string; awayTeam: string
  homeLogo: string; awayLogo: string
  homeScore: number | null; awayScore: number | null
  date: string; time: string; status: string
  isLive: boolean; isFinished: boolean
}

interface League {
  code: string; name: string; country: string; matches: Match[]
}

const SIDEBAR_LEAGUES = [
  { label: 'Premier League',   flag: '🏴‍', href: '/football' },
  { label: 'Champions League', flag: '⭐',        href: '/football' },
  { label: 'La Liga',          flag: '🇪🇸',       href: '/football' },
  { label: 'Bundesliga',       flag: '🇩🇪',       href: '/football' },
  { label: 'Serie A',          flag: '🇮🇹',       href: '/football' },
  { label: 'Ligue 1',          flag: '🇫🇷',       href: '/football' },
  { label: 'Eredivisie',       flag: '🇳🇱',       href: '/football' },
  { label: 'Championship',     flag: '🏴‍',  href: '/football' },
  { label: 'Brasileirão',      flag: '🇧🇷',       href: '/football' },
  { label: 'NBA',              flag: '🏀',        href: '/basketball' },
  { label: 'Roland Garros',    flag: '🎾',        href: '/tennis' },
  { label: 'World Cup 2026',   flag: '��',        href: '/worldcup' },
]

const FILTERS = ['All', 'Live', 'Upcoming', 'Finished']

function MatchRow({ m }: { m: Match }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', alignItems: 'center', padding: '9px 16px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', transition: 'background 0.1s', gap: 8 }}
      onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {m.homeLogo && <img src={m.homeLogo} width={18} height={18} style={{ objectFit: 'contain', flexShrink: 0 }} alt="" />}
        <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.homeTeam}</span>
      </div>
      <div style={{ textAlign: 'center' }}>
        {m.isLive ? (
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>{m.homeScore} - {m.awayScore}</div>
            <div style={{ fontSize: 10, color: '#e53935', fontWeight: 700 }}>LIVE</div>
          </div>
        ) : m.isFinished ? (
          <div style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>{m.homeScore} - {m.awayScore}</div>
        ) : (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1a73e8' }}>{m.time}</div>
            <div style={{ fontSize: 10, color: '#bbb' }}>{m.date}</div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{m.awayTeam}</span>
        {m.awayLogo && <img src={m.awayLogo} width={18} height={18} style={{ objectFit: 'contain', flexShrink: 0 }} alt="" />}
      </div>
    </div>
  )
}

function LeagueBlock({ league, filter }: { league: League; filter: string }) {
  const [open, setOpen] = useState(true)
  const filtered = league.matches.filter(m => {
    if (filter === 'Live') return m.isLive
    if (filter === 'Finished') return m.isFinished
    if (filter === 'Upcoming') return !m.isLive && !m.isFinished
    return true
  })
  if (filtered.length === 0) return null
  return (
    <div>
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: '#f7f7f7', borderBottom: '1px solid #eeeeee', borderTop: '1px solid #eeeeee', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#222' }}>{league.name}</span>
          <span style={{ fontSize: 11, color: '#999' }}>{league.country}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#bbb' }}>{filtered.length} matches</span>
          <span style={{ fontSize: 10, color: '#bbb' }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>
      {open && filtered.map(m => <MatchRow key={m.id} m={m} />)}
    </div>
  )
}

function Skeleton() {
  return (
    <div>
      {[...Array(3)].map((_, li) => (
        <div key={li}>
          <div style={{ padding: '8px 16px', background: '#f7f7f7', borderBottom: '1px solid #eee' }}>
            <div className="skeleton" style={{ height: 12, width: 140 }} />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ padding: '11px 16px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="skeleton" style={{ flex: 1, height: 11 }} />
              <div className="skeleton" style={{ width: 36, height: 16 }} />
              <div className="skeleton" style={{ flex: 1, height: 11 }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function HomeClient() {
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetch('/api/homepage')
      .then(r => r.json())
      .then(d => { setLeagues(d.leagues ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="three-col">

      {/* LEFT SIDEBAR */}
      <aside className="sidebar-left" style={{ background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8', position: 'sticky', top: 72, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#999', marginBottom: 10 }}>Top Leagues</div>
          {SIDEBAR_LEAGUES.map(l => (
            <Link key={l.label} href={l.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 6, color: '#1a1a1a', transition: 'background 0.1s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: 14, flexShrink: 0 }}>{l.flag}</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{l.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* CENTER FEED */}
      <main style={{ background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8', overflow: 'hidden' }}>
        {/* Date bar */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>Today</span>
          <span style={{ fontSize: 12, color: '#999' }}>{today}</span>
        </div>
        {/* Filter pills */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 6 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 14px', borderRadius: 20,
              border: `1px solid ${filter === f ? '#00873d' : '#e0e0e0'}`,
              background: filter === f ? '#00873d' : '#fff',
              color: filter === f ? '#fff' : '#555',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
            }}>{f}</button>
          ))}
        </div>

        {/* League sections */}
        {loading ? <Skeleton /> : leagues.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#999', fontSize: 13 }}>No matches found</div>
        ) : (
          leagues.map(l => <LeagueBlock key={l.code} league={l} filter={filter} />)
        )}
      </main>

      {/* RIGHT PANEL */}
      <aside className="sidebar-right" style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 72 }}>
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#999' }}>Quick Access</div>
          </div>
          {[
            { label: 'PL Standings', sub: 'Premier League table', href: '/football' },
            { label: 'La Liga Standings', sub: 'Spanish top flight', href: '/football' },
            { label: 'NBA Results', sub: 'Latest scores', href: '/basketball' },
            { label: 'Roland Garros', sub: 'French Open 2026', href: '/tennis' },
            { label: 'WC 2026 Groups', sub: 'Group stage draw', href: '/worldcup' },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none', display: 'block', padding: '10px 16px', borderBottom: '1px solid #f5f5f5', transition: 'background 0.1s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{item.label}</div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 1 }}>{item.sub}</div>
            </Link>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#999' }}>Upcoming</div>
          </div>
          {[
            { label: 'PL Matchday 36', value: 'May 18', color: '#00873d' },
            { label: 'La Liga MD 35', value: 'May 17', color: '#e53935' },
            { label: 'UCL Final', value: 'May 31', color: '#1a73e8' },
            { label: 'NBA Playoffs', value: 'Ongoing', color: '#ff6b35' },
            { label: 'Roland Garros', value: 'R2', color: '#c0392b' },
          ].map(item => (
            <div key={item.label} style={{ padding: '10px 16px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#333' }}>{item.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
      </aside>

    </div>
  )
}
