import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-05-28.basil' })
  : null;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-clerk-user-id',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  const { url, method } = req;
  const path = url?.replace(/\?.*$/, '') || '';

  try {
    // ============ CONFIG ROUTES ============
    if (path === '/api/config' && method === 'GET') {
      const { data, error } = await supabase
        .from('bio_config')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)
        .single();

      if (error) return res.status(404).json({ error: 'Configuration not found' });
      return res.json(data);
    }

    if (path === '/api/config' && method === 'PATCH') {
      const { data: existing } = await supabase
        .from('bio_config')
        .select('id')
        .order('id', { ascending: false })
        .limit(1)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from('bio_config')
          .update({ ...req.body, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) return res.status(500).json({ error: 'Failed to update configuration' });
        return res.json(data);
      } else {
        const { data, error } = await supabase
          .from('bio_config')
          .insert(req.body)
          .select()
          .single();

        if (error) return res.status(500).json({ error: 'Failed to create configuration' });
        return res.json(data);
      }
    }

    // ============ TEMPLATES ROUTES ============
    if (path === '/api/templates' && method === 'GET') {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('is_active', true)
        .order('id');

      if (error) return res.status(500).json({ error: 'Failed to fetch templates' });
      return res.json(data);
    }

    // ============ STORES ROUTES ============
    const storeMatch = path.match(/^\/api\/stores\/([^/]+)$/);
    if (storeMatch && method === 'GET') {
      const username = storeMatch[1];
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('is_active', true)
        .single();

      if (error || !data) return res.status(404).json({ error: 'Store not found' });
      return res.json(data);
    }

    // ============ USER ROUTES ============
    if (path === '/api/user/store' && method === 'GET') {
      const clerkId = req.headers['x-clerk-user-id'] as string;
      if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkId)
        .single();

      if (!user) return res.status(404).json({ error: 'User not found', needsOnboarding: true });

      const { data: store } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!store) return res.status(404).json({ error: 'Store not found', needsOnboarding: true });
      return res.json(store);
    }

    if (path === '/api/user/store' && method === 'PATCH') {
      const clerkId = req.headers['x-clerk-user-id'] as string;
      if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkId)
        .single();

      if (!user) return res.status(404).json({ error: 'User not found' });

      const { data: store, error } = await supabase
        .from('stores')
        .update({ ...req.body, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) return res.status(500).json({ error: 'Failed to update store' });
      return res.json(store);
    }

    if (path === '/api/user/onboard' && method === 'POST') {
      const { clerkId, email, name, username, templateId } = req.body;

      if (!clerkId || !username) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if username is available
      const { data: existingStore } = await supabase
        .from('stores')
        .select('id')
        .eq('username', username.toLowerCase())
        .single();

      if (existingStore) {
        return res.status(400).json({ error: 'Username already taken' });
      }

      // Create or update user
      const { data: user, error: userError } = await supabase
        .from('users')
        .upsert({
          clerk_id: clerkId,
          email,
          name,
          username: username.toLowerCase(),
          password: 'clerk_managed',
        }, { onConflict: 'clerk_id' })
        .select()
        .single();

      if (userError) return res.status(500).json({ error: 'Failed to create user' });

      // Get template config if provided
      let storeConfig: any = {
        profile_name: name || 'Minha Loja',
        profile_bio: '',
        products: [],
        links: [],
      };

      if (templateId) {
        const { data: template } = await supabase
          .from('templates')
          .select('config')
          .eq('id', templateId)
          .single();

        if (template) {
          storeConfig = template.config;
          storeConfig.profile_name = name || storeConfig.profile_name;
        }
      }

      // Create store
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .insert({
          user_id: user.id,
          username: username.toLowerCase(),
          ...storeConfig,
        })
        .select()
        .single();

      if (storeError) return res.status(500).json({ error: 'Failed to create store' });
      return res.json({ user, store });
    }

    // ============ CHECK USERNAME ============
    const usernameMatch = path.match(/^\/api\/check-username\/([^/]+)$/);
    if (usernameMatch && method === 'GET') {
      const username = usernameMatch[1];
      const { data } = await supabase
        .from('stores')
        .select('id')
        .eq('username', username.toLowerCase())
        .single();

      return res.json({ available: !data });
    }

    // ============ STRIPE CHECKOUT ============
    if (path === '/api/checkout/create-session' && method === 'POST') {
      if (!stripe) return res.status(500).json({ error: 'Stripe not configured' });

      const { items, customerEmail } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Items are required' });
      }

      const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'https://bio-storefront.vercel.app';

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map((item: any) => ({
          price_data: {
            currency: 'brl',
            product_data: {
              name: item.name,
              images: item.image ? [item.image] : [],
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity || 1,
        })),
        mode: 'payment',
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout/cancel`,
        customer_email: customerEmail,
      });

      return res.json({ sessionId: session.id, url: session.url });
    }

    const sessionMatch = path.match(/^\/api\/checkout\/session\/([^/]+)$/);
    if (sessionMatch && method === 'GET') {
      if (!stripe) return res.status(500).json({ error: 'Stripe not configured' });

      const sessionId = sessionMatch[1];
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      return res.json({
        status: session.payment_status,
        customerEmail: session.customer_details?.email,
        amountTotal: session.amount_total,
      });
    }

    // 404 for unmatched routes
    return res.status(404).json({ error: 'Not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
