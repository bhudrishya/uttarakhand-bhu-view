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
      land_listing_photos: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          listing_id: string
          photo_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          listing_id: string
          photo_url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          listing_id?: string
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "land_listing_photos_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "land_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      land_listings: {
        Row: {
          area: number
          area_unit: string
          contact_email: string | null
          contact_name: string
          contact_phone: string
          created_at: string
          currency: string
          description: string | null
          district: string
          expected_price: number
          id: string
          latitude: number
          longitude: number
          property_type: Database["public"]["Enums"]["property_type"]
          status: Database["public"]["Enums"]["listing_status"]
          tehsil: string
          updated_at: string
          user_id: string
          village: string
        }
        Insert: {
          area: number
          area_unit?: string
          contact_email?: string | null
          contact_name: string
          contact_phone: string
          created_at?: string
          currency?: string
          description?: string | null
          district: string
          expected_price: number
          id?: string
          latitude: number
          longitude: number
          property_type: Database["public"]["Enums"]["property_type"]
          status?: Database["public"]["Enums"]["listing_status"]
          tehsil: string
          updated_at?: string
          user_id: string
          village: string
        }
        Update: {
          area?: number
          area_unit?: string
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string
          created_at?: string
          currency?: string
          description?: string | null
          district?: string
          expected_price?: number
          id?: string
          latitude?: number
          longitude?: number
          property_type?: Database["public"]["Enums"]["property_type"]
          status?: Database["public"]["Enums"]["listing_status"]
          tehsil?: string
          updated_at?: string
          user_id?: string
          village?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string
          created_at: string
          email: string
          full_name: string
          id: string
          phone_number: string
          updated_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          address: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone_number: string
          updated_at?: string
          user_id: string
          user_type?: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone_number?: string
          updated_at?: string
          user_id?: string
          user_type?: string
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
      listing_status: "active" | "sold" | "inactive"
      property_type:
        | "residential"
        | "commercial"
        | "agricultural"
        | "industrial"
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
    Enums: {
      listing_status: ["active", "sold", "inactive"],
      property_type: [
        "residential",
        "commercial",
        "agricultural",
        "industrial",
      ],
    },
  },
} as const
