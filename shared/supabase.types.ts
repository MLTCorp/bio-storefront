export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_generation_usage: {
        Row: {
          count: number | null
          created_at: string | null
          date: string
          id: number
          user_id: string
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          date: string
          id?: number
          user_id: string
        }
        Update: {
          count?: number | null
          created_at?: string | null
          date?: string
          id?: number
          user_id?: string
        }
        Relationships: []
      }
      ai_generations: {
        Row: {
          created_at: string | null
          generated_image_url: string | null
          id: number
          prompt: string
          reference_image_url: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          generated_image_url?: string | null
          id?: number
          prompt: string
          reference_image_url?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          generated_image_url?: string | null
          id?: number
          prompt?: string
          reference_image_url?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      bio_config: {
        Row: {
          coupon_code: string
          discount_percent: number
          id: number
          links: Json | null
          products: Json
          profile_bio: string
          profile_image: string
          profile_image_scale: number
          profile_name: string
          show_video: boolean | null
          updated_at: string
          video_url: string
          whatsapp_message: string
          whatsapp_number: string
        }
        Insert: {
          coupon_code?: string
          discount_percent?: number
          id?: number
          links?: Json | null
          products?: Json
          profile_bio: string
          profile_image: string
          profile_image_scale?: number
          profile_name: string
          show_video?: boolean | null
          updated_at?: string
          video_url?: string
          whatsapp_message: string
          whatsapp_number: string
        }
        Update: {
          coupon_code?: string
          discount_percent?: number
          id?: number
          links?: Json | null
          products?: Json
          profile_bio?: string
          profile_image?: string
          profile_image_scale?: number
          profile_name?: string
          show_video?: boolean | null
          updated_at?: string
          video_url?: string
          whatsapp_message?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      component_clicks: {
        Row: {
          clicked_at: string | null
          component_id: number | null
          component_label: string | null
          component_type: string
          id: number
          page_id: number | null
          target_url: string | null
        }
        Insert: {
          clicked_at?: string | null
          component_id?: number | null
          component_label?: string | null
          component_type: string
          id?: number
          page_id?: number | null
          target_url?: string | null
        }
        Update: {
          clicked_at?: string | null
          component_id?: number | null
          component_label?: string | null
          component_type?: string
          id?: number
          page_id?: number | null
          target_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "component_clicks_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "page_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_clicks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_components: {
        Row: {
          config: Json
          created_at: string | null
          id: number
          is_visible: boolean | null
          order_index: number
          page_id: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          config?: Json
          created_at?: string | null
          id?: number
          is_visible?: boolean | null
          order_index?: number
          page_id?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          id?: number
          is_visible?: boolean | null
          order_index?: number
          page_id?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_components_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          device_type: string | null
          id: number
          page_id: number | null
          referrer: string | null
          user_agent: string | null
          viewed_at: string | null
        }
        Insert: {
          device_type?: string | null
          id?: number
          page_id?: number | null
          referrer?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Update: {
          device_type?: string | null
          id?: number
          page_id?: number | null
          referrer?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_views_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          background_type: string | null
          background_value: string | null
          clicks: number | null
          created_at: string | null
          font_family: string | null
          id: number
          is_active: boolean | null
          profile_bio: string | null
          profile_image: string | null
          profile_image_position_x: number | null
          profile_image_position_y: number | null
          profile_image_scale: number | null
          profile_name: string
          updated_at: string | null
          user_id: string | null
          username: string
          views: number | null
          whatsapp_message: string | null
          whatsapp_number: string | null
        }
        Insert: {
          background_type?: string | null
          background_value?: string | null
          clicks?: number | null
          created_at?: string | null
          font_family?: string | null
          id?: number
          is_active?: boolean | null
          profile_bio?: string | null
          profile_image?: string | null
          profile_image_position_x?: number | null
          profile_image_position_y?: number | null
          profile_image_scale?: number | null
          profile_name?: string
          updated_at?: string | null
          user_id?: string | null
          username: string
          views?: number | null
          whatsapp_message?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          background_type?: string | null
          background_value?: string | null
          clicks?: number | null
          created_at?: string | null
          font_family?: string | null
          id?: number
          is_active?: boolean | null
          profile_bio?: string | null
          profile_image?: string | null
          profile_image_position_x?: number | null
          profile_image_position_y?: number | null
          profile_image_scale?: number | null
          profile_name?: string
          updated_at?: string | null
          user_id?: string | null
          username?: string
          views?: number | null
          whatsapp_message?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_subscriptions: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          plan_id: string
          setup_token: string
          status: string | null
          stripe_customer_id: string | null
          stripe_session_id: string
          stripe_subscription_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          plan_id: string
          setup_token: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_session_id: string
          stripe_subscription_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          plan_id?: string
          setup_token?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_session_id?: string
          stripe_subscription_id?: string | null
        }
        Relationships: []
      }
      stores: {
        Row: {
          coupon_code: string | null
          created_at: string | null
          discount_percent: number | null
          id: number
          is_active: boolean | null
          links: Json | null
          products: Json | null
          profile_bio: string | null
          profile_image: string | null
          profile_image_scale: number | null
          profile_name: string
          show_video: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string | null
          username: string
          video_thumbnail: string | null
          video_url: string | null
          whatsapp_message: string | null
          whatsapp_number: string | null
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string | null
          discount_percent?: number | null
          id?: number
          is_active?: boolean | null
          links?: Json | null
          products?: Json | null
          profile_bio?: string | null
          profile_image?: string | null
          profile_image_scale?: number | null
          profile_name?: string
          show_video?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
          username: string
          video_thumbnail?: string | null
          video_url?: string | null
          whatsapp_message?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          coupon_code?: string | null
          created_at?: string | null
          discount_percent?: number | null
          id?: number
          is_active?: boolean | null
          links?: Json | null
          products?: Json | null
          profile_bio?: string | null
          profile_image?: string | null
          profile_image_scale?: number | null
          profile_name?: string
          show_video?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string
          video_thumbnail?: string | null
          video_url?: string | null
          whatsapp_message?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          limits: Json | null
          name: string
          price_monthly: number | null
          price_yearly: number | null
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
        }
        Insert: {
          created_at?: string | null
          features?: Json | null
          id: string
          is_active?: boolean | null
          limits?: Json | null
          name: string
          price_monthly?: number | null
          price_yearly?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
        }
        Update: {
          created_at?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          limits?: Json | null
          name?: string
          price_monthly?: number | null
          price_yearly?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: number
          plan_id: string
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: number
          plan_id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: number
          plan_id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          config: Json
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          name: string
          thumbnail: string | null
        }
        Insert: {
          config: Json
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          thumbnail?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          thumbnail?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          clerk_id: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          password: string
          plan: string | null
          stripe_customer_id: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          clerk_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          password: string
          plan?: string | null
          stripe_customer_id?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          clerk_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          password?: string
          plan?: string | null
          stripe_customer_id?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_pending_subscriptions: { Args: Record<string, never>; Returns: number }
      complete_pending_subscription: {
        Args: { p_clerk_id: string; p_token: string }
        Returns: {
          error_message: string
          plan_id: string
          success: boolean
        }[]
      }
      increment_ai_usage: {
        Args: { p_date: string; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// Helper types for Products JSON
export interface ProductKit {
  id: string
  label: string
  price: number
  link: string
}

export interface Product {
  id: string
  title: string
  description: string
  image: string
  imageScale: number
  discountPercent: number
  kits: ProductKit[]
}

// Helper type for Social Links
export interface SocialLink {
  id: string
  label: string
  url: string
  icon?: string
}

// Typed BioConfig with proper products typing
export interface BioConfig extends Omit<Tables<'bio_config'>, 'products' | 'links'> {
  products: Product[]
  links: SocialLink[]
}

// Subscription plan limits interface
export interface PlanLimits {
  max_pages: number
  max_products: number
  max_links: number
  ai_generations_per_day: number
  show_branding: boolean
}

// Subscription with plan details
export interface SubscriptionWithPlan extends Tables<'subscriptions'> {
  subscription_plans?: Tables<'subscription_plans'> & {
    limits: PlanLimits
  }
}
