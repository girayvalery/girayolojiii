import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <p className="text-lg font-semibold mb-2" style={{ color: '#1D9E75' }}>Girayoloji</p>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              Bilim, fikir ve keşfin Türkçe buluşma noktası. Bilgiyi paylaş, düşünceni özgürce ifade et.
            </p>
            <div className="flex gap-2">
              <a href="https://www.youtube.com/@Girayoloji" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all"
                style={{ background: '#FF0000', color: '#fff' }} title="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://instagram.com/girayoloji" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all text-white"
                style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }} title="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a href="https://twitter.com/girayoloji" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all"
                style={{ background: '#1a1a1a', color: '#fff' }} title="X (Twitter)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Keşfet</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" style={{ color: 'var(--text-muted)' }} className="hover:text-green-500">Bloglar</Link></li>
              <li><Link href="/reels" style={{ color: 'var(--text-muted)' }} className="hover:text-green-500">Kısa Videolar</Link></li>
              <li><Link href="/topluluk" style={{ color: 'var(--text-muted)' }} className="hover:text-green-500">Topluluk</Link></li>
              <li><Link href="/katkida-bulun" style={{ color: 'var(--text-muted)' }} className="hover:text-green-500">İçerik Ekle</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Bilgi</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/hakkinda" style={{ color: 'var(--text-muted)' }} className="hover:text-green-500">Hakkında</Link></li>
              <li><Link href="/dashboard" style={{ color: 'var(--text-muted)' }} className="hover:text-green-500">İstatistikler</Link></li>
              <li><Link href="/ayarlar" style={{ color: 'var(--text-muted)' }} className="hover:text-green-500">Ayarlar</Link></li>
            </ul>
          </div>
        </div>

        <div className="text-center text-xs pt-6" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
          © 2026 Girayoloji · Bilgi paylaşmak özgürlüktür
        </div>
      </div>
    </footer>
  )
}
