import { useState } from "react";
import { stripePromise } from "@/lib/stripe";

interface CheckoutItem {
  name: string;
  price: number;
  quantity?: number;
  image?: string;
}

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async (items: CheckoutItem[], customerEmail?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items, customerEmail }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  };

  return { checkout, loading, error };
}
