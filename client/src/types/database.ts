export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Component Types
export type ComponentType = 'button' | 'text' | 'product' | 'video' | 'social' | 'link';

// Component Config Types
export interface ButtonConfig {
  type: 'whatsapp' | 'link';
  text: string;
  url?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  style: 'large' | 'medium';
  icon?: string;
}

export interface TextConfig {
  content: string;
  alignment: 'left' | 'center' | 'right';
  size: 'small' | 'medium' | 'large';
  bold?: boolean;
  italic?: boolean;
}

export interface ProductKit {
  id: string;
  label: string;
  price: number;
  link: string;
  discountLinks?: Record<number, string>;
}

export interface ProductConfig {
  id: string;
  title: string;
  description: string;
  image: string;
  imageScale: number;
  imagePositionX?: number; // 0-100, default 50 (center)
  imagePositionY?: number; // 0-100, default 50 (center)
  discountPercent: number;
  kits: ProductKit[];
}

export interface VideoConfig {
  url: string;
  thumbnail?: string;
  thumbnailScale?: number; // 100-200, default 100
  thumbnailPositionX?: number; // 0-100, default 50 (center)
  thumbnailPositionY?: number; // 0-100, default 50 (center)
  title?: string;
  showTitle: boolean;
}

export interface SocialConfig {
  links: {
    id: string;
    platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter' | 'custom';
    url: string;
    label?: string;
    icon?: string;
  }[];
  style: 'icons' | 'buttons';
}

export interface LinkConfig {
  text: string;
  url: string;
  icon?: string;
  style: 'large' | 'small';
}

export type ComponentConfig = ButtonConfig | TextConfig | ProductConfig | VideoConfig | SocialConfig | LinkConfig;

// Page Types
export interface Page {
  id: number;
  user_id: string | null;
  username: string;
  profile_name: string;
  profile_bio: string | null;
  profile_image: string | null;
  profile_image_scale: number | null;
  profile_image_position_x: number | null; // 0-100, default 50 (center)
  profile_image_position_y: number | null; // 0-100, default 50 (center)
  whatsapp_number: string | null;
  whatsapp_message: string | null;
  background_type: string | null;
  background_value: string | null;
  font_family: string | null;
  views: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface PageComponent {
  id: number;
  page_id: number | null;
  type: ComponentType;
  order_index: number;
  config: ComponentConfig;
  is_visible: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface PageWithComponents extends Page {
  components: PageComponent[];
}

// Form types for creating/updating
export interface CreatePageInput {
  username: string;
  profile_name?: string;
}

export interface UpdatePageInput {
  profile_name?: string;
  profile_bio?: string;
  profile_image?: string;
  profile_image_scale?: number;
  profile_image_position_x?: number;
  profile_image_position_y?: number;
  whatsapp_number?: string;
  whatsapp_message?: string;
  background_type?: string;
  background_value?: string;
  font_family?: string;
}

export interface CreateComponentInput {
  page_id: number;
  type: ComponentType;
  order_index: number;
  config: ComponentConfig;
}

export interface UpdateComponentInput {
  order_index?: number;
  config?: ComponentConfig;
  is_visible?: boolean;
}
