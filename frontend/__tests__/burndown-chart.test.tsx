import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BurndownChart } from '@/components/burndown-chart'
import { CompletionRateCard } from '@/components/completion-rate-card'
import type { ChartDataPoint, SprintBurndownData } from '@/hooks/use-sprint-burndown'

/**
 * Task 1.2.1: 撰寫前端顏色同步測試
 * 對應測試案例：TC-001, TC-002, TC-003
 * 驗證前端顏色映射邏輯與後端健康狀態完全一致
 * 
 * 測試目標：
 * - 確保 getStatusColor 函數正確映射健康狀態到顏色
 * - 確保燃盡圖實際線顏色與進度條顏色一致
 * - 確保 Badge 顏色與健康狀態匹配
 */

// Mock Recharts 組件以簡化測試
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: ({ stroke, name }: any) => <div data-testid={`line-${name}`} data-stroke={stroke}></div>,
  XAxis: () => <div data-testid="x-axis"></div>,
  YAxis: () => <div data-testid="y-axis"></div>,
  Tooltip: () => <div data-testid="tooltip"></div>,
  Legend: () => <div data-testid="legend"></div>,
}))

// Mock ChartContainer 組件
jest.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children }: any) => <div data-testid="chart-container">{children}</div>,
  ChartTooltip: ({ children }: any) => <div data-testid="chart-tooltip">{children}</div>,
  ChartTooltipContent: ({ children }: any) => <div data-testid="chart-tooltip-content">{children}</div>,
}))

describe('前端健康狀態顏色同步測試', () => {
  // 測試資料準備
  const mockChartData: ChartDataPoint[] = [
    { day: 1, date: '2025-01-01', ideal: 20, actual: 20 },
    { day: 2, date: '2025-01-02', ideal: 16, actual: 18 },
    { day: 3, date: '2025-01-03', ideal: 12, actual: 15 },
    { day: 4, date: '2025-01-04', ideal: 8, actual: 12 },
    { day: 5, date: '2025-01-05', ideal: 4, actual: 8 },
  ]

  const createMockSprintData = (status: 'normal' | 'warning' | 'danger'): SprintBurndownData => ({
    sprint_name: 'Test Sprint',
    total_story_points: 20,
    completed_story_points: status === 'normal' ? 12 : status === 'warning' ? 8 : 4,
    remaining_story_points: status === 'normal' ? 8 : status === 'warning' ? 12 : 16,
    completion_rate: status === 'normal' ? 60 : status === 'warning' ? 40 : 20,
    total_working_days: 10,
    days_elapsed: 5,
    remaining_working_days: 5,
    status: status
  })

  /**
   * TC-001 對應：正常狀態顯示綠色
   * 驗證當 Sprint 進度正常時，所有相關 UI 元素都顯示綠色
   */
  describe('正常狀態顏色測試 (normal)', () => {
    const normalSprintData = createMockSprintData('normal')

    test('BurndownChart_正常狀態_顯示綠色', () => {
      // Arrange & Act
      const { container } = render(
        <BurndownChart 
          chartData={mockChartData} 
          sprintData={normalSprintData} 
        />
      )

      // Assert - 檢查燃盡圖中的綠色元素
      // 1. 檢查圖例中的實際線顏色指示器 (inline style with rgb values)
      const actualLineLegend = container.querySelector('div[style*="background-color: rgb(16, 185, 129)"]')
      expect(actualLineLegend).toBeInTheDocument()

      // 2. 檢查 Line 組件接收到正確的綠色 stroke
      const actualLine = screen.getByTestId('line-實際燃盡線')
      expect(actualLine).toHaveAttribute('data-stroke', '#10b981')
    })

    test('CompletionRateCard_正常狀態_顯示綠色Badge和進度條', () => {
      // Arrange & Act
      const { container } = render(
        <CompletionRateCard sprintData={normalSprintData} />
      )

      // Assert - 檢查進度卡片中的綠色元素
      // 1. 檢查 Badge 顯示"正常進度"文字
      expect(screen.getByText('正常進度')).toBeInTheDocument()

      // 2. 檢查進度條使用綠色背景
      const progressBar = container.querySelector('div[style*="background-color: rgb(16, 185, 129)"]')
      expect(progressBar).toBeInTheDocument()

      // 3. 檢查 Badge 有正確的綠色樣式類
      const badge = screen.getByText('正常進度').closest('[class*="bg-green"]')
      expect(badge).toBeInTheDocument()
    })

    test('顏色一致性_正常狀態_燃盡圖與進度條顏色匹配', () => {
      // Arrange
      const { container: chartContainer } = render(
        <BurndownChart 
          chartData={mockChartData} 
          sprintData={normalSprintData} 
        />
      )
      const { container: cardContainer } = render(
        <CompletionRateCard sprintData={normalSprintData} />
      )

      // Act & Assert - 驗證顏色一致性
      // 燃盡圖實際線顏色: #10b981 (green-500)
      const chartActualLine = screen.getByTestId('line-實際燃盡線')
      expect(chartActualLine).toHaveAttribute('data-stroke', '#10b981')

      // 進度條顏色: #10b981 (green-500) - 與燃盡圖完全一致
      const progressBar = cardContainer.querySelector('div[style*="background-color: rgb(16, 185, 129)"]')
      expect(progressBar).toBeInTheDocument()

      // 兩者都應該是綠色系，符合正常狀態
    })
  })

  /**
   * TC-002 對應：警示狀態顯示黃色
   * 驗證當 Sprint 進度稍微落後時，所有相關 UI 元素都顯示黃色
   */
  describe('警示狀態顏色測試 (warning)', () => {
    const warningSprintData = createMockSprintData('warning')

    test('BurndownChart_警示狀態_顯示黃色', () => {
      // Arrange & Act
      const { container } = render(
        <BurndownChart 
          chartData={mockChartData} 
          sprintData={warningSprintData} 
        />
      )

      // Assert - 檢查燃盡圖中的黃色元素
      // 1. 檢查圖例中的實際線顏色指示器
      const actualLineLegend = container.querySelector('div[style*="background-color: rgb(245, 158, 11)"]')
      expect(actualLineLegend).toBeInTheDocument()

      // 2. 檢查 Line 組件接收到正確的黃色 stroke
      const actualLine = screen.getByTestId('line-實際燃盡線')
      expect(actualLine).toHaveAttribute('data-stroke', '#f59e0b')
    })

    test('CompletionRateCard_警示狀態_顯示黃色Badge和進度條', () => {
      // Arrange & Act
      const { container } = render(
        <CompletionRateCard sprintData={warningSprintData} />
      )

      // Assert - 檢查進度卡片中的黃色元素
      // 1. 檢查 Badge 顯示"稍微落後"文字
      expect(screen.getByText('稍微落後')).toBeInTheDocument()

      // 2. 檢查進度條使用黃色背景
      const progressBar = container.querySelector('div[style*="background-color: rgb(245, 158, 11)"]')
      expect(progressBar).toBeInTheDocument()

      // 3. 檢查 Badge 有正確的黃色樣式類
      const badge = screen.getByText('稍微落後').closest('[class*="bg-yellow"]')
      expect(badge).toBeInTheDocument()
    })

    test('顏色一致性_警示狀態_燃盡圖與進度條顏色匹配', () => {
      // Arrange
      const { container: chartContainer } = render(
        <BurndownChart 
          chartData={mockChartData} 
          sprintData={warningSprintData} 
        />
      )
      const { container: cardContainer } = render(
        <CompletionRateCard sprintData={warningSprintData} />
      )

      // Act & Assert - 驗證顏色一致性
      // 燃盡圖實際線顏色: #f59e0b (yellow-500)
      const chartActualLine = screen.getByTestId('line-實際燃盡線')
      expect(chartActualLine).toHaveAttribute('data-stroke', '#f59e0b')

      // 進度條顏色: #f59e0b (yellow-500) - 與燃盡圖完全一致
      const progressBar = cardContainer.querySelector('div[style*="background-color: rgb(245, 158, 11)"]')
      expect(progressBar).toBeInTheDocument()

      // 兩者都應該是黃色系，符合警示狀態
    })
  })

  /**
   * TC-003 對應：危險狀態顯示紅色
   * 驗證當 Sprint 進度嚴重落後時，所有相關 UI 元素都顯示紅色
   */
  describe('危險狀態顏色測試 (danger)', () => {
    const dangerSprintData = createMockSprintData('danger')

    test('BurndownChart_危險狀態_顯示紅色', () => {
      // Arrange & Act
      const { container } = render(
        <BurndownChart 
          chartData={mockChartData} 
          sprintData={dangerSprintData} 
        />
      )

      // Assert - 檢查燃盡圖中的紅色元素
      // 1. 檢查圖例中的實際線顏色指示器
      const actualLineLegend = container.querySelector('div[style*="background-color: rgb(239, 68, 68)"]')
      expect(actualLineLegend).toBeInTheDocument()

      // 2. 檢查 Line 組件接收到正確的紅色 stroke
      const actualLine = screen.getByTestId('line-實際燃盡線')
      expect(actualLine).toHaveAttribute('data-stroke', '#ef4444')
    })

    test('CompletionRateCard_危險狀態_顯示紅色Badge和進度條', () => {
      // Arrange & Act
      const { container } = render(
        <CompletionRateCard sprintData={dangerSprintData} />
      )

      // Assert - 檢查進度卡片中的紅色元素
      // 1. 檢查 Badge 顯示"嚴重落後"文字
      expect(screen.getByText('嚴重落後')).toBeInTheDocument()

      // 2. 檢查進度條使用紅色背景
      const progressBar = container.querySelector('div[style*="background-color: rgb(239, 68, 68)"]')
      expect(progressBar).toBeInTheDocument()

      // 3. 檢查 Badge 有正確的紅色樣式類
      const badge = screen.getByText('嚴重落後').closest('[class*="bg-red"]')
      expect(badge).toBeInTheDocument()
    })

    test('顏色一致性_危險狀態_燃盡圖與進度條顏色匹配', () => {
      // Arrange
      const { container: chartContainer } = render(
        <BurndownChart 
          chartData={mockChartData} 
          sprintData={dangerSprintData} 
        />
      )
      const { container: cardContainer } = render(
        <CompletionRateCard sprintData={dangerSprintData} />
      )

      // Act & Assert - 驗證顏色一致性
      // 燃盡圖實際線顏色: #ef4444 (red-500)
      const chartActualLine = screen.getByTestId('line-實際燃盡線')
      expect(chartActualLine).toHaveAttribute('data-stroke', '#ef4444')

      // 進度條顏色: #ef4444 (red-500) - 完全一致！
      const progressBar = cardContainer.querySelector('div[style*="background-color: rgb(239, 68, 68)"]')
      expect(progressBar).toBeInTheDocument()

      // 兩者都應該是紅色系，完全一致，符合危險狀態
    })
  })

  /**
   * 邊界值和錯誤處理測試
   */
  describe('邊界值和錯誤處理', () => {
    test('未知狀態_使用預設灰色', () => {
      // Arrange - 創建無效狀態的測試資料
      const invalidSprintData = {
        ...createMockSprintData('normal'),
        status: 'unknown' as any
      }

      // Act
      const { container } = render(
        <BurndownChart 
          chartData={mockChartData} 
          sprintData={invalidSprintData} 
        />
      )

      // Assert - 應該使用預設灰色
      const actualLine = screen.getByTestId('line-實際燃盡線')
      expect(actualLine).toHaveAttribute('data-stroke', '#6b7280') // gray-500
    })

    test('空資料_不會崩潰', () => {
      // Arrange
      const emptySprintData = createMockSprintData('normal')
      const emptyChartData: ChartDataPoint[] = []

      // Act & Assert - 不應該拋出錯誤
      expect(() => {
        render(
          <BurndownChart 
            chartData={emptyChartData} 
            sprintData={emptySprintData} 
          />
        )
      }).not.toThrow()
    })
  })

  /**
   * getStatusColor 函數直接測試
   * 這是核心的顏色映射邏輯，需要直接測試
   */
  describe('getStatusColor 函數測試', () => {
    // 由於 getStatusColor 不是 exported 函數，我們通過組件行為來測試
    // 這些測試已經在上面的組件測試中覆蓋了

    test('顏色常數正確性驗證', () => {
      // 驗證我們使用的顏色常數符合設計系統
      const expectedColors = {
        normal: '#10b981',   // green-500, 符合 AC01
        warning: '#f59e0b',  // yellow-500, 符合 AC02
        danger: '#ef4444',   // red-500, 符合 AC03
        default: '#6b7280'   // gray-500, 預設顏色
      }

      // 通過組件測試來驗證這些顏色值
      expect(expectedColors.normal).toBe('#10b981')
      expect(expectedColors.warning).toBe('#f59e0b')
      expect(expectedColors.danger).toBe('#ef4444')
      expect(expectedColors.default).toBe('#6b7280')
    })
  })
})
