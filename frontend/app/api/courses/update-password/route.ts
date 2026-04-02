import { NextRequest, NextResponse } from 'next/server'
import { createCoursesAnonClient, coursesNoIndexHeaders } from '@/lib/courses-supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const accessToken = typeof body.accessToken === 'string' ? body.accessToken : ''
    const refreshToken = typeof body.refreshToken === 'string' ? body.refreshToken : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!accessToken || !refreshToken || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: coursesNoIndexHeaders() }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400, headers: coursesNoIndexHeaders() }
      )
    }

    const anonClient = createCoursesAnonClient()
    const { error: setSessionError } = await anonClient.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    if (setSessionError) {
      return NextResponse.json(
        { error: 'Reset link is invalid or expired' },
        { status: 401, headers: coursesNoIndexHeaders() }
      )
    }

    const { error: updateError } = await anonClient.auth.updateUser({ password })
    if (updateError) {
      return NextResponse.json(
        { error: 'Unable to update password' },
        { status: 500, headers: coursesNoIndexHeaders() }
      )
    }

    return NextResponse.json({ ok: true }, { headers: coursesNoIndexHeaders() })
  } catch (error) {
    console.error('Update password request failed:', error)
    return NextResponse.json(
      { error: 'Unable to update password' },
      { status: 500, headers: coursesNoIndexHeaders() }
    )
  }
}

