import GoalsClientContent from '@/features/objectifs/components/GoalsClientContent'

export default function ObjectifsPage() {
  return (
    <div className="space-y-5 pb-6">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-gray-900">Objectifs</h1>
        <p className="text-xs text-gray-400">Vos cagnottes et projets d&apos;épargne</p>
      </div>

      <GoalsClientContent />
    </div>
  )
}