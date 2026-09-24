'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { transactionService } from '@/features/transactions/services/transactionService'
import { Transaction } from '@/features/transactions/types'
import { AddTransactionModal } from '@/features/transactions/components/AddTransactionModal'
import { ArrowDownLeft, ArrowUpRight, Receipt, Trash2, Loader2, Search, TrendingDown, TrendingUp, WalletCards } from 'lucide-react'

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
  const [search, setSearch] = useState('')

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
    const matchesFilter = filter === 'all' || tx.type === filter
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || [
      tx.description,
      tx.categories?.name,
      tx.date,
    ].some((value) => value?.toLowerCase().includes(query))

    return matchesFilter && matchesSearch
  })

  const totalIncome = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0)
  const totalExpense = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0)

  return (
    <div className="page-enter mx-auto max-w-5xl space-y-10 pb-8 md:space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6 border-b border-slate-200/80 pb-8 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="eyebrow">Centre de pilotage</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">Transactions</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Chaque mouvement compte. Retrouvez, comprenez et gardez le contrôle de votre quotidien.</p>
        </div>
        <AddTransactionModal onTransactionAdded={loadTransactions} />
      </motion.div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 border-l-2 border-violet-400 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><WalletCards className="h-4 w-4" /></div>
          <div><p className="text-xs text-slate-500">Mouvements</p><p className="text-lg font-extrabold text-slate-950">{transactions.length}</p></div>
        </div>
        <div className="flex items-center gap-3 border-l-2 border-emerald-400 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><TrendingUp className="h-4 w-4" /></div>
          <div><p className="text-xs text-slate-500">Revenus</p><p className="text-lg font-extrabold text-emerald-700">+{totalIncome.toLocaleString('fr-FR')} €</p></div>
        </div>
        <div className="flex items-center gap-3 border-l-2 border-rose-400 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-700"><TrendingDown className="h-4 w-4" /></div>
          <div><p className="text-xs text-slate-500">Dépenses</p><p className="text-lg font-extrabold text-rose-700">-{totalExpense.toLocaleString('fr-FR')} €</p></div>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-b border-t border-slate-200/80 py-5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher une catégorie, une note..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          />
        </div>
        <div className="flex rounded-xl bg-slate-100 p-1">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
            filter === 'all' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter('expense')}
          className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
            filter === 'expense' ? 'bg-rose-50 text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-950'
          }`}
        >
          Dépenses
        </button>
        <button
          onClick={() => setFilter('income')}
          className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
            filter === 'income' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-950'
          }`}
        >
          Revenus
        </button>
        </div>
      </div>

      {/* Liste des transactions */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-20 border-b border-slate-200/70 animate-pulse" />
          ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-y border-dashed border-slate-300 px-6 py-20 text-center"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600"><Receipt className="h-6 w-6" /></div>
          <p className="text-base font-extrabold text-slate-900">Aucune transaction trouvée</p>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">{search ? 'Essayez une autre recherche ou modifiez le filtre.' : 'Ajoutez votre premier mouvement pour commencer à voir votre activité.'}</p>
        </motion.div>
      ) : (
        <div className="divide-y divide-slate-200/80 border-y border-slate-200/80 bg-white/45">
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
                  className="group flex items-center justify-between px-2 py-5 transition-colors hover:bg-violet-50/40 md:px-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {isIncome ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 md:text-base">
                        {tx.categories?.name || (isIncome ? 'Revenu' : 'Dépense')}
                      </h4>
                      <p className="mt-0.5 max-w-[10rem] truncate text-xs text-slate-500 md:max-w-none">
                        {tx.description || tx.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className={`block text-sm font-extrabold md:text-base ${isIncome ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isIncome ? '+' : '-'}{Number(tx.amount).toLocaleString()} €
                      </span>
                      <p className="mt-0.5 text-[10px] text-slate-400">{new Date(`${tx.date}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>

                    {/* Bouton qui déclenche l'ouverture de la modale */}
                    <button
                      onClick={() => setTransactionToDelete(tx.id)}
                      disabled={isDeleting}
                      className="rounded-xl p-2 text-slate-300 transition-all hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
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