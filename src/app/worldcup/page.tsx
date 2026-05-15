'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const STAGES = [
  { key: 'GROUP_STAGE', label: 'Group Stage' },
  { key: 'LAST_32', label: 'Round of 32' },
  { key: 'LAST_16', label: 'Round of 16' },
  { key: 'QUARTER_FINALS', label: 'Quarter Finals' },
  { key: 'SEMI_FINALS', label: 'Semi Finals' },
  { key: 'FINAL', label: 'Final' },
]

type Match = {
  id: number; utcDate: string; status: string; stage: string; group: string;
  homeTeam: { shortName: string; crest: string };
  awayTeam: { shortName: string; crest: string };
  score: { fullTime: { home: number | null; away: number | null } };
}

function Skeleton() {
  return (
    <div>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="skeleton" style={{ flex: 1, height: 12 }} />
          <div className="skeleton" style={{ width: 40, height: 16 }} />
          <div className="skeleton" style={{ flex: 1, height: 12 }} />
        </div>
      ))}
    </div>
  )
}

export default function WorldCupPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [stage, setStage] = useState('GROUP_STAGE')
  const [activeGroup, setActiveGroup] = useState('ALL')

  useEffect(() => {
    fetch('/api/football-data?path=' + encodeURIComponent('competitions/WC/matches?season=2026'))
      .then(r => r.json())
      .then(data => { setMatches(data.matches ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const stageMatches = matches.filter(m => m.stage === stage)
  const groups = stage === 'GROUP_STAGE'
    ? [...new Set(stageMatches.map(m => m.group))].filter(Boolean).sort()
    : []
  const filtered = stage === 'GROUP_STAGE' && activeGroup !== 'ALL'
    ? stageMatches.filter(m => m.group === activeGroup)
    : stageMatches

  return (
    <div className="three-col">

      {/* LEFT SIDEBAR */}
      <aside className="sidebar-left" style={{ background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden', }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Stages</div>
          {STAGES.map(s => (
            <button key={s.key} onClick={() => { setStage(s.key); setActiveGroup('ALL') }} style={{
              display: 'flex', alignItems: 'center', width: '100%', padding: '8px', borderRadius: 6,
              border: 'none', cursor: 'pointer', textAlign: 'left',
              background: stage === s.key ? 'rgba(0,135,61,0.08)' : 'transparent',
              color: stage === s.key ? '#00873d' : '#1a1a1a',
              fontWeight: stage === s.key ? 700 : 500, fontSize: 13, transition: 'all 0.15s',
            }}>{s.label}</button>
          ))}
        </div>
        <div style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Other Sports</div>
          {[
            { label: 'Football', href: '/football', icon: '⚽' },
            { label: 'Basketball', href: '/basketball', icon: '🏀' },
            { label: 'Tennis', href: '/tennis', icon: '🎾' },
          ].map(s => (
            <Link key={s.label} href={s.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 6, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>
              <span>{s.icon}</span><span>{s.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* CENTER */}
      <main style={{ background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="https://crests.football-data.org/wm26.png" alt="WC" style={{ width: 32, height: 32, objectFit: 'contain' }} onError={e => (e.currentTarget.style.display = 'none')} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>FIFA World Cup 2026</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Jun 11 – Jul 19, 2026 · USA, Canada & Mexico</div>
          </div>
        </div>

        {/* Group filter */}
        {stage === 'GROUP_STAGE' && groups.length > 0 && (
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['ALL', ...groups].map(g => (
              <button key={g} onClick={() => setActiveGroup(g)} style={{
                padding: '4px 12px', borderRadius: 20, border: '1px solid',
                borderColor: activeGroup === g ? '#00873d' : '#e0e0e0',
                background: activeGroup === g ? '#00873d' : '#fff',
                color: activeGroup === g ? '#fff' : '#555',
                fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              }}>{g === 'ALL' ? 'All Groups' : g.replace('GROUP_', 'Group ')}</button>
            ))}
          </div>
        )}

        {/* Matches */}
        {loading ? <Skeleton /> : filtered.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            No matches found for this stage yet.
          </div>
        ) : (
          filtered.map(m => {
            const date = new Date(m.utcDate)
            const isFinished = m.status === 'FINISHED'
            const isLive = ['IN_PLAY','PAUSED'].includes(m.status)
            return (
              <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 1fr', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', transition: 'background 0.1s', gap: 8 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {m.homeTeam?.crest && <img src={m.homeTeam.crest} width={20} height={20} style={{ objectFit: 'contain' }} alt="" />}
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{m.homeTeam?.shortName}</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  {isLive ? (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{m.score.fullTime.home} - {m.score.fullTime.away}</div>
                      <div style={{ fontSize: 10, color: '#e53935', fontWeight: 700 }}>LIVE</div>
                    </div>
                  ) : isFinished ? (
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{m.score.fullTime.home} - {m.score.fullTime.away}</div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1a73e8' }}>{date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                    </div>
                  )}
                  {m.group && <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>{m.group.replace('GROUP_', 'Grp ')}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' }}>{m.awayTeam?.shortName}</span>
                  {m.awayTeam?.crest && <img src={m.awayTeam.crest} width={20} height={20} style={{ objectFit: 'contain' }} alt="" />}
                </div>
              </div>
            )
          })
        )}
      </main>

      {/* RIGHT PANEL */}
      <aside className="sidebar-right" style={{ display: 'flex', flexDirection: 'column', gap: 16, }}>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Tournament Info</div>
          </div>
          {[
            { label: 'Host Nations', value: 'USA, CAN, MEX', color: '#1a73e8' },
            { label: 'Teams', value: '48 nations', color: '#00873d' },
            { label: 'Kick-off', value: 'Jun 11, 2026', color: '#e53935' },
            { label: 'Final', value: 'Jul 19, 2026', color: '#ff6b35' },
            { label: 'Groups', value: '12 groups', color: '#9333ea' },
          ].map(item => (
            <div key={item.label} style={{ padding: '10px 16px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#333' }}>{item.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Venues</div>
          </div>
          {['MetLife Stadium, NJ', 'SoFi Stadium, LA', 'AT&T Stadium, TX', 'Azteca Stadium, MEX', 'BC Place, CAN'].map(v => (
            <div key={v} style={{ padding: '9px 16px', borderBottom: '1px solid #f5f5f5', fontSize: 12, color: 'var(--text-secondary)' }}>📍 {v}</div>
          ))}
        </div>
      </aside>

    </div>
  )
}
