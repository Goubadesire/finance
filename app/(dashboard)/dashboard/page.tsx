import { Suspense } from 'react'
import Link from 'next/link'
import { PlusCircle, Wallet, ArrowUpRight, ChevronRight, Target } from 'lucide-react'
import { dashboardService } from '@/features/dashboard/services/dashboardService'
import DashboardClientContent from "@/features/dashboard/components/DashboardClientContent"

// Forcer le rendu dynamique si les données changent fréquemment
export const revalidate = 0 

export default async function DashboardPage() {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const formattedDate = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  // Chargement des données côté serveur (Zero Waterfall client)
  const summaryPromise = dashboardService.getDashboardSummary(currentMonth)

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-6">
      {/* En-tête statique rendu immédiatement */}
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Votre espace financier</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 md:text-3xl">Tableau de bord</h1>
          <p className="mt-1 text-sm capitalize text-slate-500">{formattedDate}</p>
        </div>
        <Link
          href="/transactions"
          className="flex items-center space-x-2 rounded-2xl bg-violet-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-700 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Transaction</span>
        </Link>
      </div>

      {/* Contenu dynamique chargé en streaming */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardDataFetcher summaryPromise={summaryPromise} />
      </Suspense>

      {/* Raccourcis statiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link 
          href="/budgets"
          className="app-surface flex items-center justify-between rounded-3xl p-5 transition-all hover:-translate-y-0.5 hover:border-violet-300 group"
        >
          <div>
            <h3 className="text-xs font-bold text-gray-900 group-hover:text-violet-600 transition-colors">Budgets</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Suivi des enveloppes</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Wallet className="w-4 h-4" />
          </div>
        </Link>

        <Link 
          href="/transactions"
          className="app-surface flex items-center justify-between rounded-3xl p-5 transition-all hover:-translate-y-0.5 hover:border-violet-300 group"
        >
          <div>
            <h3 className="text-xs font-bold text-gray-900 group-hover:text-violet-600 transition-colors">Transactions</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Historique complet</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </Link>

        <Link 
          href="/objectifs"
          className="app-surface flex items-center justify-between rounded-3xl p-5 transition-all hover:-translate-y-0.5 hover:border-violet-300 group sm:col-span-2"
        >
          <div>
            <h3 className="text-xs font-bold text-gray-900 group-hover:text-violet-600 transition-colors">Objectifs</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Vos cagnottes d&apos;épargne</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Target className="w-4 h-4" />
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </div>
        </Link>
      </div>
    </div>
  )
}

// Composant intermédiaire asynchrone
async function DashboardDataFetcher({ summaryPromise }: { summaryPromise: Promise<any> }) {
  const summary = await summaryPromise
  return <DashboardClientContent summary={summary} />
}

// Skeleton affiché en 0ms
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-44 w-full bg-gray-200 animate-pulse rounded-3xl" />
      <div className="space-y-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-14 bg-gray-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  )
}