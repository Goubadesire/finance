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
    <header className="sticky top-0 backdrop-blur-md bg-white/80 border-b border-gray-100 px-4 py-3.5 flex items-center justify-between md:hidden z-40 transition-all">
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
          <WalletCards className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900 tracking-tight">
            Bonjour
          </h1>
          <span className="text-[10px] font-medium text-emerald-600">{displayName} 👋</span>
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