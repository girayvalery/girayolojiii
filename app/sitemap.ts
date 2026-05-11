import type { MetadataRoute } from 'next'
import { getPublished, getAllVideos, getAllReels, getAllUsers } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  const staticPages = [
    '', '/blog', '/videolar', '/topluluk', '/hakkinda',
    '/auth/login', '/auth/register',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }))

  const posts = getPublished().map(p => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const videos = getAllVideos().map(v => ({
    url: `${baseUrl}/videolar/${v.slug}`,
    lastModified: new Date(v.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const reels = getAllReels().map(r => ({
    url: `${baseUrl}/reels/${r.slug}`,
    lastModified: new Date(r.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const users = getAllUsers().map(u => ({
    url: `${baseUrl}/profile/${u.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.4,
  }))

  return [...staticPages, ...posts, ...videos, ...reels, ...users]
}
