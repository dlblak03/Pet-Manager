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
  pets: {
    Tables: {
      activity_feed: {
        Row: {
          activity_description: string
          activity_type: string
          appointment_type: string | null
          created_at: string
          id: string
          medical_record_type: string | null
          owner_id: string
          pet_breed: string | null
          pet_name: string | null
          pet_species: string | null
          vaccination_name: string | null
        }
        Insert: {
          activity_description: string
          activity_type: string
          appointment_type?: string | null
          created_at?: string
          id?: string
          medical_record_type?: string | null
          owner_id?: string
          pet_breed?: string | null
          pet_name?: string | null
          pet_species?: string | null
          vaccination_name?: string | null
        }
        Update: {
          activity_description?: string
          activity_type?: string
          appointment_type?: string | null
          created_at?: string
          id?: string
          medical_record_type?: string | null
          owner_id?: string
          pet_breed?: string | null
          pet_name?: string | null
          pet_species?: string | null
          vaccination_name?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_type: string
          clinic_address: string | null
          clinic_name: string | null
          clinic_phone: string | null
          cost: number | null
          created_at: string
          duration_minutes: number | null
          id: string
          notes: string | null
          pet_id: string
          reminder_sent: boolean | null
          status: string | null
          updated_at: string
          veterinarian: string | null
        }
        Insert: {
          appointment_date: string
          appointment_type: string
          clinic_address?: string | null
          clinic_name?: string | null
          clinic_phone?: string | null
          cost?: number | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          pet_id: string
          reminder_sent?: boolean | null
          status?: string | null
          updated_at?: string
          veterinarian?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_type?: string
          clinic_address?: string | null
          clinic_name?: string | null
          clinic_phone?: string | null
          cost?: number | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          pet_id?: string
          reminder_sent?: boolean | null
          status?: string | null
          updated_at?: string
          veterinarian?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_contacts: {
        Row: {
          address: string | null
          contact_type: string
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          pet_id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_type: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          pet_id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_type?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          pet_id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          appointment_id: string | null
          clinic_name: string | null
          cost: number | null
          created_at: string
          diagnosis: string | null
          id: string
          medications: string | null
          notes: string | null
          pet_id: string
          record_date: string
          record_type: string
          treatment: string | null
          updated_at: string
          veterinarian: string | null
        }
        Insert: {
          appointment_id?: string | null
          clinic_name?: string | null
          cost?: number | null
          created_at?: string
          diagnosis?: string | null
          id?: string
          medications?: string | null
          notes?: string | null
          pet_id: string
          record_date: string
          record_type: string
          treatment?: string | null
          updated_at?: string
          veterinarian?: string | null
        }
        Update: {
          appointment_id?: string | null
          clinic_name?: string | null
          cost?: number | null
          created_at?: string
          diagnosis?: string | null
          id?: string
          medications?: string | null
          notes?: string | null
          pet_id?: string
          record_date?: string
          record_type?: string
          treatment?: string | null
          updated_at?: string
          veterinarian?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_media: {
        Row: {
          created_at: string
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          media_type: string
          mime_type: string | null
          pet_id: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          media_type: string
          mime_type?: string | null
          pet_id: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          media_type?: string
          mime_type?: string | null
          pet_id?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_media_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_vaccinations: {
        Row: {
          batch_number: string | null
          clinic_name: string | null
          created_at: string
          date_administered: string
          dose_number: number | null
          expiration_date: string | null
          id: string
          lot_number: string | null
          next_due_date: string | null
          notes: string | null
          pet_id: string
          updated_at: string
          vaccination_type_id: string
          veterinarian: string | null
        }
        Insert: {
          batch_number?: string | null
          clinic_name?: string | null
          created_at?: string
          date_administered: string
          dose_number?: number | null
          expiration_date?: string | null
          id?: string
          lot_number?: string | null
          next_due_date?: string | null
          notes?: string | null
          pet_id: string
          updated_at?: string
          vaccination_type_id: string
          veterinarian?: string | null
        }
        Update: {
          batch_number?: string | null
          clinic_name?: string | null
          created_at?: string
          date_administered?: string
          dose_number?: number | null
          expiration_date?: string | null
          id?: string
          lot_number?: string | null
          next_due_date?: string | null
          notes?: string | null
          pet_id?: string
          updated_at?: string
          vaccination_type_id?: string
          veterinarian?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_vaccinations_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_vaccinations_vaccination_type_id_fkey"
            columns: ["vaccination_type_id"]
            isOneToOne: false
            referencedRelation: "vaccination_types"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          birth_date: string | null
          breed: string | null
          color: string | null
          created_at: string
          custom_attributes: Json | null
          gender: string | null
          id: string
          microchip_id: string | null
          name: string
          owner_email: string | null
          owner_id: string
          owner_name: string | null
          owner_phone: string | null
          species: string
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          breed?: string | null
          color?: string | null
          created_at?: string
          custom_attributes?: Json | null
          gender?: string | null
          id?: string
          microchip_id?: string | null
          name: string
          owner_email?: string | null
          owner_id?: string
          owner_name?: string | null
          owner_phone?: string | null
          species: string
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          breed?: string | null
          color?: string | null
          created_at?: string
          custom_attributes?: Json | null
          gender?: string | null
          id?: string
          microchip_id?: string | null
          name?: string
          owner_email?: string | null
          owner_id?: string
          owner_name?: string | null
          owner_phone?: string | null
          species?: string
          updated_at?: string
        }
        Relationships: []
      }
      vaccination_types: {
        Row: {
          created_at: string
          description: string | null
          frequency_months: number | null
          id: string
          is_active: boolean | null
          is_core: boolean | null
          minimum_age_weeks: number | null
          species: string
          updated_at: string
          vaccine_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          frequency_months?: number | null
          id?: string
          is_active?: boolean | null
          is_core?: boolean | null
          minimum_age_weeks?: number | null
          species: string
          updated_at?: string
          vaccine_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          frequency_months?: number | null
          id?: string
          is_active?: boolean | null
          is_core?: boolean | null
          minimum_age_weeks?: number | null
          species?: string
          updated_at?: string
          vaccine_name?: string
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
  pets: {
    Enums: {},
  },
} as const
