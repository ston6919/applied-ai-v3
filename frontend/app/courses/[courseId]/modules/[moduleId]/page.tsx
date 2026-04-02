import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireCoursesUser } from '@/lib/courses-auth'
import { canUserAccessCourse, createCoursesUserClient } from '@/lib/courses-supabase'

type PageProps = {
  params: { courseId: string; moduleId: string }
}

type Module = {
  id: string
  title: string | null
  description: string | null
}

type Lesson = {
  id: string
  title: string | null
}

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ModuleLessonsPage({ params }: PageProps) {
  const user = await requireCoursesUser()
  const client = createCoursesUserClient(user.accessToken)
  const allowed = await canUserAccessCourse(user.accessToken, params.courseId)
  if (!allowed) notFound()

  const [{ data: moduleData, error: moduleError }, { data: lessonsData, error: lessonsError }] = await Promise.all([
    client
      .from('course_modules')
      .select('id,title,description,course_id')
      .eq('id', params.moduleId)
      .eq('course_id', params.courseId)
      .single(),
    client
      .from('course_lessons')
      .select('id,title')
      .eq('module_id', params.moduleId)
      .order('position', { ascending: true })
      .order('title', { ascending: true }),
  ])

  if (moduleError || !moduleData) {
    notFound()
  }

  if (lessonsError) {
    console.error('Failed to fetch lessons:', lessonsError)
  }

  const moduleRecord = moduleData as Module
  const lessons = (lessonsData ?? []) as Lesson[]

  return (
    <div className="container mx-auto px-4 py-10">
      <Link href={`/courses/${params.courseId}`} className="text-sm font-medium text-indigo-600 hover:underline">
        Back to modules
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">{moduleRecord.title || 'Untitled module'}</h1>
      {moduleRecord.description ? <p className="mt-2 text-gray-600">{moduleRecord.description}</p> : null}

      <h2 className="mt-8 text-xl font-semibold text-gray-900">Lessons</h2>
      {lessons.length === 0 ? (
        <p className="mt-3 rounded-md border border-gray-200 bg-white p-4 text-gray-600">No lessons in this module yet.</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/courses/${params.courseId}/modules/${params.moduleId}/lessons/${lesson.id}`}
              className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900">{lesson.title || 'Untitled lesson'}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

