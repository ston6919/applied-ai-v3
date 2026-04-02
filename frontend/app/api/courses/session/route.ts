import { NextRequest, NextResponse } from 'next/server'
import { verifyCoursesSessionCookie } from '@/lib/courses-cookie'
import { coursesNoIndexHeaders, getAccessibleCourseIds } from '@/lib/courses-supabase'

export async function GET(request: NextRequest) {
  const session = verifyCoursesSessionCookie(request.headers.get('cookie'))
  if (!session) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401, headers: coursesNoIndexHeaders() }
    )
  }

  const accessibleCourseIds = await getAccessibleCourseIds(session.accessToken)
  if (accessibleCourseIds.length === 0) {
    return NextResponse.json(
      { authenticated: false },
      { status: 403, headers: coursesNoIndexHeaders() }
    )
  }

  return NextResponse.json(
    {
      authenticated: true,
      user: { email: session.email, id: session.userId },
    },
    { headers: coursesNoIndexHeaders() }
  )
}

