import Link from 'next/link'
import Newsletter from './Newsletter'

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <Newsletter />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: '#1D9E75' }}>Girayoloji</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Bilim, fikir ve keşfin Türkçe buluşma noktası.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Keşfet</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" style={{ color: 'var(--text-muted)' }}>Bloglar</Link></li>
              <li><Link href="/videolar" style={{ color: 'var(--text-muted)' }}>Videolar</Link></li>
              <li><Link href="/topluluk" style={{ color: 'var(--text-muted)' }}>Topluluk</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Hesap</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth/login" style={{ color: 'var(--text-muted)' }}>Giriş</Link></li>
              <li><Link href="/auth/register" style={{ color: 'var(--text-muted)' }}>Üye Ol</Link></li>
              <li><Link href="/ayarlar" style={{ color: 'var(--text-muted)' }}>Ayarlar</Link></li>
              <li><Link href="/dashboard" style={{ color: 'var(--text-muted)' }}>İstatistikler</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Bilgi</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/hakkinda" style={{ color: 'var(--text-muted)' }}>Hakkında</Link></li>
              <li><Link href="/katkida-bulun" style={{ color: 'var(--text-muted)' }}>Katkıda Bulun</Link></li>
            </ul>
          </div>
        </div>

        <div className="text-center text-xs pt-6" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
          © 2026 Girayoloji · Tüm hakları saklıdır
        </div>
      </div>
    </footer>
  )
}
