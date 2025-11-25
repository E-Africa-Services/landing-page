// Supabase Client Configuration for Landing Page
// This connects to the existing v0-e-amplify-web-app database

import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Type definitions for landing page tables
export type DiscoveryCall = {
  id: string
  name: string
  business_name: string
  email: string
  phone: string
  whatsapp?: string
  service: string
  requirements: string
  status: "pending" | "contacted" | "scheduled" | "completed" | "rejected"
  created_at: string
  updated_at: string
  notes?: string
}

export type TrainingEnrollment = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
  field_of_experience: string
  experience_level: string
  skills: string[]
  area_of_study?: string
  training_program: string
  price: number
  currency: string
  payment_reference?: string
  enrollment_status: "pending" | "active" | "completed" | "cancelled" | "paused"
  payment_status: "pending" | "completed" | "failed" | "refunded"
  created_at: string
  updated_at: string
  completed_at?: string
}

export type TalentPoolProfile = {
  id: string
  full_name: string
  email: string
  country: string
  field_of_experience: string
  experience_level: string
  skills: string[]
  cv_url?: string
  video_url?: string
  profile_status: "pending" | "approved" | "rejected" | "inactive"
  registration_date: string
  updated_at: string
  approved_at?: string
  notes?: string
}

export type Payment = {
  id: string
  enrollment_id: string
  training_program: string
  amount: number
  currency: string
  payment_status: "pending" | "completed" | "failed" | "refunded"
  paystack_transaction_id?: string
  paystack_reference?: string
  paystack_authorization_code?: string
  paystack_access_code?: string
  payment_method: string
  payment_gateway: string
  metadata: Record<string, any>
  fees_paid: number
  created_at: string
  updated_at: string
  completed_at?: string
}
