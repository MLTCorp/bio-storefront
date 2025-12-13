import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBioConfigSchema } from "@shared/schema";

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

  return httpServer;
}
