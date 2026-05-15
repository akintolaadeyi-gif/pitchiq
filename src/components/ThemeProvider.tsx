'use client'
import { useEffect, useState } from 'react'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const prefs = localStorage.getItem('pitchiq_prefs')
    if (prefs) {
      const p = JSON.parse(prefs)
      if (p.theme) setTheme(p.theme)
    }
    // Listen for theme changes
    const handler = () => {
      const prefs = localStorage.getItem('pitchiq_prefs')
      if (prefs) {
        const p = JSON.parse(prefs)
        if (p.theme) setTheme(p.theme)
      }
    }
    window.addEventListener('pitchiq_theme_change', handler)
    return () => window.removeEventListener('pitchiq_theme_change', handler)
  }, [])

  const dark = theme === 'dark'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div style={{
      minHeight: '100vh',
      background: dark ? '#13151a' : '#f5f5f5',
      color: dark ? '#e8eaed' : '#1a1a1a',
      transition: 'background 0.2s, color 0.2s',
    }}>
      {children}
    </div>
  )
}
