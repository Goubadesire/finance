'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { dashboardService } from '@/features/dashboard/services/dashboardService'
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle 
} from 'lucide-react'

export default function DashboardPage() {
  const [summary, setSummary] = useState<{
    totalIncome: number
    totalExpense: number
    netBalance: number
    recentTransactions: any[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  const currentMonth = new Date().toISOString().slice(0, 7) // 'YYYY-MM'

  const loadDashboardData = useCallback(async () => {
    try {
      const data = await dashboardService.getDashboardSummary(currentMonth)
      setSummary(data)
    } catch (err) {
      console.error('Erreur chargement dashboard', err)
    } finally {
      setLoading(false)
    }
  }, [currentMonth])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  return (
    <div className="space-y-6 pb-6">
      {/* En-tête de bienvenue */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900">Tableau de bord</h1>
          <p className="text-xs text-gray-400">Vue d'ensemble de ce mois</p>
        </div>
        <div className="flex space-x-2">
          <Link
            href="/dashboard/transactions"
            className="flex items-center space-x-1 bg-gray-900 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm hover:bg-gray-800 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Action</span>
          </Link>
        </div>
      </motion.div>

      {/* Carte principale de Solde Net (Style Fintech mobile) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 p-6 text-white shadow-lg"
      >
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <p className="text-xs font-medium uppercase tracking-wider text-emerald-100/80 mb-1">Solde net du mois</p>
        <h2 className="text-3xl font-black tracking-tight mb-6">
          {loading ? '...' : `${summary?.netBalance.toLocaleString() ?? 0} €`}
        </h2>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/15">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-100 uppercase tracking-wide">Revenus</p>
              <p className="text-sm font-bold">
                {loading ? '...' : `+${summary?.totalIncome.toLocaleString() ?? 0} €`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-rose-200" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-100 uppercase tracking-wide">Dépenses</p>
              <p className="text-sm font-bold">
                {loading ? '...' : `-${summary?.totalExpense.toLocaleString() ?? 0} €`}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Raccourcis / Liens rapides modules */}
      <div className="grid grid-cols-2 gap-3">
        <Link 
          href="/budgets"
          className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-emerald-500/50 transition-all group"
        >
          <div>
            <h3 className="text-xs font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">Budgets</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Gérer les enveloppes</p>
          </div>
          <Wallet className="w-5 h-5 text-emerald-600" />
        </Link>

        <Link 
          href="/transactions"
          className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-emerald-500/50 transition-all group"
        >
          <div>
            <h3 className="text-xs font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">Transactions</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Historique complet</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-emerald-600" />
        </Link>
      </div>

      {/* Section Dernières Transactions */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-900">Derniers mouvements</h3>
          <Link href="/dashboard/transactions" className="text-xs font-semibold text-emerald-600 flex items-center hover:underline">
            Voir tout <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-14 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : summary?.recentTransactions.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-gray-200 p-4">
            <p className="text-xs text-gray-400">Aucune transaction enregistrée pour l'instant.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {summary?.recentTransactions.map((tx: any, index: number) => {
              const isIncome = tx.type === 'income'
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">
                        {tx.categories?.name || (isIncome ? 'Revenu' : 'Dépense')}
                      </h4>
                      <p className="text-[10px] text-gray-400">{tx.description || tx.date}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-extrabold ${isIncome ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {isIncome ? '+' : '-'}{Number(tx.amount).toLocaleString()} €
                  </span>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}