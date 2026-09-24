import GoalsClientContent from '@/features/objectifs/components/GoalsClientContent'

export default function ObjectifsPage() {
  return (
    <div className="page-enter mx-auto max-w-6xl space-y-7 pb-6">
      <div>
        <p className="eyebrow">Construire demain</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 md:text-3xl">Objectifs</h1>
        <p className="mt-1 text-sm text-slate-500">Vos projets d&apos;épargne, étape par étape</p>
      </div>

      <GoalsClientContent />
    </div>
  )
}