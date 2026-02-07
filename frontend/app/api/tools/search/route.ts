import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Simple rate limiting
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

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const query = (body.query || '').trim()

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

    // If query is empty, return all tools
    if (!query) {
      const { data: toolsData, error } = await supabase
        .from('tool')
        .select('*')
        .or('show_on_site.eq.true,show_on_site.is.null')
        .order('table_order', { ascending: true })
        .order('created_at', { ascending: false })
        .order('name', { ascending: true })

      if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json(
          { error: 'Failed to fetch tools', details: error.message },
          { status: 500 }
        )
      }

      const transformedTools = (toolsData || []).map((tool: any) => ({
        ...tool,
        categories: [],
        features: tool.features || [],
        new_features: tool.new_features || [],
        external_id: tool.external_id?.toString() || undefined,
      }))

      const results = transformedTools.map(tool => ({
        tool,
        relevance_score: 1.0,
        metadata: {}
      }))

      return NextResponse.json({
        query: '',
        results,
        total: results.length,
      })
    }

    // Perform text search
    const { data: toolsData, error } = await supabase
      .from('tool')
      .select('*')
      .or('show_on_site.eq.true,show_on_site.is.null')
      .or(`name.ilike.%${query}%,short_description.ilike.%${query}%,description.ilike.%${query}%`)
      .order('table_order', { ascending: true })
      .order('created_at', { ascending: false })
      .order('name', { ascending: true })

    if (error) {
      console.error('Supabase search error:', error)
      return NextResponse.json(
        { error: 'Search failed', details: error.message },
        { status: 500 }
      )
    }

    const transformedTools = (toolsData || []).map((tool: any) => ({
      ...tool,
      categories: [],
      features: tool.features || [],
      new_features: tool.new_features || [],
      external_id: tool.external_id?.toString() || undefined,
    }))

    // Simple relevance scoring
    const results = transformedTools.map(tool => {
      const nameMatch = tool.name.toLowerCase().includes(query.toLowerCase())
      const descMatch = tool.short_description.toLowerCase().includes(query.toLowerCase())
      const fullDescMatch = tool.description.toLowerCase().includes(query.toLowerCase())
      
      let score = 0.5
      if (nameMatch) score = 1.0
      else if (descMatch) score = 0.7

      return {
        tool,
        relevance_score: score,
        metadata: {}
      }
    }).sort((a, b) => b.relevance_score - a.relevance_score)

    return NextResponse.json({
      query,
      results,
      total: results.length,
    })
  } catch (error: any) {
    console.error('Error performing search:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: error.message },
      { status: 500 }
    )
  }
}
