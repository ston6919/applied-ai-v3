import { createClient } from '@supabase/supabase-js'

function getCoursesEnv() {
  const url = process.env.COURSES_SUPABASE_URL
  const anonKey = process.env.COURSES_SUPABASE_ANON_KEY
  return { url, anonKey }
}

export function createCoursesAnonClient() {
  const { url, anonKey } = getCoursesEnv()
  if (!url || !anonKey) {
    throw new Error('Missing COURSES_SUPABASE_URL or COURSES_SUPABASE_ANON_KEY')
  }
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export function createCoursesUserClient(accessToken: string) {
  const { url, anonKey } = getCoursesEnv()
  if (!url || !anonKey) {
    throw new Error('Missing COURSES_SUPABASE_URL or COURSES_SUPABASE_ANON_KEY')
  }
  return createClient(url, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export async function canUserAccessCourse(accessToken: string, courseId: string): Promise<boolean> {
  const client = createCoursesUserClient(accessToken)
  const { data: userData, error: userError } = await client.auth.getUser()
  if (userError || !userData.user) {
    return false
  }

  const { data, error } = await client
    .from('course_user_access')
    .select('course_id')
    .eq('user_id', userData.user.id)
    .eq('course_id', courseId)
    .limit(1)

  if (error) {
    console.error('Accessible course check error:', error)
    return false
  }

  return Boolean(data && data.length > 0)
}

export async function getAccessibleCourseIds(accessToken: string): Promise<string[]> {
  const client = createCoursesUserClient(accessToken)
  const { data: userData, error: userError } = await client.auth.getUser()
  if (userError || !userData.user) {
    return []
  }

  const { data, error } = await client
    .from('course_user_access')
    .select('course_id')
    .eq('user_id', userData.user.id)

  if (error) {
    console.error('Accessible courses list error:', error)
    return []
  }

  return (data ?? []).map((row: { course_id: string }) => row.course_id)
}

export function coursesNoIndexHeaders(): Record<string, string> {
  return { 'X-Robots-Tag': 'noindex, nofollow' }
}

