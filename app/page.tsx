"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  ShieldCheck, 
  PieChart, 
  ArrowRight, 
  CheckCircle2, 
  Wallet, 
  Zap 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Finance
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Fonctionnalités</a>
            <a href="#security" className="hover:text-blue-600 transition-colors">Sécurité</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Tarifs</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
  <Button variant="ghost" className="text-slate-700 hover:text-slate-900">
    Connexion
  </Button>
</Link>
            <Link href="/register">
  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
    Commencer
  </Button>
</Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-8"
          >
            <Zap className="w-4 h-4 fill-blue-600 text-blue-600" />
            <span>La nouvelle façon de gérer votre argent</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight md:leading-tight"
          >
            Prenez le contrôle total de vos <span className="text-blue-600">finances</span> en un coup d'œil.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-normal"
          >
            Suivez vos dépenses, analysez vos investissements et atteignez vos objectifs financiers avec une interface simple et puissante.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-base shadow-lg shadow-blue-500/20">
              Créer un compte gratuit <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-100 h-12 px-8 text-base">
              Voir la démo
            </Button>
          </motion.div>

          {/* MOCKUP INTERFACE DÉMO */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 relative max-w-5xl mx-auto"
          >
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xl shadow-slate-200/50">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-6 md:p-8 text-left">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="border-slate-200 shadow-sm bg-white">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-slate-500">Solde Total</p>
                      <h3 className="text-2xl font-bold text-slate-900 mt-1">€24,850.00</h3>
                      <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> +12.5% ce mois-ci
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm bg-white">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-slate-500">Revenus</p>
                      <h3 className="text-2xl font-bold text-slate-900 mt-1">€4,200.00</h3>
                      <p className="text-xs text-slate-500 mt-2">Dernier virement le 1er du mois</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm bg-white">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-slate-500">Dépenses</p>
                      <h3 className="text-2xl font-bold text-slate-900 mt-1">€1,340.50</h3>
                      <p className="text-xs text-blue-600 font-semibold mt-2">Sous le budget prévu</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-48 rounded-lg bg-blue-50/50 border border-blue-100 flex items-center justify-center text-slate-400 text-sm font-medium border-dashed">
                  [ Emplacement Graphique Financier Interactive ]
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Tout ce dont vous avez besoin</h2>
            <p className="mt-4 text-slate-600">Des fonctionnalités pensées pour vous donner une visibilité totale sur votre patrimoine.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<PieChart className="w-6 h-6 text-blue-600" />}
              title="Analyse visuelle"
              description="Visualisez immédiatement la répartition de vos dépenses grâce à des graphiques clairs et personnalisables."
            />
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
              title="Suivi des objectifs"
              description="Définissez des objectifs d'épargne et suivez votre progression mois par mois sans effort."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-blue-600" />}
              title="Sécurité maximale"
              description="Vos données bancaires sont cryptées et protégées avec les meilleurs standards du marché."
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-200 py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              F
            </div>
            <span className="font-semibold text-slate-900">Finance App</span>
          </div>
          <p>© {new Date().getFullYear()} Finance. Tous droits réservés.</p>
        </div>
      </footer>

    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-slate-50/50">
      <CardContent className="p-8">
        <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}