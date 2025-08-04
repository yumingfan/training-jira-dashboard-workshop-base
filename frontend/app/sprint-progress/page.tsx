import { SprintProgress } from '@/components/sprint-progress'

export default function SprintProgressPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sprint 進度監控</h1>
        <p className="text-gray-600">
          即時監控 Sprint 進度、Bug 統計和團隊工作狀況
        </p>
      </div>
      
      <SprintProgress />
    </div>
  )
} 