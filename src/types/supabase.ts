export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      time_spent: {
        Row: {
          id: string
          user_email: string
          project_id: number
          project_name: string
          issue_id: number
          issue_title: string
          spent_at: string
          time_spent: number
          created_at: string
        }
        Insert: {
          id?: string
          user_email: string
          project_id: number
          project_name: string
          issue_id: number
          issue_title: string
          spent_at: string
          time_spent: number
          created_at?: string
        }
        Update: {
          id?: string
          user_email?: string
          project_id?: number
          project_name?: string
          issue_id?: number
          issue_title?: string
          spent_at?: string
          time_spent?: number
          created_at?: string
        }
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
  }
} 