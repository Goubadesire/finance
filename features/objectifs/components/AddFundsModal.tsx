'use client'

import { useState } from 'react'
import { Loader2, Wallet } from 'lucide-react'
import { goalService } from '@/features/objectifs/services/goalService'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function AddFundsModal({
  goalId,
  goalTitle,
  onFundsAdded,
}: {
  goalId: string
  goalTitle: string
  onFundsAdded: () => void
}) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const value = Number(amount)
    if (!value || value <= 0) return

    setLoading(true)
    try {
      await goalService.addFunds(goalId, value)
      setAmount('')
      setOpen(false)
      onFundsAdded()
    } catch (err) {
      console.error('Erreur ajout de fonds', err)
      alert("Impossible d'ajouter les fonds.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all">
          <Wallet className="w-3.5 h-3.5" />
          Ajouter des fonds
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl max-w-[90vw] sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Alimenter « {goalTitle} »</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-semibold text-gray-500">Montant (FCFA)</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex : 25 000"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !amount}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Valider'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}