import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireCoursesUser } from '@/lib/courses-auth'
import { canUserAccessCourse, createCoursesUserClient } from '@/lib/courses-supabase'

type PageProps = {
  params: { courseId: string; moduleId: string; lessonId: string }
}

type Lesson = {
  id: string
  title: string | null
  content_text: string | null
  youtube_url: string | null
}

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

function toYouTubeEmbedUrl(url: string | null): string | null {
  if (!url) return null

  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      const videoId = parsed.pathname.replace('/', '')
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    }
    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v')
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    }
    return null
  } catch {
    return null
  }
}

export default async function LessonPage({ params }: PageProps) {
  const user = await requireCoursesUser()
  const client = createCoursesUserClient(user.accessToken)
  const allowed = await canUserAccessCourse(user.accessToken, params.courseId)
  if (!allowed) notFound()

  const { data, error } = await client
    .from('course_lessons')
    .select('id,title,content_text,youtube_url,module_id')
    .eq('id', params.lessonId)
    .eq('module_id', params.moduleId)
    .single()

  if (error || !data) {
    notFound()
  }

  const lesson = data as Lesson
  const embedUrl = toYouTubeEmbedUrl(lesson.youtube_url)

  return (
    <div className="container mx-auto px-4 py-10">
      <Link href={`/courses/${params.courseId}/modules/${params.moduleId}`} className="text-sm font-medium text-indigo-600 hover:underline">
        Back to lessons
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">{lesson.title || 'Untitled lesson'}</h1>

      {embedUrl ? (
        <div
          className="relative mt-6 w-full overflow-hidden rounded-xl border border-gray-200 bg-black"
          style={{ aspectRatio: '16 / 9' }}
        >
          <iframe
            title={lesson.title || 'Lesson video'}
            src={embedUrl}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : null}

      {lesson.content_text ? (
        <article className="prose prose-gray mt-6 max-w-none rounded-xl border border-gray-200 bg-white p-5">
          {lesson.content_text.split('\n').map((line, index) => (
            <p key={`${index}-${line.slice(0, 12)}`}>{line}</p>
          ))}
        </article>
      ) : null}

      {!lesson.content_text && !embedUrl ? (
        <p className="mt-6 rounded-md border border-gray-200 bg-white p-4 text-gray-600">
          No video or text content has been added for this lesson yet.
        </p>
      ) : null}
    </div>
  )
}

