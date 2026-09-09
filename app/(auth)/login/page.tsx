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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 md:p-6 text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Bouton Retour Accueil */}
      <div className="max-w-7xl w-full mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
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
          <Card className="border-slate-200 shadow-xl shadow-slate-200/50 bg-white">
            <CardHeader className="space-y-3 text-center pb-6">
              {/* Logo */}
              <div className="mx-auto h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Wallet className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                Bon retour parmi nous
              </CardTitle>
              <CardDescription className="text-slate-500 text-sm">
                Saisissez vos identifiants pour accéder à vos finances
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Message d'erreur */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 rounded-lg bg-red-50 border border-red-200 p-3.5 text-sm text-red-600 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              <form className="space-y-4" onSubmit={handleLogin}>
                {/* Champ Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 block">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="nom@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                    />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 block">
                      Mot de passe
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                    />
                  </div>
                </div>

                {/* Bouton de Validation */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 text-base font-medium shadow-md shadow-blue-500/10 transition-all mt-2"
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
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  S&apos;inscrire gratuitement
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer minimaliste */}
      <div className="text-center text-xs text-slate-400 py-2">
        © {new Date().getFullYear()} Finance. Sécurité et chiffrement bout en bout.
      </div>
    </div>
  )
}