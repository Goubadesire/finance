'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react'

interface SummaryData {
  totalIncome: number
  totalExpense: number
  netBalance: number
  recentTransactions: any[]
}

export default function DashboardClientContent({ summary }: { summary: SummaryData }) {
  const isNegativeBalance = summary.netBalance < 0

  return (
    <>
      {/* Carte Solde avec rendu GPU optimisé */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-lg transition-colors ${
          isNegativeBalance
            ? 'bg-gradient-to-br from-rose-600 via-rose-700 to-red-900'
            : 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900'
        }`}
      >
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs font-medium uppercase tracking-wider text-white/80">Solde net du mois</p>
          <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full text-white/90 backdrop-blur-md">
            Mensuel
          </span>
        </div>

        <h2 className="text-3xl font-black tracking-tight mb-6">
          {summary.netBalance.toLocaleString('fr-FR')} €
        </h2>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/15">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-emerald-100" />
            </div>
            <div>
              <p className="text-[10px] text-white/80 uppercase tracking-wide">Revenus</p>
              <p className="text-sm font-bold">+{summary.totalIncome.toLocaleString('fr-FR')} €</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <TrendingDown className="w-4 h-4 text-rose-100" />
            </div>
            <div>
              <p className="text-[10px] text-white/80 uppercase tracking-wide">Dépenses</p>
              <p className="text-sm font-bold">-{summary.totalExpense.toLocaleString('fr-FR')} €</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Derniers mouvements */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-900">Derniers mouvements</h3>
          <Link href="/transactions" className="text-xs font-semibold text-emerald-600 flex items-center hover:underline">
            Voir tout <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>

        {summary.recentTransactions.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-gray-200 p-4">
            <p className="text-xs text-gray-400">Aucune transaction enregistrée ce mois-ci.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {summary.recentTransactions.map((tx) => {
              const isIncome = tx.type === 'income'
              return (
                <div
                  key={tx.id}
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
                    {isIncome ? '+' : '-'}{Number(tx.amount).toLocaleString('fr-FR')} €
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}