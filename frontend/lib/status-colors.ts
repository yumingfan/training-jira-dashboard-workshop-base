/**
 * Sprint 健康狀態顏色配置
 * 確保所有組件使用一致的顏色方案
 * 
 * 對應 AC 要求：
 * - AC01: normal (正常) → 綠色
 * - AC02: warning (稍微落後 10-25%) → 黃色  
 * - AC03: danger (嚴重落後 >25%) → 紅色
 */

export type SprintStatus = 'normal' | 'warning' | 'danger'

/**
 * 獲取健康狀態對應的顏色
 * 這個函數確保燃盡圖和進度條使用完全一致的顏色
 */
export const getStatusColor = (status: SprintStatus): string => {
  switch (status) {
    case 'normal':
      return '#10b981' // green-500
    case 'warning':
      return '#f59e0b' // yellow-500
    case 'danger':
      return '#ef4444' // red-500
    default:
      return '#6b7280' // gray-500 (預設顏色)
  }
}

/**
 * 獲取健康狀態的完整配置
 * 包含顏色、文字、圖標等信息
 */
export const getStatusConfig = (status: SprintStatus) => {
  const color = getStatusColor(status)
  
  switch (status) {
    case 'normal':
      return {
        color,
        badgeVariant: 'default' as const,
        badgeClassName: 'bg-green-100 text-green-800 hover:bg-green-100',
        iconColor: 'text-green-600',
        label: '正常進度',
        textColor: 'text-green-600'
      }
    case 'warning':
      return {
        color,
        badgeVariant: 'secondary' as const,
        badgeClassName: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
        iconColor: 'text-yellow-600',
        label: '稍微落後',
        textColor: 'text-yellow-600'
      }
    case 'danger':
      return {
        color,
        badgeVariant: 'destructive' as const,
        badgeClassName: 'bg-red-100 text-red-800 hover:bg-red-100',
        iconColor: 'text-red-600',
        label: '嚴重落後',
        textColor: 'text-red-600'
      }
    default:
      return {
        color,
        badgeVariant: 'outline' as const,
        badgeClassName: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
        iconColor: 'text-gray-600',
        label: '未知狀態',
        textColor: 'text-gray-600'
      }
  }
}

/**
 * 顏色常量（用於測試驗證）
 */
export const STATUS_COLORS = {
  normal: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  default: '#6b7280'
} as const
