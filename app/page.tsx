"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleDollarSign,
  LockKeyhole,
  Sparkles,
  Target,
  TrendingUp,
  WalletCards,
} from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Comprendre vos flux",
    text: "Une lecture claire de vos revenus et dépenses, sans tableur compliqué.",
  },
  {
    icon: Target,
    title: "Avancer vers vos projets",
    text: "Transformez vos envies en objectifs concrets et visualisez chaque progrès.",
  },
  {
    icon: LockKeyhole,
    title: "Garder le contrôle",
    text: "Vos données restent privées et votre espace est protégé par Supabase.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500 text-white shadow-lg shadow-violet-400/20">
            <WalletCards className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">Finance</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:text-white">
            Connexion
          </Link>
          <Link href="/register" className="rounded-xl bg-violet-400 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-300">
            Commencer
          </Link>
        </div>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-16 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:pb-32 lg:pt-24">
        <div className="pointer-events-none absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-violet-400/15 blur-3xl" />
        <div className="relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-xs font-bold text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            Une relation plus sereine avec votre argent
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.05em] md:text-7xl">
            Votre argent mérite une <span className="text-violet-300">vue d&apos;ensemble.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
            Finance vous aide à suivre vos habitudes, créer de bonnes routines et avancer avec confiance vers ce qui compte vraiment.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-400 px-6 py-4 font-bold text-white shadow-xl shadow-violet-400/10 transition hover:-translate-y-1 hover:bg-violet-300">
              Créer mon espace <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-4 font-semibold text-slate-200 transition hover:border-violet-300/40 hover:bg-white/5">
              J&apos;ai déjà un compte
            </Link>
          </motion.div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-500">
            {["Simple à prendre en main", "Sans jargon", "Pensé pour le quotidien"].map((item) => (
              <span key={item} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-violet-400" />{item}</span>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="relative">
          <div className="absolute -inset-8 rounded-[3rem] bg-violet-400/10 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.08] p-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="rounded-[1.5rem] bg-slate-900 p-5 md:p-7">
              <div className="mb-10 flex items-center justify-between">
                <div><p className="text-xs text-slate-500">Bonjour, votre mois</p><p className="mt-1 font-bold">Vue d&apos;ensemble</p></div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400 text-white"><CircleDollarSign className="h-5 w-5" /></div>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-300">Solde disponible</p>
              <p className="mt-2 text-4xl font-black tracking-tight">24 850 €</p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-slate-500">Revenus</p><p className="mt-2 font-bold text-emerald-300">+4 200 €</p></div>
                <div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-slate-500">Dépenses</p><p className="mt-2 font-bold">−1 340 €</p></div>
              </div>
              <div className="mt-4 rounded-2xl bg-violet-400 p-4 text-white">
                <div className="flex items-center justify-between text-xs font-bold"><span>Objectif vacances</span><span>68%</span></div>
                <div className="mt-3 h-2 rounded-full bg-slate-950/15"><div className="h-full w-[68%] rounded-full bg-slate-950" /></div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-800/90 p-3 shadow-xl backdrop-blur-xl">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/15 text-violet-300"><ArrowUpRight className="h-4 w-4" /></span>
            <div><p className="text-[10px] text-slate-500">Progression</p><p className="text-sm font-bold">+12,5% ce mois</p></div>
          </div>
        </motion.div>
      </section>

      <section className="border-t border-white/10 bg-white py-24 text-slate-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-xl"><p className="eyebrow">Pensé pour durer</p><h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">Une interface qui vous donne envie de revenir.</h2></div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }, index) => (
              <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-3xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-900/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-7 text-lg font-extrabold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
