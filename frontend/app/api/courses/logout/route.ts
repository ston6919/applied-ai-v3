import { NextResponse } from 'next/server'
import { clearCoursesSessionCookieHeader } from '@/lib/courses-cookie'
import { coursesNoIndexHeaders } from '@/lib/courses-supabase'

export async function POST() {
  const response = NextResponse.json({ ok: true }, { headers: coursesNoIndexHeaders() })
  response.headers.set('Set-Cookie', clearCoursesSessionCookieHeader())
  return response
}

