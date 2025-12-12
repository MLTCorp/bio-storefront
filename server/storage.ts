import { type User, type InsertUser, type BioConfig, type InsertBioConfig, users, bioConfig } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getBioConfig(): Promise<BioConfig | undefined>;
  updateBioConfig(config: InsertBioConfig): Promise<BioConfig>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getBioConfig(): Promise<BioConfig | undefined> {
    // Get the most recent config (there should only be one row)
    const [config] = await db.select().from(bioConfig).orderBy(desc(bioConfig.id)).limit(1);
    return config || undefined;
  }

  async updateBioConfig(insertConfig: InsertBioConfig): Promise<BioConfig> {
    const existing = await this.getBioConfig();
    
    if (existing) {
      // Update existing config
      const [updated] = await db
        .update(bioConfig)
        .set({ ...insertConfig, updatedAt: new Date() })
        .where(eq(bioConfig.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new config
      const [created] = await db
        .insert(bioConfig)
        .values(insertConfig)
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
