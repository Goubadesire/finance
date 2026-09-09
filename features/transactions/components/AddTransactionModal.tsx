'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { transactionService } from '../services/transactionService'
import { TransactionType } from '../types'
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
  const [categories, setCategories] = useState<any[]>([])
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
        console.log("Données brutes reçues de Supabase :", data)
        
        if (data) {
          // Filtrer en ignorant les majuscules/minuscules pour être sûr
          const filtered = data.filter((cat: any) => 
            cat.type?.toLowerCase() === type.toLowerCase()
          )
          
          console.log(`Filtré pour le type [${type}] :`, filtered)
          
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
        <button className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95">
          <Plus className="w-4 h-4" />
          <span>Ajouter</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Nouvelle transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Sélecteur Type (Revenu / Dépense) */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                type === 'expense' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Dépense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Revenu
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Montant (€)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Catégorie</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Description (optionnelle)</label>
            <input
              type="text"
              placeholder="ex: Salaire, Courses..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <DialogFooter className="pt-2">
            <button
              type="submit"
              disabled={loading || categories.length === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold text-sm shadow-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Valider'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}