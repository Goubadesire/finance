'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { budgetService, BudgetWithSpending } from '@/features/budgets/services/budgetService'
import { AddBudgetModal } from '@/features/budgets/components/AddBudgetModal'
import { Wallet, AlertCircle, TrendingDown, CheckCircle2 } from 'lucide-react'

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetWithSpending[]>([])
  const [loading, setLoading] = useState(true)
  const currentMonth = new Date().toISOString().slice(0, 7)

  const loadBudgets = useCallback(async () => {
    try {
      const data = await budgetService.getBudgetsWithSpending(currentMonth)
      setBudgets(data)
    } catch (err) {
      console.error('Erreur lors du chargement des budgets', err)
    } finally {
      setLoading(false)
    }
  }, [currentMonth])

  useEffect(() => {
    loadBudgets()
  }, [loadBudgets])

  // Calculs globaux pour le récapitulatif mobile
  const totalLimit = budgets.reduce((acc, b) => acc + Number(b.amount_limit), 0)
  const totalSpent = budgets.reduce((acc, b) => acc + Number(b.spent), 0)
  const globalPercentage = totalLimit > 0 ? Math.min(Math.round((totalSpent / totalLimit) * 100), 100) : 0

  return (
    <div className="space-y-5 pb-6">
      {/* En-tête mobile épuré */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900">Budgets du mois</h1>
          <p className="text-xs text-gray-400">Gérez vos enveloppes de dépenses</p>
        </div>
        <AddBudgetModal onBudgetAdded={loadBudgets} />
      </motion.div>

      {/* Carte Résumé Global (Style Fintech mobile) */}
      {!loading && budgets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950 p-5 text-white shadow-lg"
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">Synthèse globale</span>
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-300 backdrop-blur-md">
              {currentMonth}
            </span>
          </div>

          <div className="flex justify-between items-baseline mb-4">
            <div>
              <span className="text-2xl font-bold tracking-tight">{totalSpent.toLocaleString()} €</span>
              <span className="text-xs text-gray-400 ml-1.5">/ {totalLimit.toLocaleString()} € max</span>
            </div>
            <span className="text-sm font-semibold text-emerald-400">{globalPercentage}%</span>
          </div>

          {/* Barre de progression globale */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${globalPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${totalSpent > totalLimit ? 'bg-red-500' : 'bg-emerald-400'}`}
            />
          </div>
        </motion.div>
      )}

      {/* Liste des budgets */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 p-6 shadow-sm"
        >
          <Wallet className="w-10 h-10 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-700 font-semibold text-sm">Aucun budget ce mois-ci</p>
          <p className="text-xs text-gray-400 mt-1">Appuyez sur "Nouveau budget" pour commencer.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {budgets.map((budget, index) => {
            const percentage = Math.min(Math.round((budget.spent / budget.amount_limit) * 100), 100)
            const isExceeded = budget.spent > budget.amount_limit
            const remaining = budget.amount_limit - budget.spent

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-gray-100 transition-all active:scale-[0.99]"
              >
                {/* Liseré latéral coloré pour identifier la catégorie d'un coup d'œil */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: budget.categories?.color || '#10b981' }}
                />

                <div className="flex justify-between items-start mb-2 pl-2">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm"
                      style={{ backgroundColor: budget.categories?.color || '#10b981' }}
                    >
                      {budget.categories?.name ? budget.categories.name.charAt(0).toUpperCase() : 'B'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        {budget.categories?.name || 'Catégorie'}
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        {isExceeded ? 'Budget dépassé !' : `Reste ${remaining.toLocaleString()} €`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">{budget.spent} €</span>
                    <p className="text-[11px] text-gray-400">sur {budget.amount_limit} €</p>
                  </div>
                </div>

                {/* Barre de progression épurée */}
                <div className="pl-2 space-y-1 mt-3">
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className={`h-full rounded-full ${isExceeded ? 'bg-red-500' : 'bg-emerald-500'}`}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      {isExceeded ? (
                        <AlertCircle className="w-3 h-3 text-red-500" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      )}
                      {percentage}% utilisé
                    </span>
                    <span>{budget.month_year}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}