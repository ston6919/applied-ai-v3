import { toVibeCodingYouTubeEmbedUrl } from '@/lib/youtubeEmbed'
import VibeCodingVideoPage from '../VibeCodingVideoPage'

export default function Plc1RevolutionPage() {
  return (
    <VibeCodingVideoPage
      title="Day 1: The Vibe Coding Revolution"
      youtubeEmbedUrl={toVibeCodingYouTubeEmbedUrl(
        process.env.NEXT_PUBLIC_VIBE_CODING_PLC1_YOUTUBE_URL
      )}
    />
  )
}

