import { NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
// Hardcoded workflow ID per user instruction
const WORKFLOW_ID = 'wf_68e5db0d46288190a2b5ffe28fd09042023c962f97ee972e'

export async function POST(request: Request) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { message: 'Missing OPENAI_API_KEY on server' },
        { status: 500 },
      )
    }
    // WORKFLOW_ID is hardcoded; no env check needed

    const body = await request.json().catch(() => ({}))
    const deviceId = (body?.deviceId || '').toString().trim() || undefined

    const res = await fetch('https://api.openai.com/v1/chatkit/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'chatkit_beta=v1',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        workflow: { id: WORKFLOW_ID },
        ...(deviceId ? { user: deviceId } : {}),
      }),
    })

    if (!res.ok) {
      const errorText = await res.text().catch(() => '')
      return NextResponse.json(
        { message: 'Failed to create ChatKit session', error: errorText },
        { status: 500 },
      )
    }

    const data = await res.json()
    const client_secret = data?.client_secret
    if (!client_secret) {
      return NextResponse.json(
        { message: 'No client_secret returned from OpenAI' },
        { status: 500 },
      )
    }

    return NextResponse.json({ client_secret })
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}


