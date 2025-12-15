import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBioConfigSchema } from "@shared/schema";
import { createCheckoutSession, getCheckoutSession } from "./stripe";
import { supabase } from "./supabase";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get current bio configuration
  app.get("/api/config", async (req, res) => {
    try {
      const config = await storage.getBioConfig();
      if (!config) {
        return res.status(404).json({ error: "Configuration not found" });
      }
      res.json(config);
    } catch (error) {
      console.error("Error fetching config:", error);
      res.status(500).json({ error: "Failed to fetch configuration" });
    }
  });

  // Update bio configuration
  app.patch("/api/config", async (req, res) => {
    try {
      // Log the received products to debug discountPercent
      console.log("Received products:", JSON.stringify(req.body.products?.map((p: any) => ({ id: p.id, discountPercent: p.discountPercent }))));

      const validated = insertBioConfigSchema.parse(req.body);
      const updated = await storage.updateBioConfig(validated);
      res.json(updated);
    } catch (error) {
      console.error("Error updating config:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        res.status(400).json({ error: "Invalid configuration data" });
      } else {
        res.status(500).json({ error: "Failed to update configuration" });
      }
    }
  });

  // Stripe Checkout - Create session
  app.post("/api/checkout/create-session", async (req, res) => {
    try {
      const { items, customerEmail } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Items are required" });
      }

      const origin = req.headers.origin || `http://localhost:${process.env.PORT || 5000}`;

      const session = await createCheckoutSession({
        items: items.map((item: any) => ({
          name: item.name,
          price: Math.round(item.price * 100), // Convert to cents
          quantity: item.quantity || 1,
          image: item.image,
        })),
        successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/checkout/cancel`,
        customerEmail,
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Stripe Checkout - Get session status
  app.get("/api/checkout/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await getCheckoutSession(sessionId);
      res.json({
        status: session.payment_status,
        customerEmail: session.customer_details?.email,
        amountTotal: session.amount_total,
      });
    } catch (error) {
      console.error("Error fetching checkout session:", error);
      res.status(500).json({ error: "Failed to fetch checkout session" });
    }
  });

  // ============ TEMPLATES API ============

  // Get all templates
  app.get("/api/templates", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("is_active", true)
        .order("id");

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  // ============ STORES API ============

  // Get store by username (public)
  app.get("/api/stores/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("username", username.toLowerCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: "Store not found" });
      }
      res.json(data);
    } catch (error) {
      console.error("Error fetching store:", error);
      res.status(500).json({ error: "Failed to fetch store" });
    }
  });

  // Get user's store by clerk_id
  app.get("/api/user/store", async (req, res) => {
    try {
      const clerkId = req.headers["x-clerk-user-id"] as string;
      if (!clerkId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // First find user by clerk_id
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId)
        .single();

      if (!user) {
        return res.status(404).json({ error: "User not found", needsOnboarding: true });
      }

      // Then find their store
      const { data: store } = await supabase
        .from("stores")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!store) {
        return res.status(404).json({ error: "Store not found", needsOnboarding: true });
      }

      res.json(store);
    } catch (error) {
      console.error("Error fetching user store:", error);
      res.status(500).json({ error: "Failed to fetch store" });
    }
  });

  // Create user and store (onboarding)
  app.post("/api/user/onboard", async (req, res) => {
    try {
      const { clerkId, email, name, username, templateId } = req.body;

      if (!clerkId || !username) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if username is available
      const { data: existingStore } = await supabase
        .from("stores")
        .select("id")
        .eq("username", username.toLowerCase())
        .single();

      if (existingStore) {
        return res.status(400).json({ error: "Username already taken" });
      }

      // Create or update user
      const { data: user, error: userError } = await supabase
        .from("users")
        .upsert({
          clerk_id: clerkId,
          email,
          name,
          username: username.toLowerCase(),
          password: "clerk_managed", // Placeholder - auth is handled by Clerk
        }, { onConflict: "clerk_id" })
        .select()
        .single();

      if (userError) throw userError;

      // Get template config if provided
      let storeConfig: any = {
        profile_name: name || "Minha Loja",
        profile_bio: "",
        products: [],
      };

      if (templateId) {
        const { data: template } = await supabase
          .from("templates")
          .select("config")
          .eq("id", templateId)
          .single();

        if (template) {
          storeConfig = template.config;
          storeConfig.profile_name = name || storeConfig.profile_name;
        }
      }

      // Create store
      const { data: store, error: storeError } = await supabase
        .from("stores")
        .insert({
          user_id: user.id,
          username: username.toLowerCase(),
          ...storeConfig,
        })
        .select()
        .single();

      if (storeError) throw storeError;

      res.json({ user, store });
    } catch (error) {
      console.error("Error in onboarding:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  // Update user's store
  app.patch("/api/user/store", async (req, res) => {
    try {
      const clerkId = req.headers["x-clerk-user-id"] as string;
      if (!clerkId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Find user
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId)
        .single();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update store
      const { data: store, error } = await supabase
        .from("stores")
        .update({
          ...req.body,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      res.json(store);
    } catch (error) {
      console.error("Error updating store:", error);
      res.status(500).json({ error: "Failed to update store" });
    }
  });

  // Debug: List all stores
  app.get("/api/debug/stores", async (req, res) => {
    try {
      const { data: stores, error } = await supabase
        .from("stores")
        .select("id, username, profile_name, is_active")
        .limit(20);

      if (error) throw error;
      res.json(stores || []);
    } catch (error) {
      console.error("Debug error:", error);
      res.status(500).json({ error: "Failed to fetch stores" });
    }
  });

  // Debug: List all pages
  app.get("/api/debug/pages", async (req, res) => {
    try {
      const { data: pages, error } = await supabase
        .from("pages")
        .select("id, user_id, username, profile_name, is_active, created_at")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      res.json(pages || []);
    } catch (error) {
      console.error("Debug error:", error);
      res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  // Debug: List all users
  app.get("/api/debug/users", async (req, res) => {
    try {
      const { data: users, error } = await supabase
        .from("users")
        .select("id, clerk_id, email, created_at")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      res.json(users || []);
    } catch (error) {
      console.error("Debug error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Admin: Transfer page ownership to current user
  app.post("/api/admin/transfer-page/:pageId", async (req, res) => {
    try {
      const clerkId = req.headers["x-clerk-user-id"] as string;
      const { email } = req.body || {};

      if (!clerkId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const pageId = parseInt(req.params.pageId);

      // Find current user
      let { data: user } = await supabase
        .from("users")
        .select("id, email")
        .eq("clerk_id", clerkId)
        .single();

      // If user doesn't exist, create them
      if (!user) {
        if (!email) {
          return res.status(400).json({ error: "User not found and no email provided to create one" });
        }

        console.log(`Creating new user for clerk_id: ${clerkId}, email: ${email}`);
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert({
            clerk_id: clerkId,
            email,
            username: email.split('@')[0] + '_' + Date.now(),
            password: 'clerk_managed'
          } as any)
          .select("id, email")
          .single();

        if (createError) throw createError;
        user = newUser;
        console.log(`Created new user: ${email}`);
      }

      // Transfer page ownership
      const { data: page, error } = await supabase
        .from("pages")
        .update({ user_id: user.id })
        .eq("id", pageId)
        .select()
        .single();

      if (error) throw error;

      console.log(`Page ${pageId} transferred to user ${user.email}`);
      res.json({ success: true, page });
    } catch (error) {
      console.error("Transfer error:", error);
      res.status(500).json({ error: "Failed to transfer page" });
    }
  });

  // Admin: List all pages (without user filter)
  app.get("/api/admin/all-pages", async (req, res) => {
    try {
      console.log("[admin/all-pages] Fetching all pages...");

      // First get all pages
      const { data: pages, error: pagesError } = await supabase
        .from("pages")
        .select("id, user_id, username, profile_name, is_active, created_at")
        .order("created_at", { ascending: false });

      if (pagesError) {
        console.error("[admin/all-pages] Pages error:", pagesError);
        throw pagesError;
      }

      console.log(`[admin/all-pages] Found ${pages?.length || 0} pages`);

      // Then get all users to match
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, email");

      if (usersError) {
        console.error("[admin/all-pages] Users error:", usersError);
      }

      console.log(`[admin/all-pages] Found ${users?.length || 0} users`);

      // Create a map of user_id to email
      const userMap = new Map((users || []).map(u => [u.id, u.email]));

      // Attach user emails to pages
      const pagesWithUsers = (pages || []).map(page => ({
        ...page,
        users: {
          email: userMap.get(page.user_id) || "Unknown"
        }
      }));

      res.json(pagesWithUsers);
    } catch (error) {
      console.error("Admin error:", error);
      res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  // Check username availability
  app.get("/api/check-username/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const { data } = await supabase
        .from("stores")
        .select("id")
        .eq("username", username.toLowerCase())
        .single();

      res.json({ available: !data });
    } catch (error) {
      res.json({ available: true });
    }
  });

  // ============ PAGES API (New Page Builder) ============

  // Get all user's pages
  app.get("/api/pages", async (req, res) => {
    try {
      const clerkId = req.headers["x-clerk-user-id"] as string;
      console.log(`[GET /api/pages] clerk_id: ${clerkId}`);

      if (!clerkId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Find user by clerk_id
      let { data: user } = await supabase
        .from("users")
        .select("id, email")
        .eq("clerk_id", clerkId)
        .single();

      // If user doesn't exist, return empty array (user just needs to create their first page)
      if (!user) {
        console.log(`[GET /api/pages] User not found for clerk_id: ${clerkId} - returning empty array`);
        return res.json([]);
      }

      console.log(`[GET /api/pages] Found user: ${user.email} (${user.id})`);

      // Get user's pages
      const { data: pages, error } = await supabase
        .from("pages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      console.log(`[GET /api/pages] Found ${pages?.length || 0} pages for user ${user.email}`);
      res.json(pages || []);
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  // Get single page with components
  app.get("/api/pages/:pageId", async (req, res) => {
    try {
      const clerkId = req.headers["x-clerk-user-id"] as string;
      const pageId = parseInt(req.params.pageId);

      // Get page
      const { data: page, error: pageError } = await supabase
        .from("pages")
        .select("*")
        .eq("id", pageId)
        .single();

      if (pageError || !page) {
        return res.status(404).json({ error: "Page not found" });
      }

      // Check ownership if clerkId provided
      if (clerkId) {
        const { data: user } = await supabase
          .from("users")
          .select("id")
          .eq("clerk_id", clerkId)
          .single();

        if (user && page.user_id !== user.id) {
          return res.status(403).json({ error: "Access denied" });
        }
      }

      // Get page components
      const { data: components, error: compError } = await supabase
        .from("page_components")
        .select("*")
        .eq("page_id", pageId)
        .order("order_index", { ascending: true });

      if (compError) throw compError;

      res.json({
        ...page,
        components: components || [],
      });
    } catch (error) {
      console.error("Error fetching page:", error);
      res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  // Get page by username (public)
  app.get("/api/pages/username/:username", async (req, res) => {
    try {
      const { username } = req.params;

      // Try to get page from new pages table first
      const { data: page, error: pageError } = await supabase
        .from("pages")
        .select("*")
        .eq("username", username.toLowerCase())
        .eq("is_active", true)
        .single();

      if (page && !pageError) {
        // Increment views
        await supabase
          .from("pages")
          .update({ views: (page.views || 0) + 1 })
          .eq("id", page.id);

        // Get page components
        const { data: components } = await supabase
          .from("page_components")
          .select("*")
          .eq("page_id", page.id)
          .eq("is_visible", true)
          .order("order_index", { ascending: true });

        return res.json({
          ...page,
          components: components || [],
        });
      }

      // Fallback: try stores table for backward compatibility
      const { data: store, error: storeError } = await supabase
        .from("stores")
        .select("*")
        .eq("username", username.toLowerCase())
        .single();

      if (storeError || !store) {
        return res.status(404).json({ error: "Page not found" });
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
        font_family: null,
        views: 0,
        is_active: true,
        created_at: store.created_at,
        updated_at: store.updated_at,
        components: [] as any[],
      };

      // Convert store products to product components
      const products = store.products as any[] || [];
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

      // Add social links if exists
      const links = store.links as any[] || [];
      if (links.length > 0) {
        storeAsPage.components.unshift({
          id: 998,
          page_id: store.id,
          type: 'social',
          order_index: -2,
          config: {
            links: links.map((l: any) => ({
              id: l.id,
              platform: l.icon || 'custom',
              url: l.url,
              label: l.label,
            })),
          },
          is_visible: true,
        });
      }

      // Sort components by order_index
      storeAsPage.components.sort((a, b) => a.order_index - b.order_index);

      res.json(storeAsPage);
    } catch (error) {
      console.error("Error fetching page:", error);
      res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  // Create new page
  app.post("/api/pages", async (req, res) => {
    try {
      const clerkId = req.headers["x-clerk-user-id"] as string;
      if (!clerkId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { username, profile_name } = req.body;

      if (!username) {
        return res.status(400).json({ error: "Username is required" });
      }

      // Find user
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId)
        .single();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check page limit (max 3)
      const { count } = await supabase
        .from("pages")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (count && count >= 3) {
        return res.status(400).json({ error: "Maximum pages limit reached (3)" });
      }

      // Check username availability
      const { data: existingPage } = await supabase
        .from("pages")
        .select("id")
        .eq("username", username.toLowerCase())
        .single();

      if (existingPage) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Also check stores table for backwards compatibility
      const { data: existingStore } = await supabase
        .from("stores")
        .select("id")
        .eq("username", username.toLowerCase())
        .single();

      if (existingStore) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Create page
      const { data: page, error } = await supabase
        .from("pages")
        .insert({
          user_id: user.id,
          username: username.toLowerCase(),
          profile_name: profile_name || "Minha Página",
        })
        .select()
        .single();

      if (error) throw error;
      res.json(page);
    } catch (error) {
      console.error("Error creating page:", error);
      res.status(500).json({ error: "Failed to create page" });
    }
  });

  // Update page
  app.patch("/api/pages/:pageId", async (req, res) => {
    try {
      const clerkId = req.headers["x-clerk-user-id"] as string;
      if (!clerkId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const pageId = parseInt(req.params.pageId);

      // Find user
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId)
        .single();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update page
      const { data: page, error } = await supabase
        .from("pages")
        .update({
          ...req.body,
          updated_at: new Date().toISOString(),
        })
        .eq("id", pageId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      res.json(page);
    } catch (error) {
      console.error("Error updating page:", error);
      res.status(500).json({ error: "Failed to update page" });
    }
  });

  // Delete page
  app.delete("/api/pages/:pageId", async (req, res) => {
    try {
      const clerkId = req.headers["x-clerk-user-id"] as string;
      if (!clerkId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const pageId = parseInt(req.params.pageId);

      // Find user
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId)
        .single();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Delete page (components will cascade)
      const { error } = await supabase
        .from("pages")
        .delete()
        .eq("id", pageId)
        .eq("user_id", user.id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting page:", error);
      res.status(500).json({ error: "Failed to delete page" });
    }
  });

  // ============ PAGE COMPONENTS API ============

  // Add component to page
  app.post("/api/pages/:pageId/components", async (req, res) => {
    try {
      const clerkId = req.headers["x-clerk-user-id"] as string;
      if (!clerkId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const pageId = parseInt(req.params.pageId);
      const { type, config } = req.body;

      // Verify ownership
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId)
        .single();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { data: page } = await supabase
        .from("pages")
        .select("id")
        .eq("id", pageId)
        .eq("user_id", user.id)
        .single();

      if (!page) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Get max order_index
      const { data: lastComponent } = await supabase
        .from("page_components")
        .select("order_index")
        .eq("page_id", pageId)
        .order("order_index", { ascending: false })
        .limit(1)
        .single();

      const nextOrder = (lastComponent?.order_index ?? -1) + 1;

      // Create component
      const { data: component, error } = await supabase
        .from("page_components")
        .insert({
          page_id: pageId,
          type,
          order_index: nextOrder,
          config: config || {},
        })
        .select()
        .single();

      if (error) throw error;
      res.json(component);
    } catch (error) {
      console.error("Error creating component:", error);
      res.status(500).json({ error: "Failed to create component" });
    }
  });

  // Update component
  app.patch("/api/components/:componentId", async (req, res) => {
    try {
      const clerkId = req.headers["x-clerk-user-id"] as string;
      if (!clerkId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const componentId = parseInt(req.params.componentId);

      // Update component
      const { data: component, error } = await supabase
        .from("page_components")
        .update({
          ...req.body,
          updated_at: new Date().toISOString(),
        })
        .eq("id", componentId)
        .select()
        .single();

      if (error) throw error;
      res.json(component);
    } catch (error) {
      console.error("Error updating component:", error);
      res.status(500).json({ error: "Failed to update component" });
    }
  });

  // Delete component
  app.delete("/api/components/:componentId", async (req, res) => {
    try {
      const clerkId = req.headers["x-clerk-user-id"] as string;
      if (!clerkId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const componentId = parseInt(req.params.componentId);

      const { error } = await supabase
        .from("page_components")
        .delete()
        .eq("id", componentId);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting component:", error);
      res.status(500).json({ error: "Failed to delete component" });
    }
  });

  // Reorder components
  app.post("/api/pages/:pageId/reorder", async (req, res) => {
    try {
      const clerkId = req.headers["x-clerk-user-id"] as string;
      if (!clerkId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const pageId = parseInt(req.params.pageId);
      const { componentIds } = req.body; // Array of component IDs in new order

      if (!Array.isArray(componentIds)) {
        return res.status(400).json({ error: "componentIds must be an array" });
      }

      // Update each component's order_index
      for (let i = 0; i < componentIds.length; i++) {
        await supabase
          .from("page_components")
          .update({ order_index: i })
          .eq("id", componentIds[i])
          .eq("page_id", pageId);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error reordering components:", error);
      res.status(500).json({ error: "Failed to reorder components" });
    }
  });

  // ============ AI IMAGE GENERATION API ============

  // Generate image with AI
  app.post("/api/ai/generate-image", async (req, res) => {
    try {
      const clerkId = req.headers["x-clerk-user-id"] as string;
      if (!clerkId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { type, prompt, referenceImage, personImage } = req.body;

      if (!type || !prompt) {
        return res.status(400).json({ error: "Type and prompt are required" });
      }

      if (!["profile", "product", "thumbnail"].includes(type)) {
        return res.status(400).json({ error: "Invalid type" });
      }

      // Find user
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId)
        .single();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check daily limit (30 per day - temporary)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("ai_generations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id.toString())
        .gte("created_at", today.toISOString());

      const usedToday = count || 0;
      const remaining = 30 - usedToday;

      if (remaining <= 0) {
        return res.status(429).json({
          error: "Limite diário atingido. Tente novamente amanhã.",
          remaining: 0
        });
      }

      // Prepare dimensions based on type
      const dimensions = type === "thumbnail"
        ? "1280x720 (16:9 aspect ratio)"
        : "512x512 (square)";

      // Build prompt based on type and available images
      let enhancedPrompt = "";
      const hasDualImages = (type === "product" || type === "thumbnail") && personImage && referenceImage;

      if (type === "profile") {
        enhancedPrompt = `Generate a professional portrait/headshot image: ${prompt}. The image should be ${dimensions}. Make it professional and high quality.`;
        if (referenceImage) {
          enhancedPrompt += " Use the provided photo as a reference for the person's appearance and likeness.";
        }
      } else if (type === "product") {
        if (hasDualImages) {
          enhancedPrompt = `Generate a professional product image: ${prompt}. The image should be ${dimensions}. Combine the person from the first reference photo with the product from the second photo to create an engaging product showcase where the person is holding, using, or presenting the product.`;
        } else {
          enhancedPrompt = `Generate a professional product image: ${prompt}. The image should be ${dimensions}. Make it professional and high quality.`;
          if (referenceImage) {
            enhancedPrompt += " Use the provided product photo as reference.";
          }
        }
      } else if (type === "thumbnail") {
        if (hasDualImages) {
          enhancedPrompt = `Generate a video thumbnail image: ${prompt}. The image should be ${dimensions}. Create an eye-catching YouTube-style thumbnail featuring the person from the first photo presenting or using the product from the second photo. Make it vibrant, professional, and click-worthy.`;
        } else {
          enhancedPrompt = `Generate a video thumbnail image: ${prompt}. The image should be ${dimensions}. Make it eye-catching and professional.`;
          if (referenceImage) {
            enhancedPrompt += " Use the provided image as reference.";
          }
        }
      }

      // Build messages for OpenRouter
      const messages: any[] = [];
      const messageContent: any[] = [
        {
          type: "text",
          text: enhancedPrompt
        }
      ];

      // Add person image first (if provided for dual upload types)
      if (personImage && (type === "product" || type === "thumbnail")) {
        messageContent.push({
          type: "image_url",
          image_url: {
            url: personImage.startsWith("data:")
              ? personImage
              : `data:image/jpeg;base64,${personImage}`
          }
        });
      }

      // Add reference/product image if provided
      if (referenceImage) {
        messageContent.push({
          type: "image_url",
          image_url: {
            url: referenceImage.startsWith("data:")
              ? referenceImage
              : `data:image/jpeg;base64,${referenceImage}`
          }
        });
      }

      messages.push({
        role: "user",
        content: messageContent
      });

      // Call OpenRouter API with Gemini 3 Pro (image generation capable)
      const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://bio-storefront.com",
          "X-Title": "Bio-Storefront"
        },
        body: JSON.stringify({
          model: "google/gemini-3-pro-image-preview",
          messages,
          modalities: ["image", "text"],
          max_tokens: 8192
        })
      });

      if (!openRouterResponse.ok) {
        const errorText = await openRouterResponse.text();
        console.error("OpenRouter error:", errorText);
        return res.status(500).json({ error: "Falha ao gerar imagem. Tente novamente." });
      }

      const aiResult = await openRouterResponse.json();
      console.log("Full AI Response:", JSON.stringify(aiResult, null, 2));

      // Extract image URL from response (depends on model response format)
      let generatedImageUrl = null;
      const message = aiResult.choices?.[0]?.message;
      const content = message?.content;

      // Check for images array in message (OpenRouter standard format)
      // Format: message.images = [{ type: "image_url", image_url: { url: "data:image/png;base64,..." } }]
      if (Array.isArray(message?.images) && message.images.length > 0) {
        const firstImage = message.images[0];
        if (firstImage?.image_url?.url) {
          generatedImageUrl = firstImage.image_url.url;
        } else if (firstImage?.url) {
          generatedImageUrl = firstImage.url;
        }
      }

      // Check for multipart response with image (Gemini format in content)
      if (!generatedImageUrl && Array.isArray(content)) {
        for (const part of content) {
          if (part.type === "image_url" && part.image_url?.url) {
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
      if (!generatedImageUrl && typeof content === "string" && content) {
        // Try to extract URL from markdown image syntax
        const urlMatch = content.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
        if (urlMatch) {
          generatedImageUrl = urlMatch[1];
        }
        // Try to extract base64 image
        const base64Match = content.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/);
        if (base64Match) {
          generatedImageUrl = base64Match[0];
        }
        // Try to find any URL that looks like an image
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
      const { error: insertError } = await supabase
        .from("ai_generations")
        .insert({
          user_id: user.id.toString(),
          type,
          prompt,
          reference_image_url: referenceImage ? "provided" : null,
          generated_image_url: generatedImageUrl
        });

      if (insertError) {
        console.error("Error recording generation:", insertError);
      }

      res.json({
        imageUrl: generatedImageUrl,
        remaining: remaining - 1,
        rawResponse: generatedImageUrl ? undefined : content
      });
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });

  // Improve prompt with AI
  app.post("/api/ai/improve-prompt", async (req, res) => {
    try {
      const clerkId = req.headers["x-clerk-user-id"] as string;
      if (!clerkId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { prompt, type } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const typeContext = type === "profile"
        ? "portrait/headshot photo"
        : type === "product"
          ? "product photography"
          : "video thumbnail";

      // Call OpenRouter with a fast/cheap model
      const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://bio-storefront.com",
          "X-Title": "Bio-Storefront"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            {
              role: "system",
              content: `You are an expert at writing prompts for AI image generation. Improve the user's prompt to be more detailed and effective for generating a ${typeContext}. Focus on:
- Lighting and composition
- Style and mood
- Specific visual details
- Professional quality indicators

Respond ONLY with the improved prompt in English, no explanations or additional text.`
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 500
        })
      });

      if (!openRouterResponse.ok) {
        const errorText = await openRouterResponse.text();
        console.error("OpenRouter error:", errorText);
        return res.status(500).json({ error: "Falha ao melhorar prompt" });
      }

      const result = await openRouterResponse.json();
      const improvedPrompt = result.choices?.[0]?.message?.content?.trim();

      if (!improvedPrompt) {
        return res.status(500).json({ error: "No response from AI" });
      }

      res.json({ improvedPrompt });
    } catch (error) {
      console.error("Error improving prompt:", error);
      res.status(500).json({ error: "Failed to improve prompt" });
    }
  });

  // Get remaining AI generations for today
  app.get("/api/ai/remaining", async (req, res) => {
    try {
      const clerkId = req.headers["x-clerk-user-id"] as string;
      if (!clerkId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Find user
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId)
        .single();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check daily usage
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("ai_generations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id.toString())
        .gte("created_at", today.toISOString());

      const remaining = 3 - (count || 0);

      res.json({ remaining: Math.max(0, remaining) });
    } catch (error) {
      console.error("Error checking remaining:", error);
      res.status(500).json({ error: "Failed to check remaining" });
    }
  });

  return httpServer;
}
