import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(req: NextRequest) {
  try {
    const { formData } = await req.json()

    // FIX: Basis-URL aus dem Request ableiten wenn NEXT_PUBLIC_BASE_URL nicht gesetzt
    // Verhindert den localhost-Fallback der den Stripe-Redirect bricht
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `${req.headers.get('x-forwarded-proto') ?? 'https'}://${req.headers.get('host')}`

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?paid=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?cancelled=true`,
      locale: 'de',
      payment_method_types: ['card', 'paypal', 'klarna'],
      metadata: {
        niche_id: 'elektro-regiezettel',
        firma: formData?.firmaName || '',
        auftragNr: formData?.auftragNr || '',
        brutto: String(formData?.brutto || ''),
      },
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Keine Checkout-URL erhalten' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('[CHECKOUT ERROR]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
