import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') || 'test'

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase client not initialized', env: {
          url: !!supabaseUrl,
          key: !!supabaseServiceKey
        }},
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('landing_page')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      return NextResponse.json(
        { 
          error: 'Supabase query error',
          errorCode: error.code,
          errorMessage: error.message,
          errorDetails: error.details,
          errorHint: error.hint,
          slug
        },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'No data found', slug },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data,
      slug
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Exception occurred',
        message: error?.message,
        stack: error?.stack,
        slug
      },
      { status: 500 }
    )
  }
}
