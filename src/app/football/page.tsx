'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const LEAGUES = [
  { id: 'PL',  name: 'Premier League',   flag: '🏴‍' },
  { id: 'PD',  name: 'La Liga',          flag: '🇪🇸' },
  { id: 'CL',  name: 'Champions League', flag: '⭐' },
  { id: 'BL1', name: 'Bundesliga',       flag: '🇩🇪' },
  { id: 'SA',  name: 'Serie A',          flag: '🇮🇹' },
]

const TABS = ['Results', 'Fixtures', 'Standings']

function Skeleton() {
  return (
    <div>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="skeleton" style={{ flex: 1, height: 12 }} />
          <div className="skeleton" style={{ width: 40, height: 16 }} />
          <div className="skeleton" style={{ flex: 1, height: 12 }} />
        </div>
      ))}
    </div>
  )
}

export default function FootballPage() {
  const [tab, setTab] = useState('Results')
  const [league, setLeague] = useState(LEAGUES[0])
  const [results, setResults] = useState<any[]>([])
  const [fixtures, setFixtures] = useState<any[]>([])
  const [standings, setStandings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const type = tab === 'Results' ? 'results' : tab === 'Fixtures' ? 'fixtures' : 'standings'
    fetch(`/api/football?league=${league.id}&type=${type}`)
      .then(r => r.json())
      .then(data => {
        if (tab === 'Results') setResults(data)
        else if (tab === 'Fixtures') setFixtures(data)
        else setStandings(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [league, tab])

  return (
    <div className="three-col">

      {/* LEFT SIDEBAR */}
      <aside className="sidebar-left" style={{ background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden', }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Competitions</div>
          {LEAGUES.map(l => (
            <button key={l.id} onClick={() => setLeague(l)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px', borderRadius: 6, width: '100%', border: 'none', cursor: 'pointer',
              background: league.id === l.id ? 'rgba(0,135,61,0.08)' : 'transparent',
              color: league.id === l.id ? '#00873d' : '#1a1a1a',
              fontWeight: league.id === l.id ? 700 : 500,
              transition: 'all 0.15s', textAlign: 'left',
            }}>
              <span style={{ fontSize: 14 }}>{l.flag}</span>
              <span style={{ fontSize: 13 }}>{l.name}</span>
            </button>
          ))}
        </div>
        <div style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Other Sports</div>
          {[
            { label: 'Basketball', href: '/basketball', icon: '🏀' },
            { label: 'Tennis', href: '/tennis', icon: '🎾' },
            { label: 'World Cup 2026', href: '/worldcup', icon: '🏆' },
          ].map(s => (
            <Link key={s.label} href={s.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: 6, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>
              <span>{s.icon}</span><span>{s.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* CENTER */}
      <main style={{ background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>{league.flag}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{league.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>2025/26 Season</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '12px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
              color: tab === t ? '#00873d' : '#888',
              borderBottom: tab === t ? '2px solid #00873d' : '2px solid transparent',
              transition: 'all 0.15s', marginBottom: -1,
            }}>{t}</button>
          ))}
        </div>

        {loading ? <Skeleton /> : (
          <>
            {tab === 'Results' && (
              <div>
                {results.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No recent results</div>}
                {results.map((m, i) => (
                  <motion.div key={m.idEvent} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', transition: 'background 0.1s', gap: 8 }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {m.homeLogo && <img src={m.homeLogo} width={20} height={20} style={{ objectFit: 'contain' }} alt="" />}
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{m.strHomeTeam}</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{m.intHomeScore} - {m.intAwayScore}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{m.dateEvent}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' }}>{m.strAwayTeam}</span>
                      {m.awayLogo && <img src={m.awayLogo} width={20} height={20} style={{ objectFit: 'contain' }} alt="" />}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === 'Fixtures' && (
              <div>
                {fixtures.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No upcoming fixtures</div>}
                {fixtures.map((m, i) => (
                  <motion.div key={m.idEvent} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', transition: 'background 0.1s', gap: 8 }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {m.homeLogo && <img src={m.homeLogo} width={20} height={20} style={{ objectFit: 'contain' }} alt="" />}
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{m.strHomeTeam}</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1a73e8' }}>{m.strTime || 'TBD'}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{m.dateEvent}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' }}>{m.strAwayTeam}</span>
                      {m.awayLogo && <img src={m.awayLogo} width={20} height={20} style={{ objectFit: 'contain' }} alt="" />}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === 'Standings' && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f0f0f0', background: 'var(--bg-base)' }}>
                    {['#', 'Club', 'P', 'W', 'D', 'L', 'GF', 'GA', 'Pts'].map((h, i) => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: i <= 1 ? 'left' : 'center', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {standings.map((t, i) => (
                    <motion.tr key={t.idStanding} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      style={{ borderBottom: '1px solid #f5f5f5', cursor: 'pointer', transition: 'background 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontWeight: 700, width: 36 }}>{t.intRank}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {t.strTeamBadge && <img src={t.strTeamBadge} width={18} height={18} style={{ objectFit: 'contain' }} alt="" />}
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.strTeam}</span>
                        </div>
                      </td>
                      {[t.intPlayed, t.intWin, t.intDraw, t.intLoss, t.intGoalsFor, t.intGoalsAgainst].map((v, j) => (
                        <td key={j} style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--text-muted)' }}>{v}</td>
                      ))}
                      <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: '#00873d' }}>{t.intPoints}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </main>

      {/* RIGHT PANEL */}
      <aside className="sidebar-right" style={{ display: 'flex', flexDirection: 'column', gap: 16, }}>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>This Week</div>
          </div>
          {[
            { label: 'PL Matchday 36', value: 'May 18', color: '#00873d' },
            { label: 'La Liga MD 35', value: 'May 17', color: '#e53935' },
            { label: 'UCL Final', value: 'May 31', color: '#1a73e8' },
            { label: 'NBA Playoffs', value: 'Ongoing', color: '#ff6b35' },
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
