'use client';
import { useState } from 'react';
import Link from 'next/link';

const GRAND_SLAMS = [
  { name: 'Australian Open', location: 'Melbourne', surface: 'Hard', surfaceColor: '#1a73e8', dates: 'Jan 13–26, 2026', status: 'completed', emoji: '🇦🇺', prize: '$86.5M AUD', winner_m: 'Jannik Sinner', winner_w: 'Madison Keys' },
  { name: 'Roland Garros', location: 'Paris', surface: 'Clay', surfaceColor: '#e53935', dates: 'May 25 – Jun 8, 2026', status: 'upcoming', emoji: '🇫🇷', prize: '€53.5M', winner_m: null, winner_w: null },
  { name: 'Wimbledon', location: 'London', surface: 'Grass', surfaceColor: '#00873d', dates: 'Jun 29 – Jul 12, 2026', status: 'upcoming', emoji: '🇬🇧', prize: '£50M', winner_m: null, winner_w: null },
  { name: 'US Open', location: 'New York', surface: 'Hard', surfaceColor: '#1a73e8', dates: 'Aug 31 – Sep 13, 2026', status: 'upcoming', emoji: '🇺🇸', prize: '$65M USD', winner_m: null, winner_w: null },
];

const ATP = [
  { rank: 1, name: 'Jannik Sinner', country: '🇮🇹', points: 11330, age: 23 },
  { rank: 2, name: 'Carlos Alcaraz', country: '🇪🇸', points: 9255, age: 22 },
  { rank: 3, name: 'Alexander Zverev', country: '🇩🇪', points: 7075, age: 28 },
  { rank: 4, name: 'Novak Djokovic', country: '🇷🇸', points: 5490, age: 38 },
  { rank: 5, name: 'Daniil Medvedev', country: '🇷🇺', points: 4970, age: 28 },
  { rank: 6, name: 'Casper Ruud', country: '🇳🇴', points: 4550, age: 26 },
  { rank: 7, name: 'Andrey Rublev', country: '🇷🇺', points: 4225, age: 27 },
  { rank: 8, name: 'Hubert Hurkacz', country: '🇵🇱', points: 3935, age: 27 },
  { rank: 9, name: 'Grigor Dimitrov', country: '��🇬', points: 3775, age: 33 },
  { rank: 10, name: 'Alex de Minaur', country: '🇦🇺', points: 3765, age: 25 },
];

const WTA = [
  { rank: 1, name: 'Aryna Sabalenka', country: '🇧🇾', points: 10925, age: 26 },
  { rank: 2, name: 'Iga Swiatek', country: '🇵🇱', points: 9295, age: 24 },
  { rank: 3, name: 'Coco Gauff', country: '🇺🇸', points: 7150, age: 21 },
  { rank: 4, name: 'Elena Rybakina', country: '🇰🇿', points: 6580, age: 25 },
  { rank: 5, name: 'Jasmine Paolini', country: '🇮🇹', points: 5985, age: 28 },
  { rank: 6, name: 'Mirra Andreeva', country: '🇷🇺', points: 4765, age: 17 },
  { rank: 7, name: 'Daria Kasatkina', country: '🇷��', points: 4610, age: 27 },
  { rank: 8, name: 'Barbora Krejcikova', country: '🇨🇿', points: 4345, age: 28 },
  { rank: 9, name: 'Emma Navarro', country: '🇺🇸', points: 4180, age: 23 },
  { rank: 10, name: 'Madison Keys', country: '🇺🇸', points: 3990, age: 30 },
];

export default function TennisPage() {
  const [rankTab, setRankTab] = useState<'ATP'|'WTA'>('ATP');
  const rankings = rankTab === 'ATP' ? ATP : WTA;

  return (
    <div className="three-col">

      {/* LEFT SIDEBAR */}
      <aside className="sidebar-left" style={{ background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden', }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Tournaments</div>
          {GRAND_SLAMS.map(s => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 6, cursor: 'pointer' }}>
              <span style={{ fontSize: 14 }}>{s.emoji}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{s.name}</div>
                <div style={{ fontSize: 10, color: s.status === 'completed' ? '#00873d' : '#1a73e8', fontWeight: 600, textTransform: 'uppercase' }}>{s.status}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Other Sports</div>
          {[
            { label: 'Football', href: '/football', icon: '⚽' },
            { label: 'Basketball', href: '/basketball', icon: '🏀' },
          ].map(s => (
            <Link key={s.label} href={s.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 6, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>
              <span>{s.icon}</span><span>{s.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* CENTER */}
      <main style={{ background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>🎾 Tennis</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Grand Slams · ATP · WTA Rankings</div>
        </div>

        {/* Grand Slams */}
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Grand Slams 2026</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {GRAND_SLAMS.map(s => (
              <div key={s.name} style={{ padding: '12px 14px', border: `1px solid ${s.status === 'completed' ? '#e0e0e0' : s.surfaceColor + '40'}`, borderTop: `3px solid ${s.surfaceColor}`, borderRadius: 8, background: s.status === 'completed' ? '#fafafa' : '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{s.emoji}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: s.status === 'completed' ? '#00873d' : '#1a73e8', background: s.status === 'completed' ? 'rgba(0,135,61,0.08)' : 'rgba(26,115,232,0.08)', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>{s.status}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{s.dates}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: s.surfaceColor, background: s.surfaceColor + '15', padding: '2px 6px', borderRadius: 4 }}>{s.surface}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.prize}</span>
                </div>
                {s.winner_m && (
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f0f0f0', fontSize: 11, color: 'var(--text-secondary)' }}>
                    🏅 {s.winner_m} (M) · {s.winner_w} (W)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Rankings */}
        <div style={{ padding: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Rankings</div>
            <div style={{ display: 'flex', gap: 4, background: '#f5f5f5', borderRadius: 6, padding: 3 }}>
              {(['ATP','WTA'] as const).map(t => (
                <button key={t} onClick={() => setRankTab(t)} style={{ padding: '4px 14px', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, background: rankTab === t ? '#fff' : 'transparent', color: rankTab === t ? '#1a1a1a' : '#888', boxShadow: rankTab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s' }}>{t}</button>
              ))}
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg-base)', borderBottom: '1px solid #f0f0f0' }}>
                {['#','Player','Age','Points'].map((h,i) => (
                  <th key={h} style={{ padding: '9px 16px', textAlign: i > 1 ? 'right' : 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rankings.map((p, i) => (
                <tr key={p.rank} style={{ borderBottom: '1px solid #f5f5f5', cursor: 'pointer', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '10px 16px', fontWeight: 700, color: p.rank <= 3 ? '#ff6b35' : '#bbb', width: 40 }}>{p.rank}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{p.country}</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--text-muted)' }}>{p.age}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>{p.points.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* RIGHT PANEL */}
      <aside className="sidebar-right" style={{ display: 'flex', flexDirection: 'column', gap: 16, }}>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Next Up</div>
          </div>
          {[
            { label: 'Roland Garros R1', value: 'May 25', color: '#e53935' },
            { label: 'Wimbledon', value: 'Jun 29', color: '#00873d' },
            { label: 'US Open', value: 'Aug 31', color: '#1a73e8' },
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
