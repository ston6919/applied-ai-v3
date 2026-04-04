import { toVibeCodingYouTubeEmbedUrl } from '@/lib/youtubeEmbed'
import VibeCodingVideoPage from '../VibeCodingVideoPage'

export default function Plc2BuildPage() {
  return (
    <VibeCodingVideoPage
      title="Day 2: Let's Get Building"
      youtubeEmbedUrl={toVibeCodingYouTubeEmbedUrl(
        process.env.NEXT_PUBLIC_VIBE_CODING_PLC2_YOUTUBE_URL
      )}
    />
  )
}

