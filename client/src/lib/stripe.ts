import { loadStripe } from "@stripe/stripe-js";

// Fallback for build time - Stripe publishable key is safe to expose
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Se5fwHKoL7v2cU3RTpiaEJmSESckfW7b5cR7IIQCgMxNBeH32Ju7qShUvPjTEWFI4lgJlJyzHpKmrEukoraViCo00xOgIz9bL';

export const stripePromise = loadStripe(stripePublishableKey);
