import { createClient } from '@/lib/supabase/client'
import { Transaction, TransactionType } from '../types'

export const transactionService = {
  // Récupérer toutes les transactions de l'utilisateur connecté
  async getTransactions() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('transactions')
      .select('*, categories(id, name, type, color, icon)')
      .order('date', { ascending: false })

    if (error) throw error
    return data as Transaction[]
  },

  // Récupérer les catégories (pour les formulaires)
  async getCategories() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true})

    if (error) throw error
    return data
  },

  // Ajouter une transaction
  async addTransaction(transaction: {
    amount: number
    type: TransactionType
    category_id: string | null
    date: string
    description: string
  }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Utilisateur non authentifié')

    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: user.id,
          ...transaction,
        },
      ])
      .select()

    if (error) throw error
    return data
  },

  //supprimer une transaction
  async deleteTransaction(id: string){
    const supabase = createClient()
    const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)

    if(error){
      throw error
    }
  }
}