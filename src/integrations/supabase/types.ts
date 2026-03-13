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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applicant_id: string
          created_at: string
          id: string
          internship_id: string
          note: string | null
          status: string
        }
        Insert: {
          applicant_id: string
          created_at?: string
          id?: string
          internship_id: string
          note?: string | null
          status?: string
        }
        Update: {
          applicant_id?: string
          created_at?: string
          id?: string
          internship_id?: string
          note?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          business_email: string | null
          business_name: string
          business_type: string | null
          contact_name: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          business_email?: string | null
          business_name?: string
          business_type?: string | null
          contact_name?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          business_email?: string | null
          business_name?: string
          business_type?: string | null
          contact_name?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      intern_profiles: {
        Row: {
          bio: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string
          gpa: number | null
          id: string
          languages: Json | null
          last_name: string
          phone: string | null
          school: string | null
          skills: string[] | null
          test_scores: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string
          gpa?: number | null
          id?: string
          languages?: Json | null
          last_name?: string
          phone?: string | null
          school?: string | null
          skills?: string[] | null
          test_scores?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string
          gpa?: number | null
          id?: string
          languages?: Json | null
          last_name?: string
          phone?: string | null
          school?: string | null
          skills?: string[] | null
          test_scores?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      internships: {
        Row: {
          company_name: string
          created_at: string
          description: string
          id: string
          location: string
          pay: string
          posted_by: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          company_name: string
          created_at?: string
          description: string
          id?: string
          location: string
          pay: string
          posted_by: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          description?: string
          id?: string
          location?: string
          pay?: string
          posted_by?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      listing_applications: {
        Row: {
          applied_at: string
          id: string
          intern_id: string
          listing_id: string
          status: string
        }
        Insert: {
          applied_at?: string
          id?: string
          intern_id: string
          listing_id: string
          status?: string
        }
        Update: {
          applied_at?: string
          id?: string
          intern_id?: string
          listing_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_applications_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          age_requirement: string | null
          business_id: string
          category: string | null
          created_at: string
          description: string
          duration: string | null
          hours_per_week: string | null
          id: string
          location: string | null
          pay_rate: string
          preferred_hours: string | null
          preferred_languages: string[] | null
          requirements: string[] | null
          skills_learned: string[] | null
          start_date: string | null
          status: string
          title: string
          updated_at: string
          work_setting: string
        }
        Insert: {
          age_requirement?: string | null
          business_id: string
          category?: string | null
          created_at?: string
          description?: string
          duration?: string | null
          hours_per_week?: string | null
          id?: string
          location?: string | null
          pay_rate?: string
          preferred_hours?: string | null
          preferred_languages?: string[] | null
          requirements?: string[] | null
          skills_learned?: string[] | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
          work_setting?: string
        }
        Update: {
          age_requirement?: string | null
          business_id?: string
          category?: string | null
          created_at?: string
          description?: string
          duration?: string | null
          hours_per_week?: string | null
          id?: string
          location?: string | null
          pay_rate?: string
          preferred_hours?: string | null
          preferred_languages?: string[] | null
          requirements?: string[] | null
          skills_learned?: string[] | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
          work_setting?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          business_id: string
          content: string
          id: string
          intern_id: string
          listing_id: string | null
          read: boolean
          sent_at: string
        }
        Insert: {
          business_id: string
          content: string
          id?: string
          intern_id: string
          listing_id?: string | null
          read?: boolean
          sent_at?: string
        }
        Update: {
          business_id?: string
          content?: string
          id?: string
          intern_id?: string
          listing_id?: string | null
          read?: boolean
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string
          company_name: string | null
          created_at: string
          full_name: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: string
          company_name?: string | null
          created_at?: string
          full_name?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: string
          company_name?: string | null
          created_at?: string
          full_name?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_business: { Args: { _user_id: string }; Returns: boolean }
      is_intern: { Args: { _user_id: string }; Returns: boolean }
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
