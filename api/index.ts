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

    // ============ DEBUG ROUTES ============
    if (path === '/api/debug/users' && method === 'GET') {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, clerk_id, email, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) return res.status(500).json({ error: 'Failed to fetch users' });
      return res.json(users || []);
    }

    if (path === '/api/debug/pages' && method === 'GET') {
      const { data: pages, error } = await supabase
        .from('pages')
        .select('id, user_id, username, profile_name, is_active, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) return res.status(500).json({ error: 'Failed to fetch pages' });
      return res.json(pages || []);
    }

    // ============ ADMIN ROUTES ============
    if (path === '/api/admin/all-pages' && method === 'GET') {
      // First get all pages
      const { data: pages, error: pagesError } = await supabase
        .from('pages')
        .select('id, user_id, username, profile_name, is_active, created_at')
        .order('created_at', { ascending: false });

      if (pagesError) return res.status(500).json({ error: 'Failed to fetch pages' });

      // Then get all users to match
      const { data: users } = await supabase
        .from('users')
        .select('id, email');

      // Create a map of user_id to email
      const userMap = new Map((users || []).map((u: any) => [u.id, u.email]));

      // Attach user emails to pages
      const pagesWithUsers = (pages || []).map((page: any) => ({
        ...page,
        users: {
          email: userMap.get(page.user_id) || 'Unknown'
        }
      }));

      return res.json(pagesWithUsers);
    }

    const transferMatch = path.match(/^\/api\/admin\/transfer-page\/(\d+)$/);
    if (transferMatch && method === 'POST') {
      const clerkId = req.headers['x-clerk-user-id'] as string;
      const { email } = req.body || {};

      if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

      const pageId = parseInt(transferMatch[1]);

      // Find current user
      let { data: user } = await supabase
        .from('users')
        .select('id, email')
        .eq('clerk_id', clerkId)
        .single();

      // If user doesn't exist, create them
      if (!user) {
        if (!email) {
          return res.status(400).json({ error: 'User not found and no email provided to create one' });
        }

        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            clerk_id: clerkId,
            email,
            username: email.split('@')[0] + '_' + Date.now(),
            password: 'clerk_managed'
          } as any)
          .select('id, email')
          .single();

        if (createError) return res.status(500).json({ error: 'Failed to create user' });
        user = newUser;
      }

      // Transfer page ownership
      const { data: page, error } = await supabase
        .from('pages')
        .update({ user_id: user.id })
        .eq('id', pageId)
        .select()
        .single();

      if (error) return res.status(500).json({ error: 'Failed to transfer page' });
      return res.json({ success: true, page });
    }

    // ============ PAGES API (New Page Builder) ============
    if (path === '/api/pages' && method === 'GET') {
      const clerkId = req.headers['x-clerk-user-id'] as string;
      if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

      // Find user by clerk_id
      let { data: user } = await supabase
        .from('users')
        .select('id, email')
        .eq('clerk_id', clerkId)
        .single();

      // If user doesn't exist, return empty array
      if (!user) return res.json([]);

      // Get user's pages
      const { data: pages, error } = await supabase
        .from('pages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) return res.status(500).json({ error: 'Failed to fetch pages' });
      return res.json(pages || []);
    }

    if (path === '/api/pages' && method === 'POST') {
      const clerkId = req.headers['x-clerk-user-id'] as string;
      if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

      const { username, profile_name } = req.body;
      if (!username) return res.status(400).json({ error: 'Username is required' });

      // Find user
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkId)
        .single();

      if (!user) return res.status(404).json({ error: 'User not found' });

      // Check page limit (max 3)
      const { count } = await supabase
        .from('pages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (count && count >= 3) {
        return res.status(400).json({ error: 'Maximum pages limit reached (3)' });
      }

      // Check username availability
      const { data: existingPage } = await supabase
        .from('pages')
        .select('id')
        .eq('username', username.toLowerCase())
        .single();

      if (existingPage) return res.status(400).json({ message: 'Username already taken' });

      // Create page
      const { data: page, error } = await supabase
        .from('pages')
        .insert({
          user_id: user.id,
          username: username.toLowerCase(),
          profile_name: profile_name || 'Minha Página',
        })
        .select()
        .single();

      if (error) return res.status(500).json({ error: 'Failed to create page' });
      return res.json(page);
    }

    // Get single page by ID
    const pageIdMatch = path.match(/^\/api\/pages\/(\d+)$/);
    if (pageIdMatch && method === 'GET') {
      const clerkId = req.headers['x-clerk-user-id'] as string;
      const pageId = parseInt(pageIdMatch[1]);

      const { data: page, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('id', pageId)
        .single();

      if (pageError || !page) return res.status(404).json({ error: 'Page not found' });

      // Check ownership if clerkId provided
      if (clerkId) {
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_id', clerkId)
          .single();

        if (user && page.user_id !== user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }
      }

      // Get page components
      const { data: components } = await supabase
        .from('page_components')
        .select('*')
        .eq('page_id', pageId)
        .order('order_index', { ascending: true });

      return res.json({ ...page, components: components || [] });
    }

    // Update page by ID
    if (pageIdMatch && method === 'PATCH') {
      const clerkId = req.headers['x-clerk-user-id'] as string;
      if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

      const pageId = parseInt(pageIdMatch[1]);

      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkId)
        .single();

      if (!user) return res.status(404).json({ error: 'User not found' });

      const { data: page, error } = await supabase
        .from('pages')
        .update({ ...req.body, updated_at: new Date().toISOString() })
        .eq('id', pageId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) return res.status(500).json({ error: 'Failed to update page' });
      return res.json(page);
    }

    // Delete page by ID
    if (pageIdMatch && method === 'DELETE') {
      const clerkId = req.headers['x-clerk-user-id'] as string;
      if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

      const pageId = parseInt(pageIdMatch[1]);

      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkId)
        .single();

      if (!user) return res.status(404).json({ error: 'User not found' });

      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId)
        .eq('user_id', user.id);

      if (error) return res.status(500).json({ error: 'Failed to delete page' });
      return res.json({ success: true });
    }

    // Get page by username (public)
    const pageUsernameMatch = path.match(/^\/api\/pages\/username\/([^/]+)$/);
    if (pageUsernameMatch && method === 'GET') {
      const username = pageUsernameMatch[1];

      // Try to get page from new pages table first
      const { data: page, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('is_active', true)
        .single();

      if (page && !pageError) {
        // Increment views
        await supabase
          .from('pages')
          .update({ views: (page.views || 0) + 1 })
          .eq('id', page.id);

        // Get page components
        const { data: components } = await supabase
          .from('page_components')
          .select('*')
          .eq('page_id', page.id)
          .eq('is_visible', true)
          .order('order_index', { ascending: true });

        return res.json({ ...page, components: components || [] });
      }

      // Fallback: try stores table for backward compatibility
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('username', username.toLowerCase())
        .single();

      if (storeError || !store) {
        return res.status(404).json({ error: 'Page not found' });
      }

      // Convert store to page format
      const storeAsPage = {
        id: store.id,
        user_id: store.user_id,
        username: store.username,
        profile_name: store.profile_name,
        profile_bio: store.profile_bio,
        profile_image: store.profile_image,
        profile_image_scale: store.profile_image_scale,
        whatsapp_number: store.whatsapp_number,
        whatsapp_message: store.whatsapp_message,
        background_type: store.theme || 'gradient',
        background_value: 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)',
        views: 0,
        is_active: true,
        created_at: store.created_at,
        updated_at: store.updated_at,
        components: [] as any[],
      };

      // Convert store products to product components
      const products = (store.products as any[]) || [];
      products.forEach((product: any, index: number) => {
        storeAsPage.components.push({
          id: index + 1000,
          page_id: store.id,
          type: 'product',
          order_index: index,
          config: {
            title: product.title,
            description: product.description,
            image: product.image,
            imageScale: product.imageScale || 100,
            discountPercent: product.discountPercent || store.discount_percent || 0,
            kits: product.kits || [],
          },
          is_visible: true,
        });
      });

      // Add video component if exists
      if (store.video_url && store.show_video) {
        storeAsPage.components.unshift({
          id: 999,
          page_id: store.id,
          type: 'video',
          order_index: -1,
          config: {
            url: store.video_url,
            thumbnail: null,
            title: '',
            showTitle: false,
          },
          is_visible: true,
        });
      }

      // Sort components by order_index
      storeAsPage.components.sort((a, b) => a.order_index - b.order_index);

      return res.json(storeAsPage);
    }

    // ============ PAGE COMPONENTS API ============
    const componentsMatch = path.match(/^\/api\/pages\/(\d+)\/components$/);
    if (componentsMatch && method === 'POST') {
      const clerkId = req.headers['x-clerk-user-id'] as string;
      if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

      const pageId = parseInt(componentsMatch[1]);
      const { type, config } = req.body;

      // Verify ownership
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkId)
        .single();

      if (!user) return res.status(404).json({ error: 'User not found' });

      const { data: page } = await supabase
        .from('pages')
        .select('id')
        .eq('id', pageId)
        .eq('user_id', user.id)
        .single();

      if (!page) return res.status(403).json({ error: 'Access denied' });

      // Get max order_index
      const { data: lastComponent } = await supabase
        .from('page_components')
        .select('order_index')
        .eq('page_id', pageId)
        .order('order_index', { ascending: false })
        .limit(1)
        .single();

      const nextOrder = (lastComponent?.order_index ?? -1) + 1;

      // Create component
      const { data: component, error } = await supabase
        .from('page_components')
        .insert({
          page_id: pageId,
          type,
          order_index: nextOrder,
          config: config || {},
        })
        .select()
        .single();

      if (error) return res.status(500).json({ error: 'Failed to create component' });
      return res.json(component);
    }

    // Reorder components
    const reorderMatch = path.match(/^\/api\/pages\/(\d+)\/reorder$/);
    if (reorderMatch && method === 'POST') {
      const clerkId = req.headers['x-clerk-user-id'] as string;
      if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

      const pageId = parseInt(reorderMatch[1]);
      const { componentIds } = req.body;

      if (!Array.isArray(componentIds)) {
        return res.status(400).json({ error: 'componentIds must be an array' });
      }

      // Update each component's order_index
      for (let i = 0; i < componentIds.length; i++) {
        await supabase
          .from('page_components')
          .update({ order_index: i })
          .eq('id', componentIds[i])
          .eq('page_id', pageId);
      }

      return res.json({ success: true });
    }

    // Update component
    const componentMatch = path.match(/^\/api\/components\/(\d+)$/);
    if (componentMatch && method === 'PATCH') {
      const clerkId = req.headers['x-clerk-user-id'] as string;
      if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

      const componentId = parseInt(componentMatch[1]);

      const { data: component, error } = await supabase
        .from('page_components')
        .update({ ...req.body, updated_at: new Date().toISOString() })
        .eq('id', componentId)
        .select()
        .single();

      if (error) return res.status(500).json({ error: 'Failed to update component' });
      return res.json(component);
    }

    // Delete component
    if (componentMatch && method === 'DELETE') {
      const clerkId = req.headers['x-clerk-user-id'] as string;
      if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

      const componentId = parseInt(componentMatch[1]);

      const { error } = await supabase
        .from('page_components')
        .delete()
        .eq('id', componentId);

      if (error) return res.status(500).json({ error: 'Failed to delete component' });
      return res.json({ success: true });
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
