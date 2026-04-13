import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PDF_URL = 'https://statut-net.vercel.app/rapport-premium.pdf';

async function sendPremiumEmail(email: string): Promise<void> {
  const apiKey = process.env.NEXT_PUBLIC_BREVO_API_KEY;
  if (!apiKey) {
    console.warn('Brevo non configuré — email premium non envoyé');
    return;
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'StatutNet', email: 'jeremyhenry974@gmail.com' },
      to: [{ email }],
      subject: 'Votre rapport StatutNet — Téléchargement disponible',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; color: #1a1a2e;">

          <div style="background: #1D9E75; padding: 24px 28px; border-radius: 8px 8px 0 0;">
            <p style="color: #ffffff; font-size: 20px; font-weight: bold; margin: 0;">StatutNet</p>
          </div>

          <div style="background: #ffffff; border: 1px solid #e5e7eb; border-top: none; padding: 32px 28px; border-radius: 0 0 8px 8px;">
            <h1 style="font-size: 22px; color: #1a1a2e; margin: 0 0 16px;">Merci pour votre achat !</h1>

            <p style="color: #374151; line-height: 1.7;">Bonjour,</p>
            <p style="color: #374151; line-height: 1.7;">
              Votre rapport d'analyse StatutNet est prêt. Il contient l'interprétation
              de votre simulation, les seuils fiscaux à surveiller, la checklist complète
              du passage en société et les questions à poser à votre expert-comptable.
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${PDF_URL}"
                style="display: inline-block; background: #1D9E75; color: #ffffff;
                       font-weight: bold; font-size: 16px; padding: 14px 32px;
                       border-radius: 8px; text-decoration: none;">
                Télécharger mon rapport →
              </a>
            </div>

            <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">
              Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
              <a href="${PDF_URL}" style="color: #1D9E75;">${PDF_URL}</a>
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;" />

            <p style="color: #374151; line-height: 1.7;">Pour aller plus loin :</p>
            <ul style="color: #374151; line-height: 2;">
              <li>
                <a href="https://statut-net.vercel.app/simulateur" style="color: #1D9E75;">
                  Relancer une simulation
                </a> avec d'autres paramètres
              </li>
              <li>
                <a href="https://statut-net.vercel.app/experts" style="color: #1D9E75;">
                  Consulter un expert-comptable partenaire
                </a>
              </li>
            </ul>

            <p style="color: #9ca3af; font-size: 12px; margin-top: 32px; line-height: 1.6;">
              StatutNet · statut-net.vercel.app<br>
              Ce document est fourni à titre informatif. Il ne constitue pas un conseil
              juridique ou fiscal. Paramètres fiscaux 2025.
            </p>
          </div>

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

  await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
    method: 'PUT',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      attributes: {
        PREMIUM_PAID: 'true',
        PREMIUM_DATE: new Date().toISOString().slice(0, 10),
      },
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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email || session.metadata?.email;

    if (email) {
      console.log(`Paiement confirmé pour ${email}`);
      await Promise.all([
        sendPremiumEmail(email),
        markContactAsPremium(email),
      ]);
    } else {
      console.warn('Checkout session sans email:', session.id);
    }
  }

  return NextResponse.json({ received: true });
}