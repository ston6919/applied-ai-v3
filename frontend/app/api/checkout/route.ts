import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2026-01-28.clover',
})

export async function GET(request: NextRequest) {
  try {
    const originHeader = request.headers.get('origin')
    const origin =
      originHeader && originHeader.startsWith('http')
        ? originHeader
        : 'http://127.0.0.1:3007'

    // Try to retrieve the promotion code and apply discount
    // If it fails (e.g., test/live mode mismatch), continue without discount
    let discounts: Array<{ coupon: string }> | undefined
    
    try {
      const promotionCode = await stripe.promotionCodes.retrieve(
        'promo_1SyuWZRosRcw9chfcsvuOZ68',
        { expand: ['coupon'] }
      )
      const couponId = typeof promotionCode.coupon === 'string' 
        ? promotionCode.coupon 
        : promotionCode.coupon.id
      discounts = [
        {
          coupon: couponId,
        },
      ]
    } catch (promoError: any) {
      console.warn('Could not apply promotion code, continuing without discount:', promoError.message)
      // Continue without discount - useful for test mode when promo is in live mode
    }

    const sessionConfig: any = {
      mode: 'payment',
      line_items: [
        {
          price: 'price_1SyuW1RosRcw9chfkFvCJJsF',
          quantity: 1,
        },
      ],
      success_url: `${origin}/offer/ai-power-pack?success=true`,
      cancel_url: `${origin}/offer/ai-power-pack?canceled=true`,
    }

    // Only add discounts if we successfully retrieved the promotion code
    if (discounts) {
      sessionConfig.discounts = discounts
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe did not return a checkout URL' },
        { status: 500 }
      )
    }

    return NextResponse.redirect(session.url, { status: 303 })
  } catch (error: any) {
    console.error('Error creating Stripe Checkout session', error)
    return NextResponse.json(
      { 
        error: 'Unable to start checkout, please try again.',
        details: error?.message || 'Unknown error',
        type: error?.type || 'unknown'
      },
      { status: 500 }
    )
  }
}

