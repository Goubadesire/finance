import { createClient } from '@/lib/supabase/client'

export const dashboardService = {
  async getDashboardSummary(monthYear: string) {
    const supabase = createClient()
    const startDate = `${monthYear}-01`
    const [year, month] = monthYear.split('-')
    const lastDay = new Date(Number(year), Number(month), 0).getDate()
    const endDate = `${monthYear}-${lastDay}`

    // 1. Récupérer toutes les transactions du mois
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('amount, type, date, description, categories(name, color)')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    if (error) throw error

    // 2. Calculer les totaux
    let totalIncome = 0
    let totalExpense = 0

    transactions?.forEach((tx: any) => {
      const amount = Number(tx.amount)
      if (tx.type === 'income') {
        totalIncome += amount
      } else {
        totalExpense += amount
      }
    })

    const netBalance = totalIncome - totalExpense

    return {
      totalIncome,
      totalExpense,
      netBalance,
      recentTransactions: transactions?.slice(0, 5) || [],
    }
  },
}