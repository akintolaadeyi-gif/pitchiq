import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import AIChat from "@/components/ui/AIChat"
import Footer from "@/components/layout/Footer"
import ThemeProvider from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PitchIQ — Live Sports Dashboard',
  description: 'Real-time football, basketball and tennis scores and stats',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar />
          <main style={{ paddingTop: 56 }}>
            {children}
          </main>
          <AIChat />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
