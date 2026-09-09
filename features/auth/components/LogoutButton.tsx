'use client'

import { useRouter } from 'next/navigation'
import { authService } from '../services/authService'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await authService.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
    >
      Se déconnecter
    </button>
  )
}