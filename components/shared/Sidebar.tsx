'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from '@/features/auth/components/LogoutButton'

export function Sidebar({ userEmail }: { userEmail?: string | null }) {
  const pathname = usePathname()

  const links = [
    { name: 'Tableau de bord', href: '/dashboard' },
    { name: 'Transactions', href: '/transactions' },
    { name: 'Budgets', href: '/budgets' },
  ]

  return (
    <aside className="w-64 border-r bg-white p-6 flex flex-col justify-between hidden md:flex h-screen sticky top-0">
      <div>
        <h1 className="text-xl font-bold text-blue-600 mb-8">Mes Finances</h1>
        <nav className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="pt-4 border-t">
        {userEmail && <p className="text-xs text-gray-500 truncate mb-3">{userEmail}</p>}
        <LogoutButton />
      </div>
    </aside>
  )
}