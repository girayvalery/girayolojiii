import { getAllReels } from '@/lib/data'
import ReelsViewer from '@/components/reels/ReelsViewer'

export function generateStaticParams() {
  return getAllReels().map(r => ({ slug: r.slug }))
}

export default function ReelsPage() {
  return <ReelsViewer />
}
