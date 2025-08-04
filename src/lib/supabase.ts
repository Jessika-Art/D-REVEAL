import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface WaitlistSubmission {
  id: string
  timestamp: string
  full_name: string
  email: string
  company: string
  job_title: string
  company_type: string
  aum: string
  primary_markets: string[]
  current_tools: string[]
  team_size: string
  biggest_challenge: string
  interest_level: string
  budget_range: string
  additional_notes?: string
  created_at?: string
}

export interface Report {
  id: string
  token: string
  client_name: string
  generated_date: string
  created_at: string
  chart_file_name: string
  json_file_name: string
  chart_url?: string
  data_url?: string
}