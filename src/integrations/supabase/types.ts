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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_visible: boolean
          name_ar: string
          sort_order: number
          training_type: Database["public"]["Enums"]["training_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_visible?: boolean
          name_ar: string
          sort_order?: number
          training_type: Database["public"]["Enums"]["training_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_visible?: boolean
          name_ar?: string
          sort_order?: number
          training_type?: Database["public"]["Enums"]["training_type"]
        }
        Relationships: []
      }
      completions: {
        Row: {
          completed_at: string
          day_exercise_id: string
          id: string
          program_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          day_exercise_id: string
          id?: string
          program_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          day_exercise_id?: string
          id?: string
          program_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "completions_day_exercise_id_fkey"
            columns: ["day_exercise_id"]
            isOneToOne: false
            referencedRelation: "program_day_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          age_max: number | null
          age_min: number | null
          category_id: string | null
          common_mistakes: string | null
          created_at: string
          duration_min: number | null
          equipment: string | null
          id: string
          image_url: string | null
          levels: string[]
          location: string | null
          objective: string | null
          positions: string[]
          reps: string | null
          rest: string | null
          safety_notes: string | null
          sets: number | null
          status: Database["public"]["Enums"]["content_status"]
          steps: string[]
          summary: string | null
          tips: string | null
          title: string
          training_type: Database["public"]["Enums"]["training_type"]
          updated_at: string
          video_url: string | null
        }
        Insert: {
          age_max?: number | null
          age_min?: number | null
          category_id?: string | null
          common_mistakes?: string | null
          created_at?: string
          duration_min?: number | null
          equipment?: string | null
          id?: string
          image_url?: string | null
          levels?: string[]
          location?: string | null
          objective?: string | null
          positions?: string[]
          reps?: string | null
          rest?: string | null
          safety_notes?: string | null
          sets?: number | null
          status?: Database["public"]["Enums"]["content_status"]
          steps?: string[]
          summary?: string | null
          tips?: string | null
          title: string
          training_type: Database["public"]["Enums"]["training_type"]
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          age_max?: number | null
          age_min?: number | null
          category_id?: string | null
          common_mistakes?: string | null
          created_at?: string
          duration_min?: number | null
          equipment?: string | null
          id?: string
          image_url?: string | null
          levels?: string[]
          location?: string | null
          objective?: string | null
          positions?: string[]
          reps?: string | null
          rest?: string | null
          safety_notes?: string | null
          sets?: number | null
          status?: Database["public"]["Enums"]["content_status"]
          steps?: string[]
          summary?: string | null
          tips?: string | null
          title?: string
          training_type?: Database["public"]["Enums"]["training_type"]
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          code: string
          name_ar: string
          sort_order: number
        }
        Insert: {
          code: string
          name_ar: string
          sort_order?: number
        }
        Update: {
          code?: string
          name_ar?: string
          sort_order?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string
          current_program_id: string | null
          days_per_week: number | null
          facilities: string[]
          goal: string | null
          height_cm: number | null
          id: string
          level: string | null
          notes: string | null
          personal_goals: string | null
          primary_position: string | null
          secondary_position: string | null
          subscription_tier: string
          updated_at: string
          username: string
          weight_kg: number | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          current_program_id?: string | null
          days_per_week?: number | null
          facilities?: string[]
          goal?: string | null
          height_cm?: number | null
          id: string
          level?: string | null
          notes?: string | null
          personal_goals?: string | null
          primary_position?: string | null
          secondary_position?: string | null
          subscription_tier?: string
          updated_at?: string
          username?: string
          weight_kg?: number | null
        }
        Update: {
          age?: number | null
          created_at?: string
          current_program_id?: string | null
          days_per_week?: number | null
          facilities?: string[]
          goal?: string | null
          height_cm?: number | null
          id?: string
          level?: string | null
          notes?: string | null
          personal_goals?: string | null
          primary_position?: string | null
          secondary_position?: string | null
          subscription_tier?: string
          updated_at?: string
          username?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_program_fk"
            columns: ["current_program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_primary_position_fkey"
            columns: ["primary_position"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "profiles_secondary_position_fkey"
            columns: ["secondary_position"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["code"]
          },
        ]
      }
      program_day_exercises: {
        Row: {
          day_id: string
          duration_min: number | null
          exercise_id: string
          id: string
          notes: string | null
          rest: string | null
          sort_order: number
        }
        Insert: {
          day_id: string
          duration_min?: number | null
          exercise_id: string
          id?: string
          notes?: string | null
          rest?: string | null
          sort_order?: number
        }
        Update: {
          day_id?: string
          duration_min?: number | null
          exercise_id?: string
          id?: string
          notes?: string | null
          rest?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_day_exercises_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "program_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_day_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      program_days: {
        Row: {
          day_number: number
          id: string
          notes: string | null
          program_id: string
          title: string | null
          week_number: number
        }
        Insert: {
          day_number?: number
          id?: string
          notes?: string | null
          program_id: string
          title?: string | null
          week_number?: number
        }
        Update: {
          day_number?: number
          id?: string
          notes?: string | null
          program_id?: string
          title?: string | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_days_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          age_max: number | null
          age_min: number | null
          cover_url: string | null
          created_at: string
          days_per_week: number
          description: string | null
          goals: string | null
          id: string
          is_premium: boolean
          levels: string[]
          positions: string[]
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          weeks: number
        }
        Insert: {
          age_max?: number | null
          age_min?: number | null
          cover_url?: string | null
          created_at?: string
          days_per_week?: number
          description?: string | null
          goals?: string | null
          id?: string
          is_premium?: boolean
          levels?: string[]
          positions?: string[]
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          weeks?: number
        }
        Update: {
          age_max?: number | null
          age_min?: number | null
          cover_url?: string | null
          created_at?: string
          days_per_week?: number
          description?: string | null
          goals?: string | null
          id?: string
          is_premium?: boolean
          levels?: string[]
          positions?: string[]
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          weeks?: number
        }
        Relationships: []
      }
      site_pages: {
        Row: {
          content: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_exists: { Args: never; Returns: boolean }
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      content_status: "draft" | "published" | "hidden"
      training_type: "technical" | "physical" | "tactical" | "mental"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "moderator", "user"],
      content_status: ["draft", "published", "hidden"],
      training_type: ["technical", "physical", "tactical", "mental"],
    },
  },
} as const
