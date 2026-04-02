import VibeCodingVideoPage from '../VibeCodingVideoPage'

export default function OcJoinPage() {
  return (
    <VibeCodingVideoPage
      title="OC Join"
      youtubeEmbedUrl="https://www.youtube.com/embed/VIDEO_ID_HERE?rel=0&modestbranding=1&controls=1&enablejsapi=1"
      ctaLabel="Accept Deal"
      ctaUrl="/api/checkout-oc-join"
    />
  )
}

