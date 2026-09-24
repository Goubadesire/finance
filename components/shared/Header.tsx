import { LogoutButton } from '@/features/auth/components/LogoutButton'
import { WalletCards, User } from 'lucide-react'

interface HeaderProps {
  userEmail?: string | null
  userName?: string | null
}

export function Header({ userEmail, userName }: HeaderProps) {
  // Détermine le nom à afficher : userName > partie locale de l'email > 'Utilisateur'
  const displayName = userName || userEmail?.split('@')[0] || 'Utilisateur'

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/70 bg-white/75 px-4 py-4 backdrop-blur-xl md:hidden">
      <div className="flex items-center space-x-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
          <WalletCards className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-extrabold tracking-tight text-slate-950">
            Bonjour
          </h1>
          <span className="text-[10px] font-semibold text-emerald-700">{displayName} 👋</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {userEmail && (
          <div className="hidden sm:flex items-center space-x-1.5 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
            <User className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-600 font-medium max-w-[120px] truncate">
              {displayName}
            </span>
          </div>
        )}
        <LogoutButton />
      </div>
    </header>
  )
}