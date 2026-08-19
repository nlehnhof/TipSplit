import Stripe from "stripe";
import { getAppUrl, requireStripeKeys } from "@/lib/env";

/**
 * POST /api/checkout — server-only Stripe Checkout Session creation.
 *
 * Creates a monthly Pro subscription session. Returns 503
 * { error: "payments_not_configured" } when Stripe env vars are missing so
 * the pricing page can show a graceful state instead of crashing.
 */
export async function POST() {
  let stripeKeys: ReturnType<typeof requireStripeKeys>;
  try {
    stripeKeys = requireStripeKeys();
  } catch {
    return Response.json(
      { error: "payments_not_configured" },
      { status: 503 }
    );
  }

  const appUrl = getAppUrl();
  if (!appUrl) {
    return Response.json(
      { error: "payments_not_configured" },
      { status: 503 }
    );
  }

  try {
    const stripe = new Stripe(stripeKeys.secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: stripeKeys.proMonthlyPriceId, quantity: 1 }],
      success_url: `${appUrl}/app?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    });

    if (!session.url) {
      return Response.json({ error: "checkout_failed" }, { status: 500 });
    }
    return Response.json({ url: session.url });
  } catch {
    return Response.json({ error: "checkout_failed" }, { status: 500 });
  }
}
