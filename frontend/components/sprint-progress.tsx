"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Bug, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

interface SprintStatusCount {
  status: string
  count: number
  percentage: number
}

interface SprintBugInfo {
  total_bugs: number
  bugs_by_severity: Record<string, number>
  bugs_by_status: SprintStatusCount[]
}

interface SprintProgress {
  sprint_name: string
  total_stories: number
  completed_stories: number
  completion_percentage: number
  total_story_points: number
  completed_story_points: number
  story_points_completion_percentage: number
  remaining_work_days: number | null
  sprint_end_date: string | null
  status_breakdown: SprintStatusCount[]
  bug_info: SprintBugInfo
  last_updated: string
}

interface SprintProgressResponse {
  success: boolean
  data: SprintProgress
  message: string
}

export function SprintProgress() {
  const [sprintData, setSprintData] = useState<SprintProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSprintProgress = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/sprint/progress`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data: SprintProgressResponse = await response.json()
        
        if (data.success) {
          setSprintData(data.data)
        } else {
          throw new Error(data.message || 'Failed to fetch sprint progress')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchSprintProgress()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">載入 Sprint 進度中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          載入 Sprint 進度時發生錯誤: {error}
        </AlertDescription>
      </Alert>
    )
  }

  if (!sprintData) {
    return (
      <Alert>
        <AlertDescription>
          無法載入 Sprint 進度資料
        </AlertDescription>
      </Alert>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
      case 'resolved':
      case 'closed':
      case 'complete':
        return 'bg-green-100 text-green-800'
      case 'in progress':
        return 'bg-blue-100 text-blue-800'
      case 'to do':
      case 'backlog':
        return 'bg-gray-100 text-gray-800'
      case 'invalid':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'highest':
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Sprint Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            {sprintData.sprint_name}
          </CardTitle>
          <CardDescription>
            最後更新: {new Date(sprintData.last_updated).toLocaleString('zh-TW')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {sprintData.completion_percentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">完成度</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {sprintData.completed_stories}/{sprintData.total_stories}
              </div>
              <div className="text-sm text-gray-600">已完成故事</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {sprintData.story_points_completion_percentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Story Points 完成度</div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>故事完成進度</span>
                <span>{sprintData.completed_stories}/{sprintData.total_stories}</span>
              </div>
              <Progress value={sprintData.completion_percentage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Story Points 進度</span>
                <span>{sprintData.completed_story_points}/{sprintData.total_story_points}</span>
              </div>
              <Progress value={sprintData.story_points_completion_percentage} className="h-2" />
            </div>
          </div>

          {/* Remaining Time */}
          {sprintData.remaining_work_days !== null && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>
                剩餘工作天數: 
                <span className={`font-semibold ${sprintData.remaining_work_days < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {sprintData.remaining_work_days} 天
                </span>
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>狀態分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sprintData.status_breakdown.map((status) => (
              <div key={status.status} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(status.status)}>
                    {status.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{status.count}</div>
                  <div className="text-sm text-gray-600">{status.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bug Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-red-600" />
            Bug 統計
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bug Summary */}
            <div>
              <h4 className="font-semibold mb-2">Bug 總覽</h4>
              <div className="text-2xl font-bold text-red-600 mb-2">
                {sprintData.bug_info.total_bugs}
              </div>
              <div className="text-sm text-gray-600">總 Bug 數量</div>
            </div>

            {/* Bug by Severity */}
            <div>
              <h4 className="font-semibold mb-2">按嚴重程度分類</h4>
              <div className="space-y-2">
                {Object.entries(sprintData.bug_info.bugs_by_severity).map(([severity, count]) => (
                  <div key={severity} className="flex items-center justify-between">
                    <Badge className={getSeverityColor(severity)}>
                      {severity}
                    </Badge>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bug by Status */}
          <div>
            <h4 className="font-semibold mb-2">Bug 狀態分布</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sprintData.bug_info.bugs_by_status.map((status) => (
                <div key={status.status} className="flex items-center justify-between p-2 border rounded">
                  <Badge className={getStatusColor(status.status)}>
                    {status.status}
                  </Badge>
                  <div className="text-right">
                    <div className="font-semibold">{status.count}</div>
                    <div className="text-sm text-gray-600">{status.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 