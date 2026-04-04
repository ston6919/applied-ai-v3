import { toVibeCodingYouTubeEmbedUrl } from '@/lib/youtubeEmbed'
import VibeCodingVideoPage from '../VibeCodingVideoPage'

export default function OcJoinPage() {
  return (
    <VibeCodingVideoPage
      title="OC Join"
      youtubeEmbedUrl={toVibeCodingYouTubeEmbedUrl(
        process.env.NEXT_PUBLIC_VIBE_CODING_OC_JOIN_YOUTUBE_URL
      )}
      ctaLabel="Accept Deal"
      ctaUrl="/api/checkout-oc-join"
    />
  )
}

