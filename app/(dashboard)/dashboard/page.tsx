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
  PlusCircle,
  PiggyBank
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

  const isNegativeBalance = (summary?.netBalance ?? 0) < 0

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
          <p className="text-xs text-gray-400">
            {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link
          href="/transactions"
          className="flex items-center space-x-1.5 bg-emerald-600 text-white px-3.5 py-2 rounded-2xl text-xs font-semibold shadow-sm hover:bg-emerald-700 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Transaction</span>
        </Link>
      </motion.div>

      {/* Carte principale dynamique (Couleur adaptable selon le solde) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-lg transition-colors ${
          isNegativeBalance
            ? 'bg-gradient-to-br from-rose-600 via-rose-700 to-red-900'
            : 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900'
        }`}
      >
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-between items-center mb-1">
          <p className="text-xs font-medium uppercase tracking-wider text-white/80">Solde net du mois</p>
          <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full text-white/90 backdrop-blur-md">
            Mensuel
          </span>
        </div>

        <h2 className="text-3xl font-black tracking-tight mb-6">
          {loading ? (
            <div className="h-9 w-32 bg-white/20 rounded-xl animate-pulse" />
          ) : (
            `${summary?.netBalance.toLocaleString() ?? 0} €`
          )}
        </h2>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/15">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-emerald-100" />
            </div>
            <div>
              <p className="text-[10px] text-white/80 uppercase tracking-wide">Revenus</p>
              <p className="text-sm font-bold">
                {loading ? '...' : `+${summary?.totalIncome.toLocaleString() ?? 0} €`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <TrendingDown className="w-4 h-4 text-rose-100" />
            </div>
            <div>
              <p className="text-[10px] text-white/80 uppercase tracking-wide">Dépenses</p>
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
          className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-emerald-500/50 transition-all active:scale-98 group"
        >
          <div>
            <h3 className="text-xs font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">Budgets</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Suivi des enveloppes</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Wallet className="w-4 h-4" />
          </div>
        </Link>

        <Link 
          href="/transactions"
          className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-emerald-500/50 transition-all active:scale-98 group"
        >
          <div>
            <h3 className="text-xs font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">Transactions</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Historique complet</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Section Dernières Transactions */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-900">Derniers mouvements</h3>
          <Link href="/transactions" className="text-xs font-semibold text-emerald-600 flex items-center hover:underline">
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
            <p className="text-xs text-gray-400">Aucune transaction enregistrée ce mois-ci.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {summary?.recentTransactions.map((tx: any, index: number) => {
              const isIncome = tx.type === 'income'
              return (
                <motion.div
                  key={tx.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
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