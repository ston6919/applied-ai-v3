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

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: 'price_1SzK8GRosRcw9chf7367IZsG',
          quantity: 1,
        },
      ],
      // Automatically apply mastermind discount coupon.
      // Note: Stripe does not allow using both `discounts` and `allow_promotion_codes` together.
      discounts: [
        {
          coupon: 'Z8Zdjl4m',
        },
      ],
      success_url: `${origin}/offer/mastermind/thank-you`,
      cancel_url: `${origin}/offer/mastermind?canceled=true`,
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe did not return a checkout URL' },
        { status: 500 }
      )
    }

    return NextResponse.redirect(session.url, { status: 303 })
  } catch (error: any) {
    console.error('Error creating Stripe Checkout session for mastermind', error)
    return NextResponse.json(
      {
        error: 'Unable to start mastermind checkout, please try again.',
        details: error?.message || 'Unknown error',
        type: error?.type || 'unknown',
      },
      { status: 500 }
    )
  }
}

