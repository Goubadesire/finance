'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { budgetService, BudgetWithSpending } from '@/features/budgets/services/budgetService'
import { AddBudgetModal } from '@/features/budgets/components/AddBudgetModal'
import { Wallet, AlertCircle, CheckCircle2, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetWithSpending[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null)

  // Mois courant au format YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7))

  const loadBudgets = useCallback(async () => {
    setLoading(true)
    try {
      const data = await budgetService.getBudgetsWithSpending(selectedMonth)
      setBudgets(data)
    } catch (err) {
      console.error('Erreur lors du chargement des budgets', err)
    } finally {
      setLoading(false)
    }
  }, [selectedMonth])

  useEffect(() => {
    loadBudgets()
  }, [loadBudgets])

  // Navigation entre les mois
  const changeMonth = (offset: number) => {
    const [year, month] = selectedMonth.split('-').map(Number)
    const newDate = new Date(year, month - 1 + offset, 1)
    setSelectedMonth(newDate.toISOString().slice(0, 7))
  }

  // Suppression du budget
  const confirmDelete = async () => {
    if (!budgetToDelete) return
    const id = budgetToDelete
    setBudgetToDelete(null)
    setDeletingId(id)

    try {
      await budgetService.deleteBudget(id)
      setBudgets((prev) => prev.filter((b) => b.id !== id))
    } catch (err) {
      console.error('Erreur lors de la suppression du budget', err)
    } finally {
      setDeletingId(null)
    }
  }

  const totalLimit = budgets.reduce((acc, b) => acc + Number(b.amount_limit), 0)
  const totalSpent = budgets.reduce((acc, b) => acc + Number(b.spent), 0)
  const globalPercentage = totalLimit > 0 ? Math.min(Math.round((totalSpent / totalLimit) * 100), 100) : 0

  return (
    <div className="page-enter mx-auto max-w-6xl space-y-7 pb-6">
      {/* En-tête + Sélecteur de mois */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="eyebrow">Maîtrise du quotidien</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 md:text-3xl">Budgets</h1>
          <p className="mt-1 text-sm text-slate-500">Donnez une intention à chaque euro</p>
        </div>
        <AddBudgetModal onBudgetAdded={loadBudgets} />
      </motion.div>

      {/* Barre de navigation du mois */}
      <div className="flex items-center justify-between bg-white border border-gray-100 p-2 rounded-2xl shadow-sm">
        <button 
          onClick={() => changeMonth(-1)}
          className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-600 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold text-gray-800">
          {new Date(`${selectedMonth}-01`).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </span>
        <button 
          onClick={() => changeMonth(1)}
          className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-600 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Résumé Global */}
      {!loading && budgets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950 p-5 text-white shadow-lg"
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">Synthèse globale</span>
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-300 backdrop-blur-md">
              {selectedMonth}
            </span>
          </div>

          <div className="flex justify-between items-baseline mb-4">
            <div>
              <span className="text-2xl font-bold tracking-tight">{totalSpent.toLocaleString()} €</span>
              <span className="text-xs text-gray-400 ml-1.5">/ {totalLimit.toLocaleString()} € max</span>
            </div>
            <span className={`text-sm font-semibold ${totalSpent > totalLimit ? 'text-red-400' : 'text-emerald-400'}`}>
              {globalPercentage}%
            </span>
          </div>

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
          <p className="text-gray-700 font-semibold text-sm">Aucun budget défini pour ce mois</p>
          <p className="text-xs text-gray-400 mt-1">Créez votre première enveloppe budgétaire.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {budgets.map((budget, index) => {
              const percentage = Math.min(Math.round((budget.spent / budget.amount_limit) * 100), 100)
              const isExceeded = budget.spent > budget.amount_limit
              const remaining = budget.amount_limit - budget.spent
              const isDeleting = deletingId === budget.id

              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-gray-100"
                >
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1.5"
                    style={{ backgroundColor: budget.categories?.color || '#10b981' }}
                  />

                  <div className="flex justify-between items-start mb-2 pl-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0"
                        style={{ backgroundColor: budget.categories?.color || '#10b981' }}
                      >
                        {budget.categories?.name ? budget.categories.name.charAt(0).toUpperCase() : 'B'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">
                          {budget.categories?.name || 'Catégorie'}
                        </h3>
                        <p className={`text-[11px] ${isExceeded ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                          {isExceeded ? 'Dépassement !' : `Reste ${remaining.toLocaleString()} €`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">{budget.spent.toLocaleString()} €</span>
                        <p className="text-[11px] text-gray-400">/ {budget.amount_limit.toLocaleString()} €</p>
                      </div>

                      <button
                        onClick={() => setBudgetToDelete(budget.id)}
                        disabled={isDeleting}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Supprimer"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

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
          </AnimatePresence>
        </div>
      )}

      {/* Confirmation de suppression */}
      <AlertDialog
        open={!!budgetToDelete}
        onOpenChange={(open) => !open && setBudgetToDelete(null)}
      >
        <AlertDialogContent className="rounded-3xl max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce budget ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera l&apos;enveloppe budgétaire pour ce mois. Vos transactions associées ne seront pas effacées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-red-600 rounded-xl"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}