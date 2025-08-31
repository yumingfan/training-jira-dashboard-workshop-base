import { test, expect, Page } from '@playwright/test';

/**
 * Task 1.2.3: 視覺化回歸測試
 * 
 * 目標：截圖比對確保顏色正確顯示
 * 測試案例對應：TC-001, TC-002, TC-003
 */

// Mock 數據設定
const mockSprintData = {
  normal: {
    sprint_name: "Sprint 23",
    total_story_points: 50,
    completed_story_points: 25,
    remaining_story_points: 25,
    completion_rate: 50,
    days_elapsed: 5,
    total_working_days: 10,
    remaining_working_days: 5,
    status: 'normal' as const
  },
  warning: {
    sprint_name: "Sprint 24",
    total_story_points: 50,
    completed_story_points: 20,
    remaining_story_points: 30,
    completion_rate: 40,
    days_elapsed: 7,
    total_working_days: 10,
    remaining_working_days: 3,
    status: 'warning' as const
  },
  danger: {
    sprint_name: "Sprint 25",
    total_story_points: 50,
    completed_story_points: 15,
    remaining_story_points: 35,
    completion_rate: 30,
    days_elapsed: 8,
    total_working_days: 10,
    remaining_working_days: 2,
    status: 'danger' as const
  }
};

// 設置 API Mock
async function setupApiMocks(page: Page, status: 'normal' | 'warning' | 'danger') {
  const sprintData = mockSprintData[status];
  
  // Mock Google Sheets API 回應
  await page.route('**/api/google-sheets/sprint-burndown', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          sprint_data: sprintData,
          chart_data: generateMockChartData(sprintData)
        }
      })
    });
  });
}

function generateMockChartData(sprintData: any) {
  const chartData: Array<{
    day: number;
    date: string;
    ideal: number;
    actual: number | null;
  }> = [];
  const totalDays = sprintData.total_working_days;
  
  for (let day = 1; day <= totalDays; day++) {
    const ideal = sprintData.total_story_points * (totalDays - day) / totalDays;
    const actual = day <= sprintData.days_elapsed 
      ? sprintData.total_story_points * (totalDays - day) / totalDays + 
        (Math.random() * 5 - 2.5) // 添加一些變化
      : null;
    
    chartData.push({
      day,
      date: `2024-01-${day.toString().padStart(2, '0')}`,
      ideal: Math.round(ideal * 10) / 10,
      actual: actual ? Math.round(actual * 10) / 10 : null
    });
  }
  
  return chartData;
}

test.describe('前端健康狀態顏色視覺測試', () => {
  
  test.beforeEach(async ({ page }) => {
    // 設置較大的視窗大小以確保元素完整顯示
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('正常狀態_顯示綠色系_視覺驗證', async ({ page }) => {
    await setupApiMocks(page, 'normal');
    
    // 前往 Google Sheets 頁面
    await page.goto('/google-sheets');
    
    // 等待內容載入
    await page.waitForSelector('[data-testid="burndown-chart"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="completion-rate-card"]', { timeout: 10000 });
    
    // 截圖並比對 - 正常狀態應該顯示綠色
    await expect(page).toHaveScreenshot('sprint-burndown-normal-status.png', {
      fullPage: true,
      threshold: 0.3, // 允許 30% 的差異（考慮到字體和動畫）
      animations: 'disabled' // 禁用動畫以確保一致性
    });
    
    // 檢查特定顏色元素
    await expect(page.locator('[data-testid="burndown-chart"]')).toHaveScreenshot('burndown-chart-normal.png');
    await expect(page.locator('[data-testid="completion-rate-card"]')).toHaveScreenshot('completion-rate-card-normal.png');
  });

  test('警示狀態_顯示黃色系_視覺驗證', async ({ page }) => {
    await setupApiMocks(page, 'warning');
    
    await page.goto('/google-sheets');
    
    // 等待內容載入
    await page.waitForSelector('[data-testid="burndown-chart"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="completion-rate-card"]', { timeout: 10000 });
    
    // 截圖並比對 - 警示狀態應該顯示黃色
    await expect(page).toHaveScreenshot('sprint-burndown-warning-status.png', {
      fullPage: true,
      threshold: 0.3,
      animations: 'disabled'
    });
    
    // 檢查特定顏色元素
    await expect(page.locator('[data-testid="burndown-chart"]')).toHaveScreenshot('burndown-chart-warning.png');
    await expect(page.locator('[data-testid="completion-rate-card"]')).toHaveScreenshot('completion-rate-card-warning.png');
  });

  test('危險狀態_顯示紅色系_視覺驗證', async ({ page }) => {
    await setupApiMocks(page, 'danger');
    
    await page.goto('/google-sheets');
    
    // 等待內容載入
    await page.waitForSelector('[data-testid="burndown-chart"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="completion-rate-card"]', { timeout: 10000 });
    
    // 截圖並比對 - 危險狀態應該顯示紅色
    await expect(page).toHaveScreenshot('sprint-burndown-danger-status.png', {
      fullPage: true,
      threshold: 0.3,
      animations: 'disabled'
    });
    
    // 檢查特定顏色元素
    await expect(page.locator('[data-testid="burndown-chart"]')).toHaveScreenshot('burndown-chart-danger.png');
    await expect(page.locator('[data-testid="completion-rate-card"]')).toHaveScreenshot('completion-rate-card-danger.png');
  });

  test('顏色一致性_三種狀態對比_視覺驗證', async ({ page }) => {
    // 依序測試三種狀態，確保顏色系統一致性
    
    const statuses: Array<'normal' | 'warning' | 'danger'> = ['normal', 'warning', 'danger'];
    
    for (const status of statuses) {
      await setupApiMocks(page, status);
      await page.goto('/google-sheets');
      
      // 等待內容載入
      await page.waitForSelector('[data-testid="burndown-chart"]', { timeout: 10000 });
      await page.waitForSelector('[data-testid="completion-rate-card"]', { timeout: 10000 });
      
      // 檢查顏色元素存在且正確顯示
      const chart = page.locator('[data-testid="burndown-chart"]');
      const card = page.locator('[data-testid="completion-rate-card"]');
      
      await expect(chart).toBeVisible();
      await expect(card).toBeVisible();
      
      // 根據狀態檢查對應的 Badge 文字
      const expectedBadgeText = {
        normal: '正常進度',
        warning: '稍微落後', 
        danger: '嚴重落後'
      }[status];
      
      await expect(page.getByText(expectedBadgeText)).toBeVisible();
    }
  });

  test('響應式設計_移動端顯示_視覺驗證', async ({ page }) => {
    // 設置移動端視窗大小
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE 大小
    
    await setupApiMocks(page, 'normal');
    await page.goto('/google-sheets');
    
    // 等待內容載入
    await page.waitForSelector('[data-testid="burndown-chart"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="completion-rate-card"]', { timeout: 10000 });
    
    // 移動端截圖
    await expect(page).toHaveScreenshot('sprint-burndown-mobile-normal.png', {
      fullPage: true,
      threshold: 0.3,
      animations: 'disabled'
    });
  });
});

test.describe('顏色驗證輔助測試', () => {
  
  test('檢查CSS顏色變數正確性', async ({ page }) => {
    await setupApiMocks(page, 'normal');
    await page.goto('/google-sheets');
    
    // 等待內容載入
    await page.waitForSelector('[data-testid="completion-rate-card"]', { timeout: 10000 });
    
    // 檢查進度條背景色
    const progressBar = page.locator('[data-testid="completion-rate-card"] .transition-all');
    const backgroundColor = await progressBar.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // 驗證顏色值 (RGB 格式: rgb(16, 185, 129) 對應 #10b981)
    expect(backgroundColor).toBe('rgb(16, 185, 129)');
  });
  
  test('燃盡圖線條顏色檢驗', async ({ page }) => {
    await setupApiMocks(page, 'warning');
    await page.goto('/google-sheets');
    
    // 等待圖表渲染
    await page.waitForSelector('[data-testid="burndown-chart"]', { timeout: 10000 });
    
    // 檢查圖例顏色指示器
    const legendIndicator = page.locator('[data-testid="burndown-chart"] div[style*="background-color"]').first();
    const backgroundColor = await legendIndicator.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // 驗證警示狀態顏色 (RGB 格式: rgb(245, 158, 11) 對應 #f59e0b)
    expect(backgroundColor).toBe('rgb(245, 158, 11)');
  });
});
