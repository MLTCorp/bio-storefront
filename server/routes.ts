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

  return httpServer;
}
