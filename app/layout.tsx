import type { Metadata } from 'next'
import './globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FAB from '@/components/fab/FAB'

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: { default: 'Girayoloji — Bilim, Fikir ve Keşif', template: '%s | Girayoloji' },
  description: 'Bilim, felsefe, teknoloji ve keşfin Türkçe buluşma noktası. Makaleler, videolar, hikayeler.',
  keywords: ['bilim', 'felsefe', 'teknoloji', 'astronomi', 'fizik', 'biyoloji', 'türkçe içerik', 'evrim ağacı'],
  authors: [{ name: 'Girayoloji' }],
  openGraph: {
    title: 'Girayoloji — Bilim, Fikir ve Keşif',
    description: 'Bilim, felsefe, teknoloji ve keşfin Türkçe buluşma noktası.',
    type: 'website',
    locale: 'tr_TR',
    url: baseUrl,
    siteName: 'Girayoloji',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Girayoloji — Bilim, Fikir ve Keşif',
    description: 'Bilim, felsefe, teknoloji ve keşfin Türkçe buluşma noktası.',
  },
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <Providers session={session}>
          <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FAB />
          </div>
        </Providers>
      </body>
    </html>
  )
}
