import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-7xl mb-4">🔭</div>
        <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text)' }}>Sayfa Bulunamadı</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Aradığın sayfa kaybolmuş gibi.</p>
        <Link href="/" className="px-6 py-2.5 rounded-full text-sm font-semibold text-white" style={{ background: '#1D9E75' }}>
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}
