import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, business_name, project_nature, budget } = body

    // Validate required fields
    if (!name || !email || !business_name || !project_nature || !budget) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8010'
    const backendEndpoint = `${backendUrl}/api/waiting-list/`
    
    const response = await fetch(backendEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        business_name,
        project_nature,
        budget
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: `Backend error: ${errorData.error || 'Unknown error'}` },
        { status: 500 }
      )
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data })

  } catch (error) {
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
