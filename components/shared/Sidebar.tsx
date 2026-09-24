'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from '@/features/auth/components/LogoutButton'
import { ArrowLeftRight, LayoutDashboard, PieChart, Target, WalletCards } from 'lucide-react'

export function Sidebar({ userEmail }: { userEmail?: string | null }) {
  const pathname = usePathname()

  const links = [
    { name: 'Vue d’ensemble', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
    { name: 'Budgets', href: '/budgets', icon: PieChart },
    { name: 'Objectifs', href: '/objectifs', icon: Target },
  ]

  return (
    <aside className="sticky top-0 hidden h-screen w-[17rem] shrink-0 flex-col justify-between border-r border-slate-200/80 bg-white/75 px-5 py-7 text-slate-900 backdrop-blur-xl md:flex">
      <div>
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
            <WalletCards className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight">Finance</h1>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">Votre équilibre</p>
          </div>
        </div>
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Navigation</p>
        <nav className="space-y-1.5">
          {links.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-violet-100 text-violet-800 font-bold shadow-sm shadow-violet-900/5'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.5 : 1.8} />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="border-t border-slate-200 pt-5">
        {userEmail && <p className="mb-3 truncate px-2 text-xs text-slate-400">{userEmail}</p>}
        <LogoutButton />
      </div>
    </aside>
  )
}