export function extractYouTubeId(url: string): string | null {
  if (!url) return null
  // Çeşitli formatlar için
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&?\s]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // direkt ID girilmişse
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m && m[1]) return m[1]
  }
  return null
}

export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'hq' | 'max' = 'hq'): string {
  const map = { default: 'default', hq: 'hqdefault', max: 'maxresdefault' }
  return `https://img.youtube.com/vi/${videoId}/${map[quality]}.jpg`
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`
}
