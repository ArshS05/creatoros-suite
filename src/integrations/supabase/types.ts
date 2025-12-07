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
      collabs: {
        Row: {
          brand: string
          campaign: string | null
          contract_signed: boolean | null
          created_at: string
          deadline: string | null
          deliverables: string[] | null
          id: string
          notes: string | null
          payment_status: string | null
          status: string
          updated_at: string
          user_id: string | null
          value: number | null
        }
        Insert: {
          brand: string
          campaign?: string | null
          contract_signed?: boolean | null
          created_at?: string
          deadline?: string | null
          deliverables?: string[] | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          value?: number | null
        }
        Update: {
          brand?: string
          campaign?: string | null
          contract_signed?: boolean | null
          created_at?: string
          deadline?: string | null
          deliverables?: string[] | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          value?: number | null
        }
        Relationships: []
      }
      content_plans: {
        Row: {
          created_at: string
          id: string
          niche: string
          plan: Json
          platforms: string[] | null
          style: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          niche: string
          plan?: Json
          platforms?: string[] | null
          style?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          niche?: string
          plan?: Json
          platforms?: string[] | null
          style?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ideas: {
        Row: {
          ai_generated: boolean | null
          category: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          is_favorite: boolean | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          is_favorite?: boolean | null
          tags?: string[] | null
          title: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          is_favorite?: boolean | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      inbox_messages: {
        Row: {
          ai_analysis: Json | null
          budget: string | null
          category: string | null
          company: string | null
          created_at: string
          deadline: string | null
          full_content: string | null
          id: string
          preview: string | null
          priority: string | null
          sender: string
          starred: boolean | null
          status: string | null
          subject: string
          user_id: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          budget?: string | null
          category?: string | null
          company?: string | null
          created_at?: string
          deadline?: string | null
          full_content?: string | null
          id?: string
          preview?: string | null
          priority?: string | null
          sender: string
          starred?: boolean | null
          status?: string | null
          subject: string
          user_id?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          budget?: string | null
          category?: string | null
          company?: string | null
          created_at?: string
          deadline?: string | null
          full_content?: string | null
          id?: string
          preview?: string | null
          priority?: string | null
          sender?: string
          starred?: boolean | null
          status?: string | null
          subject?: string
          user_id?: string | null
        }
        Relationships: []
      }
      scripts: {
        Row: {
          captions: string[] | null
          created_at: string
          hashtags: string[] | null
          hooks: string[] | null
          id: string
          platform: string | null
          script_content: string | null
          title: string
          topic: string | null
          user_id: string | null
        }
        Insert: {
          captions?: string[] | null
          created_at?: string
          hashtags?: string[] | null
          hooks?: string[] | null
          id?: string
          platform?: string | null
          script_content?: string | null
          title: string
          topic?: string | null
          user_id?: string | null
        }
        Update: {
          captions?: string[] | null
          created_at?: string
          hashtags?: string[] | null
          hooks?: string[] | null
          id?: string
          platform?: string | null
          script_content?: string | null
          title?: string
          topic?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      websites: {
        Row: {
          about: string | null
          bio: string | null
          created_at: string
          headline: string | null
          html_content: string | null
          id: string
          links: Json | null
          name: string | null
          published: boolean | null
          sections: Json | null
          services: Json | null
          theme: string | null
          updated_at: string
          user_id: string | null
          username: string
        }
        Insert: {
          about?: string | null
          bio?: string | null
          created_at?: string
          headline?: string | null
          html_content?: string | null
          id?: string
          links?: Json | null
          name?: string | null
          published?: boolean | null
          sections?: Json | null
          services?: Json | null
          theme?: string | null
          updated_at?: string
          user_id?: string | null
          username: string
        }
        Update: {
          about?: string | null
          bio?: string | null
          created_at?: string
          headline?: string | null
          html_content?: string | null
          id?: string
          links?: Json | null
          name?: string | null
          published?: boolean | null
          sections?: Json | null
          services?: Json | null
          theme?: string | null
          updated_at?: string
          user_id?: string | null
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

export const Constants = {
  public: {
    Enums: {},
  },
} as const
