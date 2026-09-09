export type TransactionType = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  type: TransactionType
  color?: string
  icon?: string
}

export interface Transaction {
  id: string
  user_id: string
  category_id: string | null
  amount: number
  type: TransactionType
  date: string
  description: string | null
  created_at: string
  categories?: Category // Relation join avec Supabase
}