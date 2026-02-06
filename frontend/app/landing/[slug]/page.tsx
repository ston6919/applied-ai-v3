import { notFound } from 'next/navigation'
import LandingPageContent from './LandingPageContent'
import { createClient } from '@supabase/supabase-js'

interface LandingPageData {
  id: number
  title: string
  slug: string
  description: string
  template_content: string
  is_active: boolean
  created_at: string
}

async function getLandingPage(slug: string): Promise<LandingPageData | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables')
      return null
    }

    // Create client with service role key - explicitly bypasses RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    const { data, error } = await supabase
      .from('landing_page')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) {
      console.error('Supabase error fetching landing page:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      return null
    }
    
    if (!data) {
      console.log(`No landing page found with slug: ${slug}`)
      return null
    }
    
    return data as LandingPageData
  } catch (error) {
    console.error('Error fetching landing page:', error)
    return null
  }
}

export default async function LandingPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> | { slug: string }
}) {
  // Handle both Next.js 14 and 15 params format
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams.slug
  
  const landingPage = await getLandingPage(slug)
  
  if (!landingPage) {
    notFound()
  }
  
  return <LandingPageContent initialData={landingPage} />
}