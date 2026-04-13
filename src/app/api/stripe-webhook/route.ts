import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

// Désactiver le body parser Next.js pour lire le raw body (signature Stripe)
export const dynamic = 'force-dynamic';

async function sendPremiumEmail(email: string): Promise<void> {
  const apiKey = process.env.NEXT_PUBLIC_BREVO_API_KEY;
  if (!apiKey) {
    console.warn('Brevo non configuré — email premium non envoyé');
    return;
  }

  // Envoyer un email transactionnel via Brevo SMTP API
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'StatutNet', email: 'noreply@statut-net.vercel.app' },
      to: [{ email }],
      subject: 'Votre rapport fiscal StatutNet est prêt',
      htmlContent: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0d9488; font-size: 24px;">Merci pour votre achat !</h1>
          <p>Bonjour,</p>
          <p>Votre rapport fiscal personnalisé StatutNet est en cours de préparation.</p>
          <p>Vous le recevrez dans un email séparé sous 24h maximum.</p>
          <p>En attendant, vous pouvez :</p>
          <ul>
            <li><a href="https://statut-net.vercel.app/simulateur" style="color: #0d9488;">Relancer une simulation</a> avec d'autres paramètres</li>
            <li><a href="https://statut-net.vercel.app/experts" style="color: #0d9488;">Prendre rendez-vous</a> avec un expert-comptable partenaire</li>
          </ul>
          <p style="color: #64748b; font-size: 13px; margin-top: 30px;">
            StatutNet — Simulateur fiscal pour indépendants<br>
            Cet email a été envoyé suite à votre achat du rapport premium.
          </p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('Brevo email error:', res.status, body);
  }
}

async function markContactAsPremium(email: string): Promise<void> {
  const apiKey = process.env.NEXT_PUBLIC_BREVO_API_KEY;
  if (!apiKey) return;

  // Mettre à jour les attributs du contact dans Brevo
  await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
    method: 'PUT',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      attributes: { PREMIUM_PAID: 'true', PREMIUM_DATE: new Date().toISOString().slice(0, 10) },
    }),
  }).catch((err) => console.error('Brevo update contact error:', err));
}

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook non configuré.' }, { status: 503 });
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia' });

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Signature manquante.' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Signature invalide';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Traiter l'événement
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email || session.metadata?.email;

    if (email) {
      console.log(`Paiement confirmé pour ${email}`);

      // Envoyer l'email de confirmation + marquer le contact
      await Promise.all([
        sendPremiumEmail(email),
        markContactAsPremium(email),
      ]);
    } else {
      console.warn('Checkout session sans email:', session.id);
    }
  }

  // Toujours répondre 200 à Stripe pour accuser réception
  return NextResponse.json({ received: true });
}
