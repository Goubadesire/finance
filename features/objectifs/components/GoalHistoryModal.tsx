'use client'

import { useEffect, useState } from 'react'
import { History, Pencil, Trash2, Check, X } from 'lucide-react'
import { goalService } from '@/features/objectifs/services/goalService'
import { GoalContribution } from '@/features/objectifs/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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

function formatFCFA(value: number) {
  return `${Number(value).toLocaleString('fr-FR')} FCFA`
}

export function GoalHistoryModal({
  goalId,
  goalTitle,
  onChanged,
}: {
  goalId: string
  goalTitle: string
  onChanged: () => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [contributions, setContributions] = useState<GoalContribution[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [toDelete, setToDelete] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await goalService.getContributions(goalId)
      setContributions(data)
    } catch (err) {
      console.error('Erreur chargement historique', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) load()
  }, [open])

  const startEdit = (c: GoalContribution) => {
    setEditingId(c.id)
    setEditValue(String(c.amount))
  }

  const saveEdit = async (id: string) => {
    const value = Number(editValue)
    if (!value || value <= 0) return

    try {
      await goalService.updateContribution(id, value)
      setEditingId(null)
      await load()
      onChanged()
    } catch (err) {
      console.error('Erreur modification versement', err)
      alert('Impossible de modifier ce versement.')
    }
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    const id = toDelete
    setToDelete(null)

    try {
      await goalService.deleteContribution(id)
      await load()
      onChanged()
    } catch (err) {
      console.error('Erreur suppression versement', err)
      alert('Impossible de supprimer ce versement.')
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">
            <History className="w-3.5 h-3.5" />
            Historique
          </button>
        </DialogTrigger>
        <DialogContent className="rounded-3xl max-w-[90vw] sm:max-w-sm max-h-[70vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Versements — {goalTitle}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-2 pt-2">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : contributions.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">Aucun versement pour le moment.</p>
            ) : (
              contributions.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  {editingId === c.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="number"
                        min={1}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button onClick={() => saveEdit(c.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{formatFCFA(c.amount)}</p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(c.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(c)}
                          className="p-1.5 text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setToDelete(c.id)}
                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="rounded-3xl max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce versement ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le montant sera retiré de la progression de l&apos;objectif.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}