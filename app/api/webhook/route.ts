import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// Webhook-Signatur verifizieren (wichtig für Produktion!)
export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('[WEBHOOK] Signatur ungültig:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // ── Event-Handler ──────────────────────────────────────────────────────────

  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      
      // Zahlung erfolgreich — hier könntest du:
      // 1. Einen Zugangs-Token in eine DB schreiben (z.B. Vercel KV / Supabase)
      // 2. Eine Bestätigungs-E-Mail via Resend senden
      // 3. Den Kunden in eine Mailchimp-Liste eintragen (optional)
      
      const niche      = session.metadata?.niche_id
      const auftragNr  = session.metadata?.auftragNr
      const customerEmail = session.customer_details?.email

      console.log(`[PAYMENT] ✓ Zahlung für ${niche} | Auftrag ${auftragNr} | ${customerEmail}`)
      console.log(`[PAYMENT] Betrag: ${(session.amount_total ?? 0) / 100} €`)
      
      // Optional: Bestätigungs-Mail senden (Resend)
      // await resend.emails.send({
      //   from: 'noreply@flow-gen.ai',
      //   to: customerEmail,
      //   subject: `Dein Regiezettel PDF – Auftrag ${auftragNr}`,
      //   html: `<p>Danke! <a href="...">PDF herunterladen</a></p>`,
      // })
      
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      console.log(`[REFUND] Rückerstattung für Charge ${charge.id}`)
      break
    }

    default:
      // Unbekannte Events ignorieren
      break
  }

  return NextResponse.json({ received: true })
}

// Wichtig: Body-Parser deaktivieren für Webhook-Signatur-Verifikation
export const runtime = 'nodejs'
