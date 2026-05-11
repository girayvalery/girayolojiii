'use client'
import { getYouTubeEmbedUrl } from '@/lib/youtube'

export default function YouTubeEmbed({ videoId, title }: { videoId: string; title?: string }) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: '56.25%', background: '#000' }}>
      <iframe
        src={getYouTubeEmbedUrl(videoId)}
        title={title || 'YouTube video'}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
