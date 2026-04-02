import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyCoursesSessionCookie } from '@/lib/courses-cookie'
import { createCoursesUserClient } from '@/lib/courses-supabase'

export type CoursesUser = {
  userId: string
  email: string
  accessToken: string
}

export async function getCoursesUserFromCookies(): Promise<CoursesUser | null> {
  const store = cookies()
  const cookieHeader = store
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ')

  const session = verifyCoursesSessionCookie(cookieHeader)
  if (!session) return null

  // Validate token is still valid in Supabase.
  const userClient = createCoursesUserClient(session.accessToken)
  const { data, error } = await userClient.auth.getUser()
  if (error || !data.user) return null

  return { userId: session.userId, email: session.email, accessToken: session.accessToken }
}

export async function requireCoursesUser(): Promise<CoursesUser> {
  const user = await getCoursesUserFromCookies()
  if (!user) {
    redirect('/courses/login')
  }
  return user
}

