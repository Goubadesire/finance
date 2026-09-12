'use client'

import { useState } from 'react'
import { Loader2, Pencil } from 'lucide-react'
import { goalService } from '@/features/objectifs/services/goalService'
import { Goal } from '@/features/objectifs/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function EditGoalModal({
  goal,
  onGoalUpdated,
}: {
  goal: Goal
  onGoalUpdated: () => void
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(goal.title)
  const [targetAmount, setTargetAmount] = useState(String(goal.target_amount))
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const value = Number(targetAmount)
    if (!title.trim() || !value || value <= 0) return

    setLoading(true)
    try {
      await goalService.updateGoal(goal.id, { title: title.trim(), target_amount: value })
      setOpen(false)
      onGoalUpdated()
    } catch (err) {
      console.error('Erreur modification objectif', err)
      alert("Impossible de modifier l'objectif.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button
          className="p-2 text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
          title="Modifier"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl max-w-[90vw] sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Modifier l&apos;objectif</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-semibold text-gray-500">Titre</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500">Montant cible (FCFA)</label>
            <input
              type="number"
              min={1}
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !title || !targetAmount}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enregistrer'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}