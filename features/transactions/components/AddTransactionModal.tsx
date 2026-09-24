'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { transactionService } from '../services/transactionService'
import { Category, TransactionType } from '../types'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter 
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

export function AddTransactionModal({ onTransactionAdded }: { onTransactionAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  // Charger et filtrer les catégories à l'ouverture du modal ou lors du changement de type
 useEffect(() => {
    if (!open) return

    async function fetchAndFilterCategories() {
      try {
        const data = await transactionService.getCategories()
        if (data) {
          // Filtrer en ignorant les majuscules/minuscules pour être sûr
          const filtered = data.filter((cat: Category) =>
            cat.type?.toLowerCase() === type.toLowerCase()
          )
          
          setCategories(filtered)
          
          if (filtered.length > 0) {
            setCategoryId(filtered[0].id)
          } else {
            setCategoryId('')
          }
        }
      } catch (err) {
        console.error('Erreur chargement catégories:', err)
        toast.error('Erreur lors du chargement des catégories')
      }
    }

    fetchAndFilterCategories()
  }, [open, type])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !categoryId || !date) {
      toast.error('Veuillez remplir les champs obligatoires')
      return
    }

    setLoading(true)
    try {
      await transactionService.addTransaction({
        amount: parseFloat(amount),
        type,
        category_id: categoryId,
        date,
        description,
      })

      toast.success('Transaction enregistrée avec succès !')
      setAmount('')
      setDescription('')
      setOpen(false)
      onTransactionAdded()
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button className="group flex items-center space-x-2 rounded-xl bg-violet-600 px-4 py-3 text-xs font-bold text-white shadow-sm shadow-violet-600/15 transition-all hover:bg-violet-700 active:scale-95">
          <Plus className="w-4 h-4" />
          <span>Nouvelle transaction</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold tracking-tight">Nouvelle transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Sélecteur Type (Revenu / Dépense) */}
          <div className="flex rounded-2xl bg-slate-100 p-1.5">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                type === 'expense' ? 'bg-rose-50 text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Dépense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                type === 'income' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Revenu
            </button>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">Montant (€)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-base font-bold focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">Catégorie</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20"
            >
              {categories.length === 0 ? (
                <option disabled value="">Aucune catégorie disponible pour ce type</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">Description (optionnelle)</label>
            <input
              type="text"
              placeholder="ex: Salaire, Courses..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20"
            />
          </div>

          <DialogFooter className="pt-2">
            <button
              type="submit"
              disabled={loading || categories.length === 0}
              className="w-full rounded-2xl bg-violet-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/15 transition-all hover:bg-violet-700 disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Valider'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}