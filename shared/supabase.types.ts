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
          links: Json
          products: Json
          profile_bio: string
          profile_image: string
          profile_image_scale: number
          profile_name: string
          show_video: boolean
          updated_at: string
          video_url: string
          whatsapp_message: string
          whatsapp_number: string
        }
        Insert: {
          coupon_code?: string
          discount_percent?: number
          id?: number
          links?: Json
          products?: Json
          profile_bio: string
          profile_image: string
          profile_image_scale?: number
          profile_name: string
          show_video?: boolean
          updated_at?: string
          video_url?: string
          whatsapp_message: string
          whatsapp_number: string
        }
        Update: {
          coupon_code?: string
          discount_percent?: number
          id?: number
          links?: Json
          products?: Json
          profile_bio?: string
          profile_image?: string
          profile_image_scale?: number
          profile_name?: string
          show_video?: boolean
          updated_at?: string
          video_url?: string
          whatsapp_message?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          id: number
          user_id: string | null
          username: string
          profile_name: string
          profile_bio: string | null
          profile_image: string | null
          profile_image_scale: number | null
          whatsapp_number: string | null
          whatsapp_message: string | null
          background_type: string | null
          background_value: string | null
          font_family: string | null
          views: number | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          username: string
          profile_name?: string
          profile_bio?: string | null
          profile_image?: string | null
          profile_image_scale?: number | null
          whatsapp_number?: string | null
          whatsapp_message?: string | null
          background_type?: string | null
          background_value?: string | null
          font_family?: string | null
          views?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          username?: string
          profile_name?: string
          profile_bio?: string | null
          profile_image?: string | null
          profile_image_scale?: number | null
          whatsapp_number?: string | null
          whatsapp_message?: string | null
          background_type?: string | null
          background_value?: string | null
          font_family?: string | null
          views?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      page_components: {
        Row: {
          id: number
          page_id: number | null
          type: string
          order_index: number
          config: Json
          is_visible: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          page_id?: number | null
          type: string
          order_index?: number
          config?: Json
          is_visible?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          page_id?: number | null
          type?: string
          order_index?: number
          config?: Json
          is_visible?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_components_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          }
        ]
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
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
