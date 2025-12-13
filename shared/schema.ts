import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Product Kit type (stored as JSONB)
export const productKitSchema = z.object({
  id: z.string(),
  label: z.string(),
  price: z.number(),
  link: z.string(),
});

// Product type (stored as JSONB)
export const productSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  imageScale: z.number(),
  discountPercent: z.number().optional().default(0),
  kits: z.array(productKitSchema),
});

// Main configuration table
export const bioConfig = pgTable("bio_config", {
  id: serial("id").primaryKey(),
  profileName: text("profile_name").notNull(),
  profileBio: text("profile_bio").notNull(),
  profileImage: text("profile_image").notNull(),
  profileImageScale: integer("profile_image_scale").notNull().default(100),
  videoUrl: text("video_url").notNull().default(""),
  whatsappNumber: text("whatsapp_number").notNull(),
  whatsappMessage: text("whatsapp_message").notNull(),
  couponCode: text("coupon_code").notNull().default(""),
  discountPercent: integer("discount_percent").notNull().default(0),
  products: jsonb("products").$type<z.infer<typeof productSchema>[]>().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBioConfigSchema = createInsertSchema(bioConfig, {
  products: productSchema.array(),
}).omit({ id: true, updatedAt: true });

export const selectBioConfigSchema = createInsertSchema(bioConfig);

export type BioConfig = typeof bioConfig.$inferSelect;
export type InsertBioConfig = z.infer<typeof insertBioConfigSchema>;
