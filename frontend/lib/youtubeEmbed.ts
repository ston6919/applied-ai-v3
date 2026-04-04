const VIBE_CODING_EMBED_PARAMS = 'rel=0&modestbranding=1&controls=1&enablejsapi=1'

/** Accepts watch URL, youtu.be, /embed/, or an 11-character video id. */
export function extractYouTubeVideoId(input: string | null | undefined): string | null {
  if (!input?.trim()) return null
  const s = input.trim()

  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s

  try {
    const u = new URL(s)
    if (u.hostname === 'youtu.be' || u.hostname.endsWith('.youtu.be')) {
      const id = u.pathname.replace(/^\//, '').split('/')[0]
      return id || null
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/embed/')) {
        return u.pathname.split('/')[2] || null
      }
      if (u.pathname.startsWith('/v/')) {
        return u.pathname.split('/')[2] || null
      }
      const v = u.searchParams.get('v')
      if (v) return v
    }
  } catch {
    return null
  }

  return null
}

/** Build embed URL with the same query string used on vibe-coding PLC pages. */
export function toVibeCodingYouTubeEmbedUrl(input: string | null | undefined): string {
  const id = extractYouTubeVideoId(input)
  if (!id) {
    return `https://www.youtube.com/embed/VIDEO_ID_HERE?${VIBE_CODING_EMBED_PARAMS}`
  }
  return `https://www.youtube.com/embed/${id}?${VIBE_CODING_EMBED_PARAMS}`
}
