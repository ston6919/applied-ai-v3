import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2026-01-28.clover',
})

const OC_JOIN_PRICE_ID = 'price_1TJHEqRosRcw9chfiVNbxlz7'
const OC_JOIN_PROMO_ID = 'promo_1TJHHpRosRcw9chf6uAq2PE5'

export async function GET(request: NextRequest) {
  try {
    const originHeader = request.headers.get('origin')
    const origin =
      originHeader && originHeader.startsWith('http')
        ? originHeader
        : 'http://127.0.0.1:3007'

    const price = await stripe.prices.retrieve(OC_JOIN_PRICE_ID)
    const mode: Stripe.Checkout.SessionCreateParams.Mode = price.recurring
      ? 'subscription'
      : 'payment'

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price: OC_JOIN_PRICE_ID,
          quantity: 1,
        },
      ],
      discounts: [
        {
          promotion_code: OC_JOIN_PROMO_ID,
        },
      ],
      success_url: `${origin}/vibe-coding/thank-you`,
      cancel_url: `${origin}/vibe-coding/oc-join?canceled=true`,
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe did not return a checkout URL' },
        { status: 500 }
      )
    }

    return NextResponse.redirect(session.url, { status: 303 })
  } catch (error: any) {
    console.error('Error creating Stripe Checkout session for OC Join', error)
    return NextResponse.json(
      {
        error: 'Unable to start checkout, please try again.',
        details: error?.message || 'Unknown error',
        type: error?.type || 'unknown',
      },
      { status: 500 }
    )
  }
}
