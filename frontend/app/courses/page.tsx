import Link from 'next/link'
import { Metadata } from 'next'
import CoursesLogoutButton from '@/app/courses/CoursesLogoutButton'
import { requireCoursesUser } from '@/lib/courses-auth'
import { createCoursesUserClient, getAccessibleCourseIds } from '@/lib/courses-supabase'

type Course = {
  id: string
  title: string | null
  description: string | null
}

export const metadata: Metadata = {
  title: 'Courses | Applied AI',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function CoursesPage() {
  const user = await requireCoursesUser()
  const client = createCoursesUserClient(user.accessToken)
  const accessibleCourseIds = await getAccessibleCourseIds(user.accessToken)

  if (accessibleCourseIds.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
            <p className="mt-1 text-sm text-gray-600">Choose a course to view modules and lessons.</p>
          </div>
          <CoursesLogoutButton />
        </div>
        <p className="rounded-md border border-gray-200 bg-white p-4 text-gray-600">You do not have access to any courses yet.</p>
      </div>
    )
  }

  const { data, error } = await client
    .from('courses')
    .select('id,title,description')
    .in('id', accessibleCourseIds)
    .order('title', { ascending: true })

  if (error) {
    console.error('Failed to fetch courses:', error)
  }

  const courses = (data ?? []) as Course[]

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="mt-1 text-sm text-gray-600">Choose a course to view modules and lessons.</p>
        </div>
        <CoursesLogoutButton />
      </div>

      {courses.length === 0 ? (
        <p className="rounded-md border border-gray-200 bg-white p-4 text-gray-600">No courses available yet.</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="block w-full rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900">{course.title || 'Untitled course'}</h2>
              {course.description ? <p className="mt-2 text-sm text-gray-600">{course.description}</p> : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

