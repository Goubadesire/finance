'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/features/auth/services/authService'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Wallet, ArrowLeft, Loader2, Lock, Mail, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await authService.singIn(email, password)
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#f5f3ff] p-4 text-slate-950 selection:bg-violet-200 md:p-8">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-violet-300/40 blur-3xl" />
      {/* Bouton Retour Accueil */}
      <div className="max-w-7xl w-full mx-auto">
        <Link 
          href="/" 
          className="relative inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-violet-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
      </div>

      {/* Carte de Connexion Animée */}
      <div className="flex-1 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="border-white/80 bg-white/85 text-slate-950 shadow-2xl shadow-violet-900/10 backdrop-blur-xl">
            <CardHeader className="space-y-3 text-center pb-6">
              {/* Logo */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-xl shadow-violet-600/20">
                <Wallet className="w-6 h-6" />
              </div>
              <CardTitle                             className="text-2xl font-extrabold tracking-tight text-slate-950">
                Bon retour parmi nous
              </CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Saisissez vos identifiants pour accéder à vos finances
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Message d'erreur */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3.5 text-sm text-rose-200"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              <form className="space-y-4" onSubmit={handleLogin}>
                {/* Champ Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="nom@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-950 placeholder:text-slate-400 transition-all focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20"
                    />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700">
                      Mot de passe
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-950 placeholder:text-slate-400 transition-all focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20"
                    />
                  </div>
                </div>

                {/* Bouton de Validation */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-2 h-12 w-full bg-violet-600 text-base font-bold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </form>

              {/* Lien d'inscription */}
              <div className="mt-6 text-center text-sm text-slate-500">
                Pas encore de compte ?{' '}
                <Link 
                  href="/register" 
                  className="font-semibold text-violet-600 transition-colors hover:text-violet-700 hover:underline"
                >
                  S&apos;inscrire gratuitement
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer minimaliste */}
      <div className="py-2 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Finance. Sécurité et chiffrement bout en bout.
      </div>
    </div>
  )
}