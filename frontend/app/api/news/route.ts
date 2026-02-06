import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Simple rate limiting - in production, consider using Redis or a proper rate limiting library
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute window
  const maxRequests = 30 // 30 requests per minute per IP

  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

function getClientIP(request: NextRequest): string {
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) return realIP
  if (cfConnectingIP) return cfConnectingIP
  
  return 'unknown'
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)

    // Validate inputs
    if (page < 1 || pageSize < 1 || pageSize > 50) {
      return NextResponse.json(
        { error: 'Invalid page or pageSize parameters' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Fetch news stories
    const { data, error, count } = await supabase
      .from('canonical_news_story')
      .select('*', { count: 'exact' })
      .eq('status', 'ranked')
      .gte('rank', 2)
      .order('event_time', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch news' },
        { status: 500 }
      )
    }

    // Fetch captured stories if we have data
    let capturedStories: any[] = []
    if (data && data.length > 0) {
      const storyIds = data.map((item: any) => item.id)
      const { data: captured } = await supabase
        .from('captured_news_story')
        .select('id, url, source, canonical_story_id')
        .in('canonical_story_id', storyIds)
        .order('captured_at', { ascending: false })

      capturedStories = captured || []
    }

    // Group captured stories by canonical_story_id
    const storiesByCanonical: Record<number, any[]> = {}
    capturedStories.forEach((story: any) => {
      const canonicalId = story.canonical_story_id
      if (!storiesByCanonical[canonicalId]) {
        storiesByCanonical[canonicalId] = []
      }
      storiesByCanonical[canonicalId].push(story)
    })

    // Enrich news items with captured stories info
    const enrichedData = data?.map((item: any) => {
      const captured = storiesByCanonical[item.id] || []
      const firstCaptured = captured[0]
      
      return {
        ...item,
        captured_stories_count: captured.length,
        show_source: captured.length > 0,
        source_url: firstCaptured?.url || null,
        source_name: firstCaptured?.source || null,
      }
    }) || []

    return NextResponse.json({
      data: enrichedData,
      count: count || 0,
      page,
      pageSize,
      hasMore: count ? to < count - 1 : false,
    })
  } catch (error: any) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
