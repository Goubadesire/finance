'use client'

import { useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { goalService } from '@/features/objectifs/services/goalService'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function AddGoalModal({ onGoalAdded }: { onGoalAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const value = Number(targetAmount)
    if (!title.trim() || !value || value <= 0) return

    setLoading(true)
    try {
      await goalService.addGoal({ title: title.trim(), target_amount: value })
      setTitle('')
      setTargetAmount('')
      setOpen(false)
      onGoalAdded()
    } catch (err) {
      console.error('Erreur création objectif', err)
      alert("Impossible de créer l'objectif.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 transition-all">
          <Plus className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl max-w-[90vw] sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Nouvel objectif d&apos;épargne</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-semibold text-gray-500">Titre</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : MacBook Pro M3"
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
              placeholder="Ex : 1 200 000"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !title || !targetAmount}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Créer la cagnotte'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}