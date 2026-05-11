export default function HakkindaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-semibold mb-3 text-center" style={{ color: 'var(--text)' }}>Hakkında</h1>
      <p className="text-center mb-10" style={{ color: 'var(--text-muted)' }}>Girayoloji'nin hikayesi</p>

      <div className="space-y-6 text-base leading-relaxed" style={{ color: 'var(--text)', fontFamily: 'var(--font-body)' }}>
        <p>
          <strong style={{ color: '#1D9E75' }}>Girayoloji</strong>, bilim, felsefe, teknoloji ve sinematografinin kesişiminde yazıların, videoların ve hikayelerin paylaşıldığı bir Türkçe içerik platformudur.
        </p>
        <p>
          Hedefimiz, derinlikli ama erişilebilir içerikler üreterek meraklıların buluşma noktası olmak.
        </p>
        <p>
          Platforma üye olarak yazılarınızı gönderebilir, video paylaşabilir ve toplulukla etkileşime geçebilirsiniz.
        </p>
      </div>
    </div>
  )
}
