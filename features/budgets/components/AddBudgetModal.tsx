'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { budgetService } from '../services/budgetService'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter 
} from '@/components/ui/dialog'
import { PlusCircle } from 'lucide-react'

export function AddBudgetModal({ onBudgetAdded }: { onBudgetAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [amountLimit, setAmountLimit] = useState('')
  const [loading, setLoading] = useState(false)
  
  // État pour créer une catégorie à la volée si besoin
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [newCatName, setNewCatName] = useState('')

  const currentMonth = new Date().toISOString().slice(0, 7)

  const loadCategories = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('type', 'expense')

    if (!error && data) {
      setCategories(data)
      if (data.length > 0) setCategoryId(data[0].id)
    }
  }, [])

  useEffect(() => {
    if (open) {
      loadCategories()
    }
  }, [open, loadCategories])

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('categories')
      .insert([{ user_id: user.id, name: newCatName, type: 'expense', color: '#10b981' }])
      .select()

    if (error) {
      toast.error("Erreur lors de la création de la catégorie")
    } else {
      toast.success("Catégorie créée !")
      setNewCatName('')
      setIsCreatingCategory(false)
      await loadCategories()
      if (data && data[0]) setCategoryId(data[0].id)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId || !amountLimit) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    setLoading(true)
    try {
      await budgetService.addBudget({
        category_id: categoryId,
        amount_limit: parseFloat(amountLimit),
        month_year: currentMonth,
      })

      toast.success('Budget créé avec succès !')
      setAmountLimit('')
      setOpen(false)
      onBudgetAdded()
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la création du budget")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-all active:scale-95">
          <PlusCircle className="w-4 h-4" />
          <span>Nouveau budget</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Ajouter un budget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Catégorie de dépense</label>
              <button
                type="button"
                onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                className="text-xs text-emerald-600 hover:underline font-medium"
              >
                {isCreatingCategory ? 'Choisir existante' : '+ Créer nouvelle'}
              </button>
            </div>

            {isCreatingCategory ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Nom de la catégorie"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="bg-gray-900 text-white px-3 py-2 rounded-xl text-sm font-medium"
                >
                  Ajouter
                </button>
              </div>
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categories.length === 0 ? (
                  <option disabled value="">Aucune catégorie disponible</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plafond limite (€)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="ex: 300"
              value={amountLimit}
              onChange={(e) => setAmountLimit(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <DialogFooter className="pt-4">
            <button
              type="submit"
              disabled={loading || categories.length === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium text-sm shadow-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer le budget'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}