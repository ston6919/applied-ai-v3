import { toVibeCodingYouTubeEmbedUrl } from '@/lib/youtubeEmbed'
import VibeCodingVideoPage from '../VibeCodingVideoPage'
import OcJoinSalesContent from './OcJoinSalesContent'

const CTA_LABEL = 'Accept Deal'
const CTA_URL = '/api/checkout-oc-join'

export default function OcJoinPage() {
  return (
    <VibeCodingVideoPage
      title="Join the Vibe Coding Mastery Program"
      youtubeEmbedUrl={toVibeCodingYouTubeEmbedUrl(
        process.env.NEXT_PUBLIC_VIBE_CODING_OC_JOIN_YOUTUBE_URL
      )}
      ctaLabel={CTA_LABEL}
      ctaUrl={CTA_URL}
    >
      <OcJoinSalesContent ctaUrl={CTA_URL} ctaLabel={CTA_LABEL} />
    </VibeCodingVideoPage>
  )
}

