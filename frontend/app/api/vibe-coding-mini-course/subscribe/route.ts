import { NextResponse } from 'next/server'
import MailerLiteService from '@/lib/mailerlite'

function parseGroupIds(): string[] {
  const raw = process.env.MAILERLITE_VIBE_MINI_COURSE_GROUP_IDS || ''
  return raw
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const email = (body?.email || '').toString().trim()
    const firstName = (body?.first_name || '').toString().trim()

    if (!firstName) {
      return NextResponse.json({ message: 'Please enter your first name' }, { status: 400 })
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ message: 'Please enter a valid email address' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const mailerliteService = new MailerLiteService()
    const groupIds = parseGroupIds()

    const existingSubscriber = await mailerliteService.getSubscriber(normalizedEmail)

    if (existingSubscriber) {
      for (const groupId of groupIds) {
        await mailerliteService.addSubscriberToGroup(normalizedEmail, groupId)
      }
      await mailerliteService.updateSubscriber(normalizedEmail, {
        firstName,
      })
    } else {
      const result = await mailerliteService.createSubscriber(
        normalizedEmail,
        groupIds.length > 0 ? groupIds[0] : null,
        firstName
      )

      if (!result) {
        return NextResponse.json(
          { message: 'Could not complete sign-up. Please try again later.' },
          { status: 500 }
        )
      }

      if (groupIds.length > 1) {
        for (const groupId of groupIds.slice(1)) {
          await mailerliteService.addSubscriberToGroup(normalizedEmail, groupId)
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Vibe coding mini course subscribe error:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
