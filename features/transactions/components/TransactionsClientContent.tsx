'use client'

import { useState, useMemo, useOptimistic, startTransition } from 'react'
import { Transaction } from '@/features/transactions/types'
import { transactionService } from '@/features/transactions/services/transactionService'
import { AddTransactionModal } from '@/features/transactions/components/AddTransactionModal'
import { ArrowDownLeft, ArrowUpRight, Receipt, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

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

export default function TransactionsClientContent({
  initialTransactions,
}: {
  initialTransactions: Transaction[]
}) {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)

  // Mises à jour optimistes : suppression instantanée dans l'UI
  const [optimisticTransactions, setOptimisticTransactions] = useOptimistic(
    initialTransactions,
    (state, idToRemove: string) => state.filter((tx) => tx.id !== idToRemove)
  )

  const handleRefresh = () => {
    router.refresh()
  }

  const confirmDelete = async () => {
    if (!transactionToDelete) return
    const id = transactionToDelete
    setTransactionToDelete(null)

    startTransition(() => {
      setOptimisticTransactions(id)
    })

    try {
      await transactionService.deleteTransaction(id)
      router.refresh()
    } catch (err) {
      console.error('Erreur lors de la suppression', err)
      alert('Impossible de supprimer la transaction.')
      router.refresh()
    }
  }

  // Filtrage mémoïsé pour éviter les recalculs inutiles
  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return optimisticTransactions
    return optimisticTransactions.filter((tx) => tx.type === filter)
  }, [optimisticTransactions, filter])

  return (
    <>
      <div className="flex justify-end -mt-12 mb-4">
        <AddTransactionModal onTransactionAdded={handleRefresh} />
      </div>

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
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 p-6 shadow-sm">
          <Receipt className="w-10 h-10 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-700 font-semibold text-sm">Aucune transaction trouvée</p>
          <p className="text-xs text-gray-400 mt-1">Vos mouvements s&apos;afficheront ici.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTransactions.map((tx) => {
            const isIncome = tx.type === 'income'

            return (
              <div
                key={tx.id}
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
                      {isIncome ? '+' : '-'}{Number(tx.amount).toLocaleString('fr-FR')} €
                    </span>
                    <p className="text-[10px] text-gray-400">{tx.date}</p>
                  </div>

                  <button
                    onClick={() => setTransactionToDelete(tx.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modale de confirmation */}
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
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}