'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

function fmt(d: Date) { return d.toISOString().split('T')[0]; }

export default function BasketballPage() {
  const [tab, setTab] = useState('Results');
  const [section, setSection] = useState('playoffs');
  const [results, setResults] = useState<any[]>([]);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const now = new Date();
    const playoffStart = '2025-04-19';
    const playoffEnd = '2025-06-30';
    const query = 'per_page=15&seasons[]=2024&postseason=true&start_date=' + playoffStart + '&end_date=' + playoffEnd;
    fetch('/api/basketball')
      .then(r => r.json())
      .then(data => {
        const games = (data.data ?? []).map((g: any) => ({
          id: String(g.id),
          homeTeam: g.home_team?.full_name ?? '',
          awayTeam: g.visitor_team?.full_name ?? '',
          homeScore: g.home_team_score > 0 ? g.home_team_score : null,
          awayScore: g.visitor_team_score > 0 ? g.visitor_team_score : null,
          date: g.date ? g.date.split('T')[0] : '',
          time: g.status && g.status.includes('T') ? new Date(g.status).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (g.status ?? 'TBD'),
          status: g.status ?? '',
        }));
        const finished = games.filter((g:any) => g.homeScore !== null).reverse();
        const ongoing = games.filter((g:any) => g.homeScore === null);
        setResults(finished);
        setFixtures(ongoing.length > 0 ? ongoing : finished.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tab]);

  const matches = tab === 'Results' ? results : fixtures;

  return (
    <div className="three-col">

      {/* LEFT SIDEBAR */}
      <aside className="sidebar-left" style={{ background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden', }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Basketball</div>
          {[
            { label: 'NBA Playoffs', flag: '🏀', key: 'playoffs' },
            { label: 'NBA Finals', flag: '🏆', key: 'finals' },
            { label: 'NBA Standings', flag: '📊', key: 'standings' },
          ].map(l => (
            <button key={l.key} onClick={() => setSection(l.key)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px',
              borderRadius: 6, width: '100%', border: 'none', cursor: 'pointer',
              textAlign: 'left',
              background: section === l.key ? 'rgba(255,107,53,0.08)' : 'transparent',
              color: section === l.key ? '#ff6b35' : '#1a1a1a',
              fontWeight: section === l.key ? 700 : 500,
            }}>
              <span style={{ fontSize: 14 }}>{l.flag}</span>
              <span style={{ fontSize: 13 }}>{l.label}</span>
            </button>
          ))}
        </div>
        <div style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Other Sports</div>
          {[
            { label: 'Football', href: '/football', icon: '⚽' },
            { label: 'Tennis', href: '/tennis', icon: '🎾' },
            { label: 'World Cup 2026', href: '/worldcup', icon: '🏆' },
          ].map(s => (
            <Link key={s.label} href={s.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 6, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>
              <span>{s.icon}</span><span>{s.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* CENTER */}
      <main style={{ background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>🏀</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>NBA Playoffs 2026</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>NBA Playoffs 2025 · Finals: Jun 5</div>
          </div>
        </div>

        {/* Tabs — only show for playoffs */}
        {section !== 'standings' && (
          <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
            {['Results', 'Latest'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '12px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: 13, fontWeight: 600,
                color: tab === t ? '#ff6b35' : '#888',
                borderBottom: tab === t ? '2px solid #ff6b35' : '2px solid transparent',
                transition: 'all 0.15s', marginBottom: -1,
              }}>{t}</button>
            ))}
          </div>
        )}

        {section !== 'standings' && loading ? (
          <div>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="skeleton" style={{ flex: 1, height: 12 }} />
                <div className="skeleton" style={{ width: 40, height: 16 }} />
                <div className="skeleton" style={{ flex: 1, height: 12 }} />
              </div>
            ))}
          </div>
        ) : section !== 'standings' && matches.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No games found. BallDontLie API may be unavailable.</div>
        ) : section !== 'standings' ? (
          matches.map((m: any) => (
            <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', transition: 'background 0.1s', gap: 8 }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div><span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{m.homeTeam}</span>{m.league && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.league}</div>}</div>
              <div style={{ textAlign: 'center' }}>
                {m.homeScore !== null ? (
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{m.homeScore} - {m.awayScore}</div>
                ) : (
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1a73e8' }}>{m.time}</div>
                )}
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{m.date}</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' }}>{m.awayTeam}</span>
            </div>
          ))
        ) : null}
      </main>

      {/* RIGHT PANEL */}
      <aside className="sidebar-right" style={{ display: 'flex', flexDirection: 'column', gap: 16, }}>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>NBA Playoffs 2026</div>
          </div>
          {[
            { label: 'Conference Semifinals', value: 'Apr–May', color: '#00873d' },
            { label: 'Conference Finals', value: 'May 20+', color: '#ff6b35' },
            { label: 'NBA Finals', value: 'Jun 5, 2025', color: '#e53935' },
          ].map(item => (
            <div key={item.label} style={{ padding: '10px 16px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#333' }}>{item.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
      </aside>

    </div>
  );
}
