import { NextRequest, NextResponse } from 'next/server'
import { createSignedCookie } from '@/lib/cc-skills-cookie'

// Required for /cc-skills: set CC_SKILLS_PAGE_PASSWORD in .env.local (e.g. AI2026).
// Optional: CC_SKILLS_COOKIE_SECRET for signing; if unset, password is used.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const password = typeof body.password === 'string' ? body.password : ''
    const expected = process.env.CC_SKILLS_PAGE_PASSWORD

    if (!expected) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    if (!password || password !== expected) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    const { name, value, options } = createSignedCookie()
    const res = NextResponse.json({ ok: true })
    res.headers.set('Set-Cookie', `${name}=${value}; ${options}`)
    return res
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
