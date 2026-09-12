'use client'

import { useEffect, useState, useCallback } from 'react'
import { Goal } from '@/features/objectifs/types'
import { goalService } from '@/features/objectifs/services/goalService'
import { AddGoalModal } from '@/features/objectifs/components/AddGoalModal'
import { AddFundsModal } from '@/features/objectifs/components/AddFundsModal'
import { EditGoalModal } from '@/features/objectifs/components/EditGoalModal'
import { GoalHistoryModal } from '@/features/objectifs/components/GoalHistoryModal'
import { Target, Trash2, PartyPopper, Loader2 } from 'lucide-react'

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

export default function GoalsClientContent() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null)

  const loadGoals = useCallback(async () => {
    try {
      const data = await goalService.getGoals()
      setGoals(data || [])
    } catch (err) {
      console.error('Erreur chargement objectifs', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGoals()
  }, [loadGoals])

  const confirmDelete = async () => {
    if (!goalToDelete) return
    const id = goalToDelete
    setGoalToDelete(null)
    setDeletingId(id)

    try {
      await goalService.deleteGoal(id)
      setGoals((prev) => prev.filter((g) => g.id !== id))
    } catch (err) {
      console.error('Erreur suppression objectif', err)
      alert("Impossible de supprimer l'objectif.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <div className="flex items-center justify-end mb-1">
        <AddGoalModal onGoalAdded={loadGoals} />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 p-6 shadow-sm">
          <Target className="w-10 h-10 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-700 font-semibold text-sm">Aucun objectif pour le moment</p>
          <p className="text-xs text-gray-400 mt-1">Créez une cagnotte pour commencer à épargner.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const pct = Math.min(
              100,
              Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100)
            )
            const isComplete = pct >= 100
            const isDeleting = deletingId === goal.id

            return (
              <div key={goal.id} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isComplete ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {isComplete ? <PartyPopper className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{goal.title}</h4>
                      <p className="text-[11px] text-gray-400">
                        {formatFCFA(goal.current_amount)} / {formatFCFA(goal.target_amount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <EditGoalModal goal={goal} onGoalUpdated={loadGoals} />
                    <button
                      onClick={() => setGoalToDelete(goal.id)}
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
                </div>

                <div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{pct}% atteint</p>
                </div>

                <div className="flex items-center gap-2">
                  <AddFundsModal goalId={goal.id} goalTitle={goal.title} onFundsAdded={loadGoals} />
                  <GoalHistoryModal goalId={goal.id} goalTitle={goal.title} onChanged={loadGoals} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AlertDialog open={!!goalToDelete} onOpenChange={(open) => !open && setGoalToDelete(null)}>
        <AlertDialogContent className="rounded-3xl max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet objectif ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La cagnotte et son historique de versements seront définitivement supprimés.
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