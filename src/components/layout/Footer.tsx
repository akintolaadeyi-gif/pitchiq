import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#0f1117', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 48 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 24px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32 }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, background: '#22c55e', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#0f1117', fontWeight: 900, fontSize: 14 }}>P</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>PitchIQ</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>
            The essential sports dashboard for live scores, stats and results.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', borderRadius: 8, padding: '7px 12px', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>App Store</a>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', borderRadius: 8, padding: '7px 12px', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>Google Play</a>
          </div>
        </div>

        {/* Sports */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>Sports</div>
          {[
            { label: 'Football', href: '/football' },
            { label: 'Basketball', href: '/basketball' },
            { label: 'Tennis', href: '/tennis' },
            { label: 'World Cup 2026', href: '/worldcup' },
          ].map(l => (
            <Link key={l.label} href={l.href} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', marginBottom: 8 }}>{l.label}</Link>
          ))}
        </div>

        {/* Leagues */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>Leagues</div>
          {['Premier League', 'Champions League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1'].map(l => (
            <Link key={l} href="/football" style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', marginBottom: 8 }}>{l}</Link>
          ))}
        </div>

        {/* Company */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>Company</div>
          {[{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'News', href: '#' }, { label: 'Contact', href: '#' }].map(l => (
            <Link key={l.label} href={l.href} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', marginBottom: 8 }}>{l.label}</Link>
          ))}
        </div>

        {/* Legal */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>Legal</div>
          {[{ label: 'Terms of Use', href: '#' }, { label: 'Privacy Policy', href: '#' }, { label: 'Cookie Policy', href: '#' }, { label: 'FAQ', href: '#' }].map(l => (
            <Link key={l.label} href={l.href} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', marginBottom: 8 }}>{l.label}</Link>
          ))}
        </div>

      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '16px 24px', maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>© Copyright 2026 PitchIQ. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ label: '𝕏', title: 'X' }, { label: 'in', title: 'LinkedIn' }, { label: 'f', title: 'Facebook' }].map((icon) => (
            <a key={icon.title} href="#" title={icon.title} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 13 }}>{icon.label}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
