import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/shared/Sidebar'
import { Header } from '@/components/shared/Header'
import { MobileTaskbar } from '@/components/shared/MobileTaskbar'
import { Toaster } from '@/components/ui/sonner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar userEmail={user.email} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header userEmail={user.email} />
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-10 md:pb-10">
          {children}
        </main>
        <MobileTaskbar />
      </div>
      <Toaster richColors position="top-right" />
    </div>
  )
}