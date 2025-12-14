import { createClient } from '@supabase/supabase-js';
import type { Database, BioConfig, Product, SocialLink } from '@shared/supabase.types';

// These will be injected at build time or fetched from an endpoint
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yybxbkzssbzlqossagpv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5Ynhia3pzc2J6bHFvc3NhZ3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1Njg2OTEsImV4cCI6MjA4MTE0NDY5MX0.bHxWtaQBNwKd15cz7wgaJAelA-ORRZdTtv_-GSssHKM';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for bio_config operations
export async function getBioConfig(): Promise<BioConfig | null> {
  const { data, error } = await supabase
    .from('bio_config')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching bio config:', error);
    return null;
  }

  return {
    ...data,
    products: (data.products || []) as unknown as Product[],
    links: (data.links || []) as unknown as SocialLink[],
  };
}

// Upload image to Supabase Storage
export async function uploadImage(file: File, folder: 'profile' | 'products' = 'products'): Promise<string | null> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

export async function updateBioConfig(config: Partial<BioConfig>): Promise<BioConfig | null> {
  // First, get existing config to get the ID
  const existing = await getBioConfig();

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('bio_config')
      .update({
        ...config,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating bio config:', error);
      throw error;
    }

    return {
      ...data,
      products: (data.products || []) as unknown as Product[],
      links: (data.links || []) as unknown as SocialLink[],
    };
  } else {
    // Insert new config
    const { data, error } = await supabase
      .from('bio_config')
      .insert(config as any)
      .select()
      .single();

    if (error) {
      console.error('Error inserting bio config:', error);
      throw error;
    }

    return {
      ...data,
      products: (data.products || []) as unknown as Product[],
      links: (data.links || []) as unknown as SocialLink[],
    };
  }
}
