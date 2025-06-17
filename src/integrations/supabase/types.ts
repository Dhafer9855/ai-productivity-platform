export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assignment_submissions: {
        Row: {
          assignment_id: number
          feedback: string | null
          id: string
          score: number | null
          status: string | null
          submission_text: string | null
          submission_url: string | null
          submitted_at: string | null
          user_id: string
        }
        Insert: {
          assignment_id: number
          feedback?: string | null
          id?: string
          score?: number | null
          status?: string | null
          submission_text?: string | null
          submission_url?: string | null
          submitted_at?: string | null
          user_id: string
        }
        Update: {
          assignment_id?: number
          feedback?: string | null
          id?: string
          score?: number | null
          status?: string | null
          submission_text?: string | null
          submission_url?: string | null
          submitted_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: number
          max_score: number | null
          module_id: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: number
          max_score?: number | null
          module_id: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: number
          max_score?: number | null
          module_id?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content_url: string | null
          id: number
          module_id: number
          order: number
          title: string
        }
        Insert: {
          content_url?: string | null
          id?: number
          module_id: number
          order: number
          title: string
        }
        Update: {
          content_url?: string | null
          id?: number
          module_id?: number
          order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          description: string
          id: number
          order: number | null
          title: string | null
        }
        Insert: {
          description: string
          id?: number
          order?: number | null
          title?: string | null
        }
        Update: {
          description?: string
          id?: number
          order?: number | null
          title?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          description: string | null
          feedback: string | null
          id: number
          module_id: number | null
          status: string | null
          submission_url: string | null
          submitted_at: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          description?: string | null
          feedback?: string | null
          id?: number
          module_id?: number | null
          status?: string | null
          submission_url?: string | null
          submitted_at?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          description?: string | null
          feedback?: string | null
          id?: number
          module_id?: number | null
          status?: string | null
          submission_url?: string | null
          submitted_at?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      test_attempts: {
        Row: {
          answers: Json | null
          completed_at: string | null
          id: string
          passed: boolean | null
          score: number
          test_id: number
          total_questions: number
          user_id: string
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          id?: string
          passed?: boolean | null
          score: number
          test_id: number
          total_questions: number
          user_id: string
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          id?: string
          passed?: boolean | null
          score?: number
          test_id?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      test_questions: {
        Row: {
          correct_answer: string
          id: number
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          order_number: number
          question: string
          test_id: number
        }
        Insert: {
          correct_answer: string
          id?: number
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          order_number: number
          question: string
          test_id: number
        }
        Update: {
          correct_answer?: string
          id?: number
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          order_number?: number
          question?: string
          test_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          module_id: number
          passing_score: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          module_id: number
          passing_score?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          module_id?: number
          passing_score?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tests_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          certificate_earned: boolean | null
          certificate_issued_at: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          overall_grade: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          certificate_earned?: boolean | null
          certificate_issued_at?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          overall_grade?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          certificate_earned?: boolean | null
          certificate_issued_at?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          overall_grade?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          assignment_score: number | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          lesson_id: number | null
          module_id: number
          test_score: number | null
          user_id: string
        }
        Insert: {
          assignment_score?: number | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: number | null
          module_id: number
          test_score?: number | null
          user_id: string
        }
        Update: {
          assignment_score?: number | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: number | null
          module_id?: number
          test_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
