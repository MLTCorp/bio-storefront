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
    // ============ OG META TAGS FOR CRAWLERS ============
    const ogMatch = path.match(/^\/api\/og\/([^/]+)$/);
    if (ogMatch && method === 'GET') {
      const username = ogMatch[1].toLowerCase();

      // Try pages table first
      let pageData: any = null;
      const { data: page } = await supabase
        .from('pages')
        .select('profile_name, profile_bio, profile_image')
        .eq('username', username)
        .eq('is_active', true)
        .single();

      if (page) {
        pageData = page;
      } else {
        // Fallback to stores table
        const { data: store } = await supabase
          .from('stores')
          .select('profile_name, profile_bio, profile_image')
          .eq('username', username)
          .eq('is_active', true)
          .single();

        if (store) {
          pageData = store;
        }
      }

      if (!pageData) {
        return res.status(404).json({ error: 'Page not found' });
      }

      // Escape HTML to prevent XSS
      const escapeHtml = (text: string): string => {
        const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, char => map[char]);
      };

      const title = escapeHtml(`${pageData.profile_name} - Bio`);
      const description = escapeHtml(pageData.profile_bio || 'Confira meus produtos e conteúdos exclusivos.');
      const image = pageData.profile_image || 'https://biolanding.com/opengraph.jpg';
      const pageUrl = `https://biolanding.com/${username}`;

      const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${pageUrl}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta http-equiv="refresh" content="0;url=${pageUrl}" />
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <p>Redirecionando...</p>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    }

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
      // Fetch pages with user emails in a single optimized query
      const { data: pages, error: pagesError } = await supabase
        .from('pages')
        .select('id, user_id, username, profile_name, is_active, created_at')
        .order('created_at', { ascending: false });

      if (pagesError) return res.status(500).json({ error: 'Failed to fetch pages' });

      // Get only the user_ids we need (not all users)
      const userIds = [...new Set((pages || []).map((p: any) => p.user_id).filter(Boolean))];

      // Fetch only required users in parallel
      const { data: users } = userIds.length > 0
        ? await supabase
            .from('users')
            .select('id, email')
            .in('id', userIds)
        : { data: [] };

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

      // Update all components in parallel (fixes N+1 query)
      await Promise.all(
        componentIds.map((id: number, index: number) =>
          supabase
            .from('page_components')
            .update({ order_index: index })
            .eq('id', id)
            .eq('page_id', pageId)
        )
      );

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

    // ============ AI ROUTES ============
    if (path === '/api/ai/generate-image' && method === 'POST') {
      const clerkId = req.headers['x-clerk-user-id'] as string;
      if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

      const { type, prompt, referenceImage, personImage } = req.body;

      if (!type || !prompt) {
        return res.status(400).json({ error: 'Type and prompt are required' });
      }

      if (!['profile', 'product', 'thumbnail'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
      }

      // Find user
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkId)
        .single();

      if (!user) return res.status(404).json({ error: 'User not found' });

      // Check daily limit (30 per day)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from('ai_generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id.toString())
        .gte('created_at', today.toISOString());

      const usedToday = count || 0;
      const remaining = 30 - usedToday;

      if (remaining <= 0) {
        return res.status(429).json({
          error: 'Limite diário atingido. Tente novamente amanhã.',
          remaining: 0
        });
      }

      // Prepare dimensions based on type
      const dimensions = type === 'thumbnail'
        ? '1280x720 (16:9 aspect ratio)'
        : '512x512 (square)';

      // Build prompt based on type and available images
      let enhancedPrompt = '';
      const hasDualImages = (type === 'product' || type === 'thumbnail') && personImage && referenceImage;

      if (type === 'profile') {
        enhancedPrompt = `Generate a professional portrait/headshot image: ${prompt}. The image should be ${dimensions}. Make it professional and high quality.`;
        if (referenceImage) {
          enhancedPrompt += ' Use the provided photo as a reference for the person\'s appearance and likeness.';
        }
      } else if (type === 'product') {
        if (hasDualImages) {
          enhancedPrompt = `Generate a professional product image: ${prompt}. The image should be ${dimensions}. Combine the person from the first reference photo with the product from the second photo to create an engaging product showcase where the person is holding, using, or presenting the product.`;
        } else {
          enhancedPrompt = `Generate a professional product image: ${prompt}. The image should be ${dimensions}. Make it professional and high quality.`;
          if (referenceImage) {
            enhancedPrompt += ' Use the provided product photo as reference.';
          }
        }
      } else if (type === 'thumbnail') {
        if (hasDualImages) {
          enhancedPrompt = `Generate a video thumbnail image: ${prompt}. The image should be ${dimensions}. Create an eye-catching YouTube-style thumbnail featuring the person from the first photo presenting or using the product from the second photo. Make it vibrant, professional, and click-worthy.`;
        } else {
          enhancedPrompt = `Generate a video thumbnail image: ${prompt}. The image should be ${dimensions}. Make it eye-catching and professional.`;
          if (referenceImage) {
            enhancedPrompt += ' Use the provided image as reference.';
          }
        }
      }

      // Build messages for OpenRouter
      const messages: any[] = [];
      const messageContent: any[] = [
        {
          type: 'text',
          text: enhancedPrompt
        }
      ];

      // Add person image first (if provided for dual upload types)
      if (personImage && (type === 'product' || type === 'thumbnail')) {
        messageContent.push({
          type: 'image_url',
          image_url: {
            url: personImage.startsWith('data:')
              ? personImage
              : `data:image/jpeg;base64,${personImage}`
          }
        });
      }

      // Add reference/product image if provided
      if (referenceImage) {
        messageContent.push({
          type: 'image_url',
          image_url: {
            url: referenceImage.startsWith('data:')
              ? referenceImage
              : `data:image/jpeg;base64,${referenceImage}`
          }
        });
      }

      messages.push({
        role: 'user',
        content: messageContent
      });

      // Call OpenRouter API with Gemini 3 Pro Image
      const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://bio-storefront.com',
          'X-Title': 'Bio-Storefront'
        },
        body: JSON.stringify({
          model: 'google/gemini-3-pro-image-preview',
          messages,
          modalities: ['image', 'text']
        })
      });

      if (!openRouterResponse.ok) {
        const errorText = await openRouterResponse.text();
        console.error('OpenRouter error:', errorText);
        return res.status(500).json({ error: 'Falha ao gerar imagem. Tente novamente.' });
      }

      const aiResult = await openRouterResponse.json();
      console.log('Full AI Response:', JSON.stringify(aiResult, null, 2));

      // Extract image URL from response
      let generatedImageUrl: string | null = null;
      const message = aiResult.choices?.[0]?.message;
      const content = message?.content;

      // Check for images array in message
      if (Array.isArray(message?.images) && message.images.length > 0) {
        const firstImage = message.images[0];
        if (firstImage?.image_url?.url) {
          generatedImageUrl = firstImage.image_url.url;
        } else if (firstImage?.url) {
          generatedImageUrl = firstImage.url;
        }
      }

      // Check for multipart response with image
      if (!generatedImageUrl && Array.isArray(content)) {
        for (const part of content) {
          if (part.type === 'image_url' && part.image_url?.url) {
            generatedImageUrl = part.image_url.url;
            break;
          }
          if (part.inline_data?.data) {
            generatedImageUrl = `data:${part.inline_data.mime_type || 'image/png'};base64,${part.inline_data.data}`;
            break;
          }
        }
      }

      // Check if content is string with image URL or base64
      if (!generatedImageUrl && typeof content === 'string' && content) {
        const urlMatch = content.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
        if (urlMatch) {
          generatedImageUrl = urlMatch[1];
        }
        const base64Match = content.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/);
        if (base64Match) {
          generatedImageUrl = base64Match[0];
        }
        const anyUrlMatch = content.match(/(https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp)[^\s"'<>]*)/i);
        if (anyUrlMatch) {
          generatedImageUrl = anyUrlMatch[1];
        }
      }

      // Check for image_url in the message itself
      if (!generatedImageUrl && message?.image_url) {
        generatedImageUrl = message.image_url;
      }

      // Record generation in database
      await supabase
        .from('ai_generations')
        .insert({
          user_id: user.id.toString(),
          type,
          prompt,
          reference_image_url: referenceImage ? 'provided' : null,
          generated_image_url: generatedImageUrl
        });

      return res.json({
        imageUrl: generatedImageUrl,
        remaining: remaining - 1,
        rawResponse: generatedImageUrl ? undefined : content
      });
    }

    if (path === '/api/ai/improve-prompt' && method === 'POST') {
      const clerkId = req.headers['x-clerk-user-id'] as string;
      if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

      const { prompt, type } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const typeContext = type === 'profile'
        ? 'portrait/headshot photo'
        : type === 'product'
          ? 'product photography'
          : 'video thumbnail';

      // Call OpenRouter with a fast/cheap model
      const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://bio-storefront.com',
          'X-Title': 'Bio-Storefront'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: `You are an expert at writing prompts for AI image generation. Improve the user's prompt to be more detailed and effective for generating a ${typeContext}. Focus on:
- Lighting and composition
- Style and mood
- Specific visual details
- Professional quality indicators

Respond ONLY with the improved prompt in English, no explanations or additional text.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500
        })
      });

      if (!openRouterResponse.ok) {
        const errorText = await openRouterResponse.text();
        console.error('OpenRouter error:', errorText);
        return res.status(500).json({ error: 'Falha ao melhorar prompt' });
      }

      const result = await openRouterResponse.json();
      const improvedPrompt = result.choices?.[0]?.message?.content?.trim();

      if (!improvedPrompt) {
        return res.status(500).json({ error: 'No response from AI' });
      }

      return res.json({ improvedPrompt });
    }

    // ============ ANALYTICS ROUTES ============

    // Helper function to detect device type
    const detectDevice = (userAgent: string): string => {
      if (!userAgent) return 'unknown';
      const ua = userAgent.toLowerCase();
      if (/mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(ua)) {
        if (/ipad|tablet/i.test(ua)) return 'tablet';
        return 'mobile';
      }
      return 'desktop';
    };

    // Helper to get start date based on period
    const getStartDate = (period: string): string => {
      const now = new Date();
      switch (period) {
        case '1d':
          now.setDate(now.getDate() - 1);
          break;
        case '7d':
          now.setDate(now.getDate() - 7);
          break;
        case '30d':
          now.setDate(now.getDate() - 30);
          break;
        default:
          now.setDate(now.getDate() - 7);
      }
      return now.toISOString();
    };

    // POST /api/analytics/view - Track page view
    if (path === '/api/analytics/view' && method === 'POST') {
      const { pageId, referrer, userAgent } = req.body;

      if (!pageId) {
        return res.status(400).json({ error: 'pageId is required' });
      }

      const deviceType = detectDevice(userAgent || '');

      // Insert view record
      await supabase.from('page_views').insert({
        page_id: pageId,
        referrer: referrer || null,
        user_agent: userAgent || null,
        device_type: deviceType
      });

      // Also increment the views counter on pages table (for quick access)
      const { data: page } = await supabase
        .from('pages')
        .select('views')
        .eq('id', pageId)
        .single();

      if (page) {
        await supabase
          .from('pages')
          .update({ views: (page.views || 0) + 1 })
          .eq('id', pageId);
      }

      return res.json({ ok: true });
    }

    // POST /api/analytics/click - Track component click
    if (path === '/api/analytics/click' && method === 'POST') {
      const { pageId, componentId, componentType, componentLabel, targetUrl } = req.body;

      if (!pageId || !componentType) {
        return res.status(400).json({ error: 'pageId and componentType are required' });
      }

      // Insert click record
      await supabase.from('component_clicks').insert({
        page_id: pageId,
        component_id: componentId || null,
        component_type: componentType,
        component_label: componentLabel || null,
        target_url: targetUrl || null
      });

      // Also increment the clicks counter on pages table (for quick access)
      const { data: page } = await supabase
        .from('pages')
        .select('clicks')
        .eq('id', pageId)
        .single();

      if (page) {
        await supabase
          .from('pages')
          .update({ clicks: (page.clicks || 0) + 1 })
          .eq('id', pageId);
      }

      return res.json({ ok: true });
    }

    // GET /api/analytics/:pageId - Get detailed analytics
    const analyticsMatch = path.match(/^\/api\/analytics\/(\d+)$/);
    if (analyticsMatch && method === 'GET') {
      const clerkId = req.headers['x-clerk-user-id'] as string;
      if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

      const pageId = parseInt(analyticsMatch[1]);
      const period = (req.query?.period as string) || '7d';
      const startDate = getStartDate(period);

      // Verify ownership
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkId)
        .single();

      if (!user) return res.status(404).json({ error: 'User not found' });

      const { data: page } = await supabase
        .from('pages')
        .select('id, user_id, views, clicks')
        .eq('id', pageId)
        .single();

      if (!page) return res.status(404).json({ error: 'Page not found' });
      if (page.user_id !== user.id) return res.status(403).json({ error: 'Access denied' });

      // Get views in period
      const { data: views } = await supabase
        .from('page_views')
        .select('viewed_at, device_type, referrer')
        .eq('page_id', pageId)
        .gte('viewed_at', startDate)
        .order('viewed_at', { ascending: true });

      // Get clicks in period
      const { data: clicks } = await supabase
        .from('component_clicks')
        .select('clicked_at, component_type, component_label, target_url')
        .eq('page_id', pageId)
        .gte('clicked_at', startDate)
        .order('clicked_at', { ascending: true });

      // Aggregate views by day
      const viewsByDay: Record<string, number> = {};
      (views || []).forEach((v: any) => {
        const day = v.viewed_at.split('T')[0];
        viewsByDay[day] = (viewsByDay[day] || 0) + 1;
      });

      // Aggregate clicks by day
      const clicksByDay: Record<string, number> = {};
      (clicks || []).forEach((c: any) => {
        const day = c.clicked_at.split('T')[0];
        clicksByDay[day] = (clicksByDay[day] || 0) + 1;
      });

      // Aggregate by device
      const deviceStats: Record<string, number> = {};
      (views || []).forEach((v: any) => {
        const device = v.device_type || 'unknown';
        deviceStats[device] = (deviceStats[device] || 0) + 1;
      });

      // Top components clicked
      const componentStats: Record<string, { count: number; label: string; type: string }> = {};
      (clicks || []).forEach((c: any) => {
        const key = c.component_label || c.component_type;
        if (!componentStats[key]) {
          componentStats[key] = { count: 0, label: c.component_label || c.component_type, type: c.component_type };
        }
        componentStats[key].count++;
      });

      const topComponents = Object.values(componentStats)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Generate chart data (last N days)
      const chartData: Array<{ date: string; views: number; clicks: number }> = [];
      const days = period === '1d' ? 1 : period === '7d' ? 7 : 30;
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        chartData.push({
          date: dateStr,
          views: viewsByDay[dateStr] || 0,
          clicks: clicksByDay[dateStr] || 0
        });
      }

      const totalViews = (views || []).length;
      const totalClicks = (clicks || []).length;
      const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0';

      return res.json({
        totalViews,
        totalClicks,
        ctr: parseFloat(ctr),
        chartData,
        deviceStats,
        topComponents,
        period
      });
    }

    // GET /api/analytics/:pageId/summary - Get quick summary for listing
    const analyticsSummaryMatch = path.match(/^\/api\/analytics\/(\d+)\/summary$/);
    if (analyticsSummaryMatch && method === 'GET') {
      const pageId = parseInt(analyticsSummaryMatch[1]);

      // Get views/clicks from last 7 days
      const startDate = getStartDate('7d');

      const { count: viewsCount } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .eq('page_id', pageId)
        .gte('viewed_at', startDate);

      const { count: clicksCount } = await supabase
        .from('component_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('page_id', pageId)
        .gte('clicked_at', startDate);

      return res.json({
        views7d: viewsCount || 0,
        clicks7d: clicksCount || 0
      });
    }

    // 404 for unmatched routes
    return res.status(404).json({ error: 'Not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
