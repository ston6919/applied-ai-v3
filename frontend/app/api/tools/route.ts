import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Simple rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute window
  const maxRequests = 60 // 60 requests per minute per IP

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
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10)
    const ordering = searchParams.get('ordering') || 'manual' // 'manual' or 'recent'

    // Validate inputs
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: 'Invalid page or pageSize parameters' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Create client with service role key - bypasses RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Build query - filter by show_on_site=true or null
    let query = supabase
      .from('tool')
      .select('*', { count: 'exact' })
      .or('show_on_site.eq.true,show_on_site.is.null')

    // Apply sorting
    if (ordering === 'recent') {
      query = query.order('updated_at', { ascending: false })
    } else {
      // Manual ordering: table_order, then created_at desc, then name
      query = query.order('table_order', { ascending: true })
        .order('created_at', { ascending: false })
        .order('name', { ascending: true })
    }

    // Apply pagination
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error fetching tools:', error)
      return NextResponse.json(
        { error: 'Failed to fetch tools', details: error.message },
        { status: 500 }
      )
    }

    // Transform data to match frontend expectations
    const transformedTools = (data || []).map((tool: any) => ({
      ...tool,
      categories: [], // Supabase schema doesn't include categories
      features: tool.features || [],
      new_features: tool.new_features || [],
      external_id: tool.external_id?.toString() || undefined,
    }))

    return NextResponse.json({
      results: transformedTools,
      count: count || 0,
      page,
      pageSize,
      next: count && to < count - 1 ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
    })
  } catch (error: any) {
    console.error('Error fetching tools:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: error.message },
      { status: 500 }
    )
  }
}
