import { toVibeCodingYouTubeEmbedUrl } from '@/lib/youtubeEmbed'
import VibeCodingVideoPage from '../VibeCodingVideoPage'

export default function Plc3ProcessPage() {
  return (
    <VibeCodingVideoPage
      title="Day 3: The Process"
      youtubeEmbedUrl={toVibeCodingYouTubeEmbedUrl(
        process.env.NEXT_PUBLIC_VIBE_CODING_PLC3_YOUTUBE_URL
      )}
    />
  )
}

