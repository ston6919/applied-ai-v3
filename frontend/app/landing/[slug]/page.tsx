import { notFound } from 'next/navigation'
import LandingPageContent from './LandingPageContent'

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
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010'
    const response = await fetch(`${base}/api/landing-pages/${slug}/`, {
      next: { revalidate: 60 } // Cache for 60 seconds, then revalidate
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching landing page:', error)
    return null
  }
}

export default async function LandingPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const landingPage = await getLandingPage(params.slug)
  
  if (!landingPage) {
    notFound()
  }
  
  return <LandingPageContent initialData={landingPage} />
}