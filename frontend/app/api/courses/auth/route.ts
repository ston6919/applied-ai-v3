import { NextRequest, NextResponse } from 'next/server'
import { createCoursesSessionCookie } from '@/lib/courses-cookie'
import { coursesNoIndexHeaders, createCoursesAnonClient, getAccessibleCourseIds } from '@/lib/courses-supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400, headers: coursesNoIndexHeaders() }
      )
    }

    const anonClient = createCoursesAnonClient()
    const { data, error } = await anonClient.auth.signInWithPassword({ email, password })
    if (error || !data.user) {
      return NextResponse.json(
        { error: 'Invalid login details' },
        { status: 401, headers: coursesNoIndexHeaders() }
      )
    }

    const accessToken = data.session?.access_token
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unable to create session' },
        { status: 500, headers: coursesNoIndexHeaders() }
      )
    }

    const accessibleCourseIds = await getAccessibleCourseIds(accessToken)
    if (accessibleCourseIds.length === 0) {
      return NextResponse.json(
        { error: 'You do not have access to any courses' },
        { status: 403, headers: coursesNoIndexHeaders() }
      )
    }

    const { name, value, options } = createCoursesSessionCookie(data.user.id, data.user.email ?? email, accessToken)
    const response = NextResponse.json({ ok: true }, { headers: coursesNoIndexHeaders() })
    response.headers.set('Set-Cookie', `${name}=${value}; ${options}`)
    return response
  } catch (error) {
    console.error('Courses auth error:', error)
    return NextResponse.json(
      { error: 'Unable to sign in' },
      { status: 500, headers: coursesNoIndexHeaders() }
    )
  }
}

