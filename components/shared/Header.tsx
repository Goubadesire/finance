import { LogoutButton } from '@/features/auth/components/LogoutButton'
import { WalletCards } from 'lucide-react' // ou toute autre icône de votre choix

export function Header({ userEmail }: { userEmail?: string | null }) {
  return (
    <header className="sticky top-0 backdrop-blur-md bg-white/80 border-b border-gray-100 px-4 py-3.5 flex items-center justify-between md:hidden z-40 transition-all">
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
          <WalletCards className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900 tracking-tight">Mes Finances</h1>
          <span className="text-[10px] font-medium text-emerald-600">Compte personnel</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {userEmail && (
          <div className="hidden sm:flex items-center bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
            <span className="text-xs text-gray-600 font-medium max-w-[100px] truncate">{userEmail}</span>
          </div>
        )}
        <LogoutButton />
      </div>
    </header>
  )
}