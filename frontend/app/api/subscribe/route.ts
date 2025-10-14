import { NextResponse } from 'next/server'

// Simple in-memory store for local dev. Replace with your ESP later.
const submissions: Array<{ email: string; source?: string; ts: number }> = []

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const email = (body?.email || '').toString().trim()
    const source = (body?.source || '').toString().trim() || undefined

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ message: 'Invalid email' }, { status: 400 })
    }

    submissions.push({ email, source, ts: Date.now() })

    // TODO: Integrate with ESP/CRM (e.g., Mailchimp, ConvertKit, Resend) here.

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}













