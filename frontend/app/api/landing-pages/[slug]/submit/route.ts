import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import MailerLiteService from '@/lib/mailerlite'

interface LandingPageData {
  id: number
  title: string
  slug: string
  description: string
  template_content: string
  mailerlite_group_ids: string[] | null
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

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('landing_page')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Supabase error fetching landing page:', error)
      return null
    }

    return data as LandingPageData | null
  } catch (error) {
    console.error('Error fetching landing page:', error)
    return null
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    // Handle both Next.js 14 and 15 params format
    const resolvedParams = await Promise.resolve(params)
    const slug = resolvedParams.slug

    // Get landing page from Supabase
    const landingPage = await getLandingPage(slug)
    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page not found' },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { step, email, first_name, business_type } = body

    // Validate step
    if (!step) {
      return NextResponse.json(
        { error: 'Step is required' },
        { status: 400 }
      )
    }

    const mailerliteService = new MailerLiteService()

    if (step === 'email') {
      // Step 1: Create subscriber in MailerLite with email and first name
      if (!email || !first_name) {
        return NextResponse.json(
          { error: 'Email and first name are required' },
          { status: 400 }
        )
      }

      // Normalize email
      const normalizedEmail = email.toLowerCase().trim()

      // Check if subscriber already exists
      const existingSubscriber = await mailerliteService.getSubscriber(normalizedEmail)

      const groupIds = landingPage.mailerlite_group_ids || []

      if (existingSubscriber) {
        // Add to all groups if not already in them
        for (const groupId of groupIds) {
          await mailerliteService.addSubscriberToGroup(normalizedEmail, groupId)
        }
        // Update first name if provided
        await mailerliteService.updateSubscriber(normalizedEmail, {
          firstName: first_name,
        })
      } else {
        // Create new subscriber with first name and add to all groups
        const result = await mailerliteService.createSubscriber(
          normalizedEmail,
          groupIds.length > 0 ? groupIds[0] : null,
          first_name
        )

        if (!result) {
          return NextResponse.json(
            { error: 'Failed to create subscriber' },
            { status: 500 }
          )
        }

        // Add to additional groups if there are more than one
        if (groupIds.length > 1) {
          for (const groupId of groupIds.slice(1)) {
            await mailerliteService.addSubscriberToGroup(normalizedEmail, groupId)
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Subscriber created successfully',
        next_step: 'business_type',
      })
    } else if (step === 'business_type') {
      // Step 2: Update existing subscriber with business type
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        )
      }

      // Normalize email
      const normalizedEmail = email.toLowerCase().trim()

      // Set the appropriate field values based on business type
      let usesAutomationInTheirBusiness: number | undefined
      let sellsAIServices: number | undefined

      if (business_type === 'implement') {
        usesAutomationInTheirBusiness = 1
        sellsAIServices = 0
      } else if (business_type === 'sell_services') {
        usesAutomationInTheirBusiness = 0
        sellsAIServices = 1
      } else {
        return NextResponse.json(
          { error: 'Invalid business type' },
          { status: 400 }
        )
      }

      // Update in MailerLite with the specific fields
      const result = await mailerliteService.updateSubscriber(normalizedEmail, {
        usesAutomationInTheirBusiness,
        sellsAIServices,
      })

      if (!result) {
        return NextResponse.json(
          { error: 'Failed to update subscriber' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Business type updated successfully',
        template: landingPage.template_content,
        completed: true,
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid step' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error processing landing page submission:', error)
    return NextResponse.json(
      { error: 'An error occurred processing your submission' },
      { status: 500 }
    )
  }
}
