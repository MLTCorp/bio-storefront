import { loadStripe } from "@stripe/stripe-js";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('VITE_STRIPE_PUBLISHABLE_KEY not configured - Stripe payments will not work');
}

export const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;
