export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Component Types
export type ComponentType = 'button' | 'text' | 'product' | 'video' | 'social' | 'link' | 'carousel' | 'calendly' | 'maps' | 'pix';

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
  isVisible?: boolean;   // default true - when false, kit is hidden from display
  isSpecial?: boolean;   // when true, shows shine-border animation
  isHighlighted?: boolean; // for ecommerce style - highlights this kit (border + "MAIS VENDIDO")
  ignoreDiscount?: boolean; // when true, this kit ignores the product's discount percentage
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
  discountEndDate?: string; // ISO 8601 date string for countdown timer
  kits: ProductKit[];
  // Display style options
  displayStyle?: 'card' | 'compact' | 'ecommerce'; // default: 'card'
  // Rating (for compact style)
  rating?: number;       // 0-5, with decimals (e.g., 4.7)
  ratingCount?: number;  // number of reviews (e.g., 127)
  // CTA button (for compact style)
  ctaText?: string;      // button text (e.g., "Comprar Agora", "Get Started")
  ctaLink?: string;      // button link (if different from kit link)
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
  // Advanced customization
  backgroundColor?: string;
  shape?: 'rounded' | 'pill' | 'square';
  variant?: 'filled' | 'outline' | 'soft';
  animation?: 'none' | 'pulse' | 'shine';
  badge?: string;
  thumbnail?: string;
  thumbnailScale?: number;
  thumbnailPositionX?: number;
  thumbnailPositionY?: number;
}

// Carousel (Gallery) Config
export interface CarouselImage {
  id: string;
  url: string;
  scale?: number;       // 100-200
  positionX?: number;   // 0-100
  positionY?: number;   // 0-100
  badge?: string;       // "NOVO", "🔥"
  link?: string;        // optional click URL
}

export interface CarouselConfig {
  images: CarouselImage[];  // max 10
  autoPlay?: boolean;
  showDots?: boolean;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
}

// Calendly Config
export interface CalendlyConfig {
  url: string;
  embedType: 'button' | 'inline';
  buttonText?: string;
  height?: number;  // for inline embed
}

// Maps Config
export interface MapsConfig {
  embedUrl?: string;
  address?: string;
  height?: number;
  showOpenButton?: boolean;
}

// PIX Payment Config
export interface PixConfig {
  mode: 'qrcode' | 'copypaste';
  qrcodeImage?: string;
  qrcodeScale?: number;
  qrcodePositionX?: number;
  qrcodePositionY?: number;
  pixCode?: string;
  recipientName?: string;
  amount?: number;
  description?: string;
}

export type ComponentConfig = ButtonConfig | TextConfig | ProductConfig | VideoConfig | SocialConfig | LinkConfig | CarouselConfig | CalendlyConfig | MapsConfig | PixConfig;

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
