import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireCoursesUser } from '@/lib/courses-auth'
import { canUserAccessCourse, createCoursesUserClient } from '@/lib/courses-supabase'

type PageProps = {
  params: { courseId: string }
  searchParams?: { lessonId?: string }
}

type Course = {
  id: string
  title: string | null
  description: string | null
}

type Module = {
  id: string
  title: string | null
  description: string | null
}

type Lesson = {
  id: string
  module_id: string
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

export default async function CourseModulesPage({ params, searchParams }: PageProps) {
  const user = await requireCoursesUser()
  const client = createCoursesUserClient(user.accessToken)
  const allowed = await canUserAccessCourse(user.accessToken, params.courseId)
  if (!allowed) notFound()

  const [{ data: courseData, error: courseError }, { data: modulesData, error: modulesError }] = await Promise.all([
    client.from('courses').select('id,title,description').eq('id', params.courseId).single(),
    client
      .from('course_modules')
      .select('id,title,description')
      .eq('course_id', params.courseId)
      .order('position', { ascending: true })
      .order('title', { ascending: true }),
  ])

  if (courseError || !courseData) {
    notFound()
  }

  if (modulesError) {
    console.error('Failed to fetch modules:', modulesError)
  }

  const course = courseData as Course
  const modules = (modulesData ?? []) as Module[]
  const moduleIds = modules.map((module) => module.id)

  let lessons: Lesson[] = []
  if (moduleIds.length > 0) {
    const { data: lessonsData, error: lessonsError } = await client
      .from('course_lessons')
      .select('id,module_id,title,content_text,youtube_url')
      .in('module_id', moduleIds)
      .order('position', { ascending: true })
      .order('title', { ascending: true })

    if (lessonsError) {
      console.error('Failed to fetch lessons:', lessonsError)
    } else {
      lessons = (lessonsData ?? []) as Lesson[]
    }
  }

  const requestedLessonId = searchParams?.lessonId
  const selectedLessonFromQuery = lessons.find((lesson) => lesson.id === requestedLessonId) ?? null
  const defaultLesson =
    modules
      .map((module) => lessons.find((lesson) => lesson.module_id === module.id) ?? null)
      .find((lesson) => lesson !== null) ?? null
  const selectedLesson = selectedLessonFromQuery ?? defaultLesson
  const selectedEmbedUrl = toYouTubeEmbedUrl(selectedLesson?.youtube_url ?? null)

  return (
    <div className="container mx-auto px-4 py-10">
      <Link href="/courses" className="text-sm font-medium text-indigo-600 hover:underline">
        Back to courses
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">{course.title || 'Untitled course'}</h1>
      {course.description ? <p className="mt-2 text-gray-600">{course.description}</p> : null}

      {modules.length === 0 ? (
        <p className="mt-6 rounded-md border border-gray-200 bg-white p-4 text-gray-600">No modules in this course yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-xl border border-gray-200 bg-white p-4">
            <h2 className="mb-3 text-base font-semibold text-gray-900">Course content</h2>
            <div className="space-y-3">
              {modules.map((module) => {
                const moduleLessons = lessons.filter((lesson) => lesson.module_id === module.id)
                return (
                  <details key={module.id} open className="group rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                    <summary className="flex cursor-pointer list-none select-none items-center justify-between text-sm font-semibold text-gray-900">
                      <span>{module.title || 'Untitled module'}</span>
                      <svg
                        className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-90"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.08 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </summary>
                    <ul className="mt-2 space-y-1">
                      {moduleLessons.map((lesson) => {
                        const isSelected = selectedLesson?.id === lesson.id
                        return (
                          <li key={lesson.id}>
                            <Link
                              href={`/courses/${params.courseId}?lessonId=${lesson.id}`}
                              className={`block rounded px-2 py-1 text-sm ${
                                isSelected
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {lesson.title || 'Untitled lesson'}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </details>
                )
              })}
            </div>
          </aside>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            {!selectedLesson ? (
              <p className="text-gray-600">Select a lesson to view it.</p>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-gray-900">{selectedLesson.title || 'Untitled lesson'}</h2>

                {selectedEmbedUrl ? (
                  <div
                    className="relative mt-4 w-full overflow-hidden rounded-xl border border-gray-200 bg-black"
                    style={{ aspectRatio: '16 / 9' }}
                  >
                    <iframe
                      title={selectedLesson.title || 'Lesson video'}
                      src={selectedEmbedUrl}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                ) : null}

                {selectedLesson.content_text ? (
                  <article className="prose prose-gray mt-6 max-w-none">
                    {selectedLesson.content_text.split('\n').map((line, index) => (
                      <p key={`${index}-${line.slice(0, 12)}`}>{line}</p>
                    ))}
                  </article>
                ) : null}

                {!selectedLesson.content_text && !selectedEmbedUrl ? (
                  <p className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4 text-gray-600">
                    No video or text content has been added for this lesson yet.
                  </p>
                ) : null}
              </>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

