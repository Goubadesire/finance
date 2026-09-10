'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { transactionService } from '@/features/transactions/services/transactionService'
import { Transaction } from '@/features/transactions/types'
import { AddTransactionModal } from '@/features/transactions/components/AddTransactionModal'
import { ArrowDownLeft, ArrowUpRight, Receipt, Trash2, Loader2 } from 'lucide-react'

// Importations Shadcn UI
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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  // État pour la transaction ciblée par la suppression (null = fermée)
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)
  
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  const loadTransactions = useCallback(async () => {
    try {
      const data = await transactionService.getTransactions()
      setTransactions(data || [])
    } catch (err) {
      console.error('Erreur chargement transactions', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  // Exécution réelle de la suppression
  const confirmDelete = async () => {
    if (!transactionToDelete) return

    const id = transactionToDelete
    setTransactionToDelete(null) // Ferme la modale
    setDeletingId(id)

    try {
      await transactionService.deleteTransaction(id)
      setTransactions((prev) => prev.filter((tx) => tx.id !== id))
    } catch (err) {
      console.error('Erreur lors de la suppression', err)
      alert('Impossible de supprimer la transaction.')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true
    return tx.type === filter
  })

  return (
    <div className="space-y-5 pb-6">
      {/* En-tête mobile */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900">Transactions</h1>
          <p className="text-xs text-gray-400">Historique de vos flux financiers</p>
        </div>
        <AddTransactionModal onTransactionAdded={loadTransactions} />
      </motion.div>

      {/* Filtres rapides */}
      <div className="flex bg-gray-200/60 p-1 rounded-2xl">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter('expense')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filter === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Dépenses
        </button>
        <button
          onClick={() => setFilter('income')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filter === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Revenus
        </button>
      </div>

      {/* Liste des transactions */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 p-6 shadow-sm"
        >
          <Receipt className="w-10 h-10 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-700 font-semibold text-sm">Aucune transaction trouvée</p>
          <p className="text-xs text-gray-400 mt-1">Vos mouvements s&apos;afficheront ici.</p>
        </motion.div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence>
            {filteredTransactions.map((tx, index) => {
              const isIncome = tx.type === 'income'
              const isDeleting = deletingId === tx.id

              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {isIncome ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {tx.categories?.name || (isIncome ? 'Revenu' : 'Dépense')}
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        {tx.description || tx.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className={`text-sm font-extrabold block ${isIncome ? 'text-emerald-600' : 'text-gray-900'}`}>
                        {isIncome ? '+' : '-'}{Number(tx.amount).toLocaleString()} €
                      </span>
                      <p className="text-[10px] text-gray-400">{tx.date}</p>
                    </div>

                    {/* Bouton qui déclenche l'ouverture de la modale */}
                    <button
                      onClick={() => setTransactionToDelete(tx.id)}
                      disabled={isDeleting}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                      title="Supprimer"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modale de confirmation Shadcn UI */}
      <AlertDialog
        open={!!transactionToDelete}
        onOpenChange={(open) => !open && setTransactionToDelete(null)}
      >
        <AlertDialogContent className="rounded-3xl max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la transaction ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La transaction sera définitivement retirée de votre historique.
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