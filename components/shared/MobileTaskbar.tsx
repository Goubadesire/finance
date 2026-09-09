'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ArrowLeftRight, PieChart, Settings } from 'lucide-react'

export function MobileTaskbar() {
  const pathname = usePathname()

  const links = [
    { name: 'Accueil', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
    { name: 'Budgets', href: '/budgets', icon: PieChart },
    //{ label: 'Paramètres', href: '/settings', icon: Settings },
  ]

  return (
    <nav aria-label="Navigation mobile" className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 flex justify-around items-center h-16 z-50 px-4 shadow-sm">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
              isActive ? 'text-emerald-600 font-semibold' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {/* Style inspiré de l'indicateur actif épuré */}
            {isActive && (
              <span className="absolute top-0 w-12 h-1 bg-emerald-600 rounded-full" />
            )}
            <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
            <span className="text-[11px] tracking-tight">{link.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}