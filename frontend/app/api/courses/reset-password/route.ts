import { NextRequest, NextResponse } from 'next/server'
import { createCoursesAnonClient, coursesNoIndexHeaders } from '@/lib/courses-supabase'

function getBaseUrl(request: NextRequest): string {
  const envBaseUrl = process.env.COURSES_AUTH_REDIRECT_BASE_URL
  if (envBaseUrl) return envBaseUrl.replace(/\/$/, '')

  const origin = request.headers.get('origin')
  if (origin && origin.startsWith('http')) return origin.replace(/\/$/, '')

  return 'http://localhost:3007'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400, headers: coursesNoIndexHeaders() }
      )
    }

    const anonClient = createCoursesAnonClient()
    const redirectTo = `${getBaseUrl(request)}/courses/reset-password`
    const { error } = await anonClient.auth.resetPasswordForEmail(email, { redirectTo })

    if (error) {
      return NextResponse.json(
        { error: 'Unable to send reset email' },
        { status: 500, headers: coursesNoIndexHeaders() }
      )
    }

    return NextResponse.json({ ok: true }, { headers: coursesNoIndexHeaders() })
  } catch (error) {
    console.error('Reset password request failed:', error)
    return NextResponse.json(
      { error: 'Unable to send reset email' },
      { status: 500, headers: coursesNoIndexHeaders() }
    )
  }
}

