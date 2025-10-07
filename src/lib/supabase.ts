import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Question {
  id: number
  question: string
  selected_cards: any[]
  created_at: string
  user_session?: string
}

export interface PaymentMethod {
  id: number
  name: string
  type: 'pix' | 'card' | 'digital_wallet' | 'bank_transfer'
  details: {
    pixKey?: string
    accountName?: string
    bankName?: string
    agency?: string
    account?: string
    walletId?: string
  }
  is_active: boolean
  created_at: string
}

export interface ConsultationSettings {
  id: number
  price: number
  updated_at: string
}