interface VibeCodingVideoPageProps {
  title: string
  youtubeEmbedUrl: string
}

export default function VibeCodingVideoPage({ title, youtubeEmbedUrl }: VibeCodingVideoPageProps) {
  const isPlaceholder = !youtubeEmbedUrl || youtubeEmbedUrl.includes('VIDEO_ID_HERE')

  return (
    <section className="flex flex-col items-center gap-8 py-4 md:py-6">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold gradient-text text-soft-shadow text-center">
        {title}
      </h1>

      <div className="card bg-white/80 border border-gray-200 shadow-md w-full max-w-4xl">
        <div className="relative w-full overflow-hidden rounded-2xl bg-black aspect-video">
          {isPlaceholder ? (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <p className="text-white/90 text-center font-semibold">
                Video embed URL not set yet.
              </p>
            </div>
          ) : (
            <iframe
              src={youtubeEmbedUrl}
              title={`${title} video`}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </section>
  )
}

