import { stripe } from "./stripe";
import { supabase } from "./supabase";
import Stripe from "stripe";
import { Request, Response, NextFunction } from 'express';

// Plan definitions with Stripe Price IDs (to be created)
export const PLANS = {
  free: {
    id: 'free',
    name: 'Gratis',
    price: 0,
    stripePriceId: null,
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 2990, // R$29.90 in cents
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID || null,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 9700, // R$97.00 in cents
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || null,
  },
} as const;

export type PlanId = keyof typeof PLANS;

// Get or create Stripe customer for a user
export async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  // Check if user already has a stripe_customer_id
  // Note: Using 'as any' until Supabase types are regenerated with new columns
  const { data: user } = await (supabase as any)
    .from('users')
    .select('stripe_customer_id')
    .eq('clerk_id', userId)
    .single();

  if (user?.stripe_customer_id) {
    return user.stripe_customer_id;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });

  // Save to database
  await (supabase as any)
    .from('users')
    .update({ stripe_customer_id: customer.id })
    .eq('clerk_id', userId);

  return customer.id;
}

// Create a checkout session for subscription
export async function createSubscriptionCheckout(
  userId: string,
  email: string,
  planId: PlanId,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const plan = PLANS[planId];

  if (!plan || plan.id === 'free') {
    throw new Error('Invalid plan for checkout');
  }

  const customerId = await getOrCreateStripeCustomer(userId, email);

  // If no Stripe price ID, create one dynamically
  let priceId = plan.stripePriceId;

  if (!priceId) {
    // Create product and price on-the-fly (for development)
    const product = await stripe.products.create({
      name: `BioLink ${plan.name}`,
      metadata: { planId: plan.id },
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.price,
      currency: 'brl',
      recurring: { interval: 'month' },
    });

    priceId = price.id;
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card', 'boleto'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    locale: 'pt-BR',
    metadata: {
      userId,
      planId: plan.id,
    },
    subscription_data: {
      metadata: {
        userId,
        planId: plan.id,
      },
    },
  });

  return session;
}

// Get user's current subscription
export async function getUserSubscription(userId: string) {
  // Note: Using 'as any' until Supabase types are regenerated with new tables
  const { data } = await (supabase as any)
    .from('subscriptions')
    .select('*, subscription_plans(*)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  return data;
}

// Default free plan limits
const FREE_PLAN_LIMITS = {
  pages: 1,
  components_per_page: 10,
  products: 3,
  ai_generations_per_day: 0,
};

// Get user's plan limits
export async function getUserPlanLimits(userId: string) {
  // Primeiro tenta buscar subscription ativa
  const subscription = await getUserSubscription(userId);

  if (subscription?.subscription_plans?.limits) {
    return subscription.subscription_plans.limits;
  }

  // Fallback: verificar users.plan diretamente
  const { data: user } = await (supabase as any)
    .from('users')
    .select('plan')
    .eq('clerk_id', userId)
    .single();

  if (user?.plan && user.plan !== 'free') {
    // Buscar limites do plano na tabela subscription_plans
    const { data: planData } = await (supabase as any)
      .from('subscription_plans')
      .select('limits')
      .eq('id', user.plan)
      .single();

    if (planData?.limits) {
      return planData.limits;
    }
  }

  // Retorna limites free como último fallback
  return FREE_PLAN_LIMITS;
}

// Check if user can perform an action based on their plan
export async function checkPlanLimit(
  userId: string,
  limitType: 'pages' | 'products' | 'ai_generations_per_day',
  currentCount: number
): Promise<{ allowed: boolean; limit: number; current: number }> {
  const limits = await getUserPlanLimits(userId);
  const limit = limits[limitType] as number;

  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, limit: -1, current: currentCount };
  }

  return {
    allowed: currentCount < limit,
    limit,
    current: currentCount,
  };
}

// Check AI generation daily limit
export async function checkAIGenerationLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const limits = await getUserPlanLimits(userId);
  const dailyLimit = limits.ai_generations_per_day as number;

  if (dailyLimit === 0) {
    return { allowed: false, remaining: 0 };
  }

  if (dailyLimit === -1) {
    return { allowed: true, remaining: -1 };
  }

  // Get today's usage from ai_generations table (same as routes.ts)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from('ai_generations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', today.toISOString());

  const usedToday = count || 0;
  const remaining = dailyLimit - usedToday;

  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
  };
}

// Note: AI usage is tracked via ai_generations table inserts in routes.ts
// The ai_generation_usage table and increment_ai_usage function are deprecated

// Cancel subscription
export async function cancelSubscription(userId: string): Promise<void> {
  const subscription = await getUserSubscription(userId);

  if (!subscription?.stripe_subscription_id) {
    throw new Error('No active subscription found');
  }

  // Cancel at period end
  await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    cancel_at_period_end: true,
  });

  // Update local record
  await (supabase as any)
    .from('subscriptions')
    .update({ cancel_at_period_end: true })
    .eq('id', subscription.id);
}

// Middleware to check plan limits
type LimitType = 'pages' | 'products' | 'components' | 'ai';

async function getCurrentCount(userId: string, limitType: LimitType): Promise<number> {
  switch (limitType) {
    case 'pages': {
      const { count } = await (supabase as any)
        .from('pages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      return count || 0;
    }
    case 'products': {
      // Get count of product components across all user's pages
      const { data: pages } = await (supabase as any)
        .from('pages')
        .select('id')
        .eq('user_id', userId);

      if (!pages || pages.length === 0) return 0;

      const { count } = await (supabase as any)
        .from('page_components')
        .select('*', { count: 'exact', head: true })
        .in('page_id', pages.map((p: any) => p.id))
        .eq('type', 'product');
      return count || 0;
    }
    case 'components': {
      // This should be checked per-page, handled in route
      return 0;
    }
    case 'ai': {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await (supabase as any)
        .from('ai_generation_usage')
        .select('count')
        .eq('user_id', userId)
        .eq('date', today)
        .single();
      return data?.count || 0;
    }
    default:
      return 0;
  }
}

export function checkPlanLimitMiddleware(limitType: LimitType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const clerkId = req.headers['x-clerk-user-id'] as string;
    if (!clerkId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const limits = await getUserPlanLimits(clerkId);
      const limitKey = limitType === 'components' ? 'components_per_page' :
                       limitType === 'ai' ? 'ai_generations_per_day' : limitType;

      const limit = (limits as any)[limitKey];

      // -1 means unlimited
      if (limit === -1) {
        return next();
      }

      // For components, we need to check per-page
      if (limitType === 'components') {
        const pageId = req.params.id || req.params.pageId;
        if (pageId) {
          const { count } = await (supabase as any)
            .from('page_components')
            .select('*', { count: 'exact', head: true })
            .eq('page_id', pageId);

          if ((count || 0) >= limit) {
            return res.status(403).json({
              error: 'Limite de componentes atingido',
              limit,
              current: count,
              upgrade_url: '/#precos'
            });
          }
        }
        return next();
      }

      const currentCount = await getCurrentCount(clerkId, limitType);

      if (currentCount >= limit) {
        return res.status(403).json({
          error: `Limite de ${limitType} atingido`,
          limit,
          current: currentCount,
          upgrade_url: '/#precos'
        });
      }

      next();
    } catch (error) {
      console.error('Error checking plan limit:', error);
      return res.status(500).json({ error: 'Failed to verify plan limits' });
    }
  };
}

// Create billing portal session
export async function createBillingPortalSession(
  userId: string,
  returnUrl: string
): Promise<string> {
  const { data: user } = await (supabase as any)
    .from('users')
    .select('stripe_customer_id')
    .eq('clerk_id', userId)
    .single();

  if (!user?.stripe_customer_id) {
    throw new Error('No Stripe customer found');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: returnUrl,
  });

  return session.url;
}

// Handle webhook events
export async function handleSubscriptionWebhook(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    // Handle anonymous checkout completion
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      const setupToken = session.metadata?.setupToken;
      const planId = session.metadata?.planId;

      // Only process if this is an anonymous checkout (has setupToken)
      if (setupToken) {
        const email = session.customer_details?.email || '';
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        console.log(`[Webhook] Checkout completed for anonymous user: ${email}, plan: ${planId}`);

        // Update pending_subscription with email and Stripe IDs
        const { error } = await (supabase as any)
          .from('pending_subscriptions')
          .update({
            email,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
          })
          .eq('setup_token', setupToken)
          .eq('status', 'pending');

        if (error) {
          console.error('[Webhook] Error updating pending subscription:', error);
        } else {
          console.log(`[Webhook] Pending subscription updated, awaiting account setup`);
        }
      }
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      // Cast to any to handle Stripe API version differences
      const subscription = event.data.object as any;
      const userId = subscription.metadata?.userId;
      const planId = subscription.metadata?.planId;

      if (!userId || !planId) {
        console.error('Missing userId or planId in subscription metadata');
        return;
      }

      await (supabase as any).from('subscriptions').upsert({
        user_id: userId,
        plan_id: planId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

      // Update user's plan
      await (supabase as any)
        .from('users')
        .update({ plan: planId })
        .eq('clerk_id', userId);

      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any;
      const userId = subscription.metadata?.userId;

      if (!userId) return;

      await (supabase as any)
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', subscription.id);

      // Downgrade to free
      await (supabase as any)
        .from('users')
        .update({ plan: 'free' })
        .eq('clerk_id', userId);

      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as any;
      const subscriptionId = invoice.subscription;

      if (subscriptionId) {
        await (supabase as any)
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', subscriptionId);
      }

      break;
    }
  }
}
