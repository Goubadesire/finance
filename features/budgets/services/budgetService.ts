import { createClient } from '@/lib/supabase/client'

export interface BudgetWithSpending {
  id: string
  category_id: string
  amount_limit: number
  month_year: string
  categories: {
    name: string
    color: string
    icon: string
  }
  spent: number // Calculé dynamiquement ou récupéré
}

export const budgetService = {
  async getBudgetsWithSpending(monthYear: string) {
    const supabase = createClient()
    
    // 1. Récupérer les budgets du mois avec leurs catégories
    const { data: budgets, error: budgetError } = await supabase
      .from('budgets')
      .select('id, category_id, amount_limit, month_year, categories(name, color, icon)')
      .eq('month_year', monthYear)

    if (budgetError) throw budgetError
    if (!budgets) return []

    // 2. Récupérer les transactions du mois pour calculer les dépenses réelles par catégorie
    const startDate = `${monthYear}-01`
    // Calcul simple de fin de mois (ou gestion basique)
    const [year, month] = monthYear.split('-')
    const lastDay = new Date(Number(year), Number(month), 0).getDate()
    const endDate = `${monthYear}-${lastDay}`

    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('category_id, amount, type')
      .eq('type', 'expense')
      .gte('date', startDate)
      .lte('date', endDate)

    if (txError) throw txError

    // 3. Associer les dépenses aux budgets
    const budgetsWithSpending: BudgetWithSpending[] = budgets.map((b: any) => {
      const categorySpent = transactions
        ?.filter((tx: any) => tx.category_id === b.category_id)
        .reduce((sum: number, tx: any) => sum + Number(tx.amount), 0) || 0

      return {
        ...b,
        spent: categorySpent,
      }
    })

    return budgetsWithSpending
  },

  async addBudget(budget: { category_id: string; amount_limit: number; month_year: string }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    const { data, error } = await supabase
      .from('budgets')
      .upsert([{ user_id: user.id, ...budget }])
      .select()

    if (error) throw error
    return data
  }
}