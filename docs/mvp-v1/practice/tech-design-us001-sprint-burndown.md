# Technical Design: US001 Sprint 燃盡圖視覺化與進度警示

> **檔案編號**: TD-US001-sprint-burndown-visualization  
> **建立日期**: 2025-08-28  
> **技術負責人**: Development Team  
> **狀態**: 設計階段  
> **對應 User Story**: [US001](../example/spec01-us01-sprintprogress.md#us-001-sprint-燃盡圖視覺化)  
> **對應 Acceptance Criteria**: [AC-001](../example/spec01-us01-ac.md)  
> **對應測試案例**: [TC-US001](./tc-us001-sprint-burndown-visualization.md)

## 📋 技術設計概覽

### 設計目標
基於現有專案架構，設計並實現 Sprint 燃盡圖視覺化功能，確保符合所有 Acceptance Criteria 要求，特別是健康狀態色彩警示和時間邊界處理。

### 架構決策
- **複用現有架構**：基於已實現的 Sprint 燃盡圖基礎功能進行優化
- **確保 AC 合規**：重點驗證和修正健康狀態計算邏輯
- **測試驅動**：基於測試案例驗證所有功能點
- **漸進式改進**：優先修正核心功能，再擴展細節功能

## 🏗️ 系統架構分析

### 現有架構狀態

```
Google Sheets (rawData)
     ↓ 5分鐘快取
.NET Core API (/api/sprint-burndown/{name})
     ↓ SprintBurndownResponse
useSprintBurndown Hook
     ↓ TypeScript types
SprintBurndownContainer
     ↓ Props distribution
[BurndownChart] + [CompletionRateCard]
```

### ✅ 已實現組件分析

| 組件 | 路徑 | 狀態 | 符合 AC 程度 |
|------|------|------|-------------|
| **SprintBurndownData Model** | `backend-dotnet/Models.cs` | ✅ 完成 | 🟡 需驗證健康狀態邏輯 |
| **GetSprintBurndownDataAsync** | `backend-dotnet/GoogleSheetsService.cs` | ✅ 完成 | 🟡 需驗證計算正確性 |
| **BurndownChart Component** | `frontend/components/burndown-chart.tsx` | ✅ 完成 | 🟡 需驗證顏色同步 |
| **useSprintBurndown Hook** | `frontend/hooks/use-sprint-burndown.ts` | ✅ 完成 | 🟢 基本符合 |
| **SprintBurndownContainer** | `frontend/components/sprint-burndown-container.tsx` | ✅ 完成 | 🟡 需驗證錯誤處理 |

## 🎯 核心技術需求分析

### AC01: Sprint 燃盡圖正常顯示與健康狀態

#### 後端數據模型驗證
```csharp
// Models.cs - 現有結構 ✅
public record SprintBurndownData(
    [property: JsonPropertyName("sprint_name")] string SprintName,
    [property: JsonPropertyName("total_story_points")] double TotalStoryPoints,
    [property: JsonPropertyName("completed_story_points")] double CompletedStoryPoints,
    [property: JsonPropertyName("remaining_story_points")] double RemainingStoryPoints,
    [property: JsonPropertyName("completion_rate")] double CompletionRate,
    [property: JsonPropertyName("status")] string Status, // ✅ 支援 'normal', 'warning', 'danger'
    [property: JsonPropertyName("total_working_days")] int TotalWorkingDays,
    [property: JsonPropertyName("days_elapsed")] int DaysElapsed,
    [property: JsonPropertyName("remaining_working_days")] int RemainingWorkingDays
);
```

#### 前端顏色映射驗證
```typescript
// burndown-chart.tsx - 現有邏輯 ✅
const getStatusColor = (status: SprintBurndownData['status']) => {
  switch (status) {
    case 'normal': return '#10b981'   // 綠色 - 符合 AC01
    case 'warning': return '#f59e0b'  // 黃色 - 符合 AC02  
    case 'danger': return '#ef4444'   // 紅色 - 符合 AC03
    default: return '#6b7280'
  }
}
```

### AC02 & AC03: 健康狀態計算邏輯設計

#### 🔍 關鍵驗證點：健康狀態閾值計算

**需要確認的計算邏輯**：
```csharp
// GoogleSheetsService.cs - 需要驗證此邏輯是否正確實現
private string CalculateSprintHealthStatus(
    double completionRate, 
    int daysElapsed, 
    int totalWorkingDays)
{
    // AC02: 落後 10-25% 顯示黃色警示
    // AC03: 落後 25%+ 顯示紅色危險警示
    
    double timeElapsedPercentage = (double)daysElapsed / totalWorkingDays;
    double progressGap = timeElapsedPercentage - completionRate;
    
    if (progressGap <= 0.10) return "normal";      // 落後 ≤ 10%
    if (progressGap <= 0.25) return "warning";     // 落後 10-25%
    return "danger";                               // 落後 > 25%
}
```

**測試驗證場景**：
- 第6天/10天，理想50%，實際40% → progressGap = 0.6 - 0.4 = 0.2 (20%) → `warning` ✅
- 第8天/10天，理想80%，實際50% → progressGap = 0.8 - 0.5 = 0.3 (30%) → `danger` ✅

### AC04: 時間邊界處理設計

#### 數據結構驗證
```csharp
// Models.cs - DayProgress 結構 ✅
public record DayProgress(
    [property: JsonPropertyName("day")] int Day,
    [property: JsonPropertyName("date")] string Date,
    [property: JsonPropertyName("ideal_remaining")] double IdealRemaining,
    [property: JsonPropertyName("actual_remaining")] double? ActualRemaining, // ✅ nullable 支援未來日期
    [property: JsonPropertyName("is_working_day")] bool IsWorkingDay
);
```

#### 前端時間邊界邏輯
```typescript
// 需要驗證：burndown-chart.tsx 中 tooltip 顯示邏輯
const formatTooltip = (label: string, payload: any[]) => {
  const idealData = payload.find(p => p.dataKey === 'ideal_remaining');
  const actualData = payload.find(p => p.dataKey === 'actual_remaining');
  
  // AC04: hover 未來日期時顯示 "實際剩餘: 未來日期"
  if (actualData && actualData.value === null) {
    return [`實際剩餘: 未來日期`];
  }
  
  return [
    idealData && `理想剩餘: ${idealData.value} SP`,
    actualData && actualData.value !== null && `實際剩餘: ${actualData.value} SP`
  ].filter(Boolean);
};
```

### AC05: 空資料與錯誤處理設計

#### 🆕 需要新增：錯誤處理 UI 組件

```typescript
// 新增：ErrorBoundary 或錯誤狀態處理
interface ErrorState {
  hasError: boolean;
  errorMessage: string;
  canRetry: boolean;
}

const SprintBurndownError = ({ error, onRetry }: {
  error: string;
  onRetry: () => void;
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <p className="text-gray-600 mb-4">
      {error || "無法載入 Sprint 資料，請檢查資料來源"}
    </p>
    <button 
      onClick={onRetry}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      重新載入
    </button>
  </div>
);
```

## 🔧 詳細實現計畫

### Phase 1: 核心功能驗證 (優先級: P0)

#### 1.1 後端健康狀態計算驗證
- **檔案**: `backend-dotnet/GoogleSheetsService.cs`
- **任務**: 確認 `CalculateSprintHealthStatus` 邏輯正確實現
- **驗證方式**: 單元測試 + 集成測試

#### 1.2 前端顏色同步驗證
- **檔案**: `frontend/components/burndown-chart.tsx`
- **任務**: 確認進度條與燃盡圖實際線顏色一致
- **驗證方式**: 視覺回歸測試

#### 1.3 時間邊界處理驗證
- **檔案**: `frontend/components/burndown-chart.tsx`
- **任務**: 確認未來日期 tooltip 顯示正確
- **驗證方式**: E2E 測試

### Phase 2: 錯誤處理增強 (優先級: P1)

#### 2.1 空資料處理
- **新增檔案**: `frontend/components/sprint-burndown-error.tsx`
- **修改檔案**: `frontend/components/sprint-burndown-container.tsx`
- **任務**: 實現友善的錯誤訊息和重新載入功能

#### 2.2 載入狀態優化
- **修改檔案**: `frontend/components/sprint-burndown-container.tsx`
- **任務**: 改善載入狀態顯示，避免閃爍

### Phase 3: 健康狀態 Badge (優先級: P2)

#### 3.1 健康狀態 Badge 組件
- **新增檔案**: `frontend/components/health-status-badge.tsx`
- **任務**: 右上角顯示具體健康狀態文字

```typescript
// health-status-badge.tsx 設計
interface HealthStatusBadgeProps {
  status: 'normal' | 'warning' | 'danger';
  className?: string;
}

const statusConfig = {
  normal: { text: '正常進度', color: 'bg-green-100 text-green-800' },
  warning: { text: '稍微落後', color: 'bg-yellow-100 text-yellow-800' },
  danger: { text: '嚴重落後', color: 'bg-red-100 text-red-800' }
};
```

## 🧪 測試實現策略

### 單元測試 (Jest)

#### 後端邏輯測試
```csharp
// backend-dotnet/Tests/SprintBurndownTests.cs
[Test]
public void CalculateSprintHealthStatus_WarningRange_ReturnsWarning()
{
    // Arrange: 第6天，理想60%，實際40% (落後20%)
    double completionRate = 0.4;
    int daysElapsed = 6;
    int totalWorkingDays = 10;
    
    // Act
    string result = CalculateSprintHealthStatus(completionRate, daysElapsed, totalWorkingDays);
    
    // Assert
    Assert.AreEqual("warning", result);
}
```

#### 前端組件測試
```typescript
// frontend/__tests__/burndown-chart.test.tsx
describe('BurndownChart', () => {
  test('顯示正確的健康狀態顏色', () => {
    const sprintData = {
      status: 'warning' as const,
      // ... other props
    };
    
    render(<BurndownChart sprintData={sprintData} chartData={[]} />);
    
    const actualLine = screen.getByTestId('actual-line');
    expect(actualLine).toHaveStyle('stroke: #f59e0b'); // 黃色
  });
});
```

### 集成測試 (React Testing Library)

```typescript
// frontend/__tests__/sprint-burndown-container.test.tsx
test('錯誤狀態顯示正確的錯誤訊息', async () => {
  // Mock API 錯誤回應
  server.use(
    rest.get('/api/sprint-burndown/:name', (req, res, ctx) => {
      return res(ctx.status(404), ctx.json({ error: 'Sprint not found' }));
    })
  );
  
  render(<SprintBurndownContainer sprintName="Invalid Sprint" />);
  
  await waitFor(() => {
    expect(screen.getByText('無法載入 Sprint 資料，請檢查資料來源')).toBeInTheDocument();
    expect(screen.getByText('重新載入')).toBeInTheDocument();
  });
});
```

### E2E 測試 (Playwright)

```typescript
// tests/sprint-burndown.spec.ts
test('TC-004: 時間邊界正確處理', async ({ page }) => {
  // 設置測試數據：Sprint 10天，當前第8天
  await setupTestData({
    sprintName: 'Test Sprint',
    totalWorkingDays: 10,
    currentDay: 8
  });
  
  await page.goto('/sprint-burndown/Test%20Sprint');
  
  // 驗證實際線只到第8天
  const actualDataPoints = page.locator('[data-testid="actual-data-point"]');
  await expect(actualDataPoints).toHaveCount(8);
  
  // 驗證未來日期 tooltip
  await page.hover('[data-testid="day-9-point"]');
  await expect(page.locator('[data-testid="tooltip"]')).toContainText('實際剩餘: 未來日期');
});
```

## 📊 技術風險評估

### 高風險項目 🔴

1. **健康狀態計算邏輝準確性**
   - **風險**: 現有邏輯可能不符合 AC 精確要求
   - **緩解**: 詳細單元測試 + 邊界值測試

2. **時間計算複雜度**
   - **風險**: 工作日計算、時區處理可能出錯
   - **緩解**: 使用成熟的日期處理函式庫

### 中風險項目 🟡

1. **前端狀態管理**
   - **風險**: 複雜的錯誤狀態和載入狀態管理
   - **緩解**: 使用 TypeScript 嚴格型別檢查

2. **圖表渲染效能**
   - **風險**: 大量數據點可能影響渲染效能
   - **緩解**: 使用 React.memo 和資料分頁

### 低風險項目 🟢

1. **UI 組件相容性**
   - **風險**: shadcn/ui 組件庫相容性問題
   - **緩解**: 已有成熟的組件基礎

## 🚀 實現里程碑

### Week 1: 核心功能驗證
- [ ] Day 1-2: 後端健康狀態計算邏輯驗證和修正
- [ ] Day 3-4: 前端顏色同步和時間邊界處理驗證
- [ ] Day 5: 整合測試和 Bug 修復

### Week 2: 增強功能實現
- [ ] Day 1-2: 錯誤處理 UI 組件實現
- [ ] Day 3-4: 健康狀態 Badge 組件實現
- [ ] Day 5: E2E 測試腳本撰寫

### Week 3: 測試和優化
- [ ] Day 1-3: 完整測試案例執行
- [ ] Day 4-5: 效能優化和文檔完善

## 🔗 相關文件

| 文件類型 | 檔案名稱 | 用途 |
|----------|----------|------|
| **User Story** | [spec01-us01-sprintprogress.md](../example/spec01-us01-sprintprogress.md) | 需求來源 |
| **Acceptance Criteria** | [spec01-us01-ac.md](../example/spec01-us01-ac.md) | 驗收標準 |
| **Feature Spec** | [spec01-progress-v2.md](../example/spec01-progress-v2.md) | 功能規格 |
| **Test Cases** | [tc-us001-sprint-burndown-visualization.md](./tc-us001-sprint-burndown-visualization.md) | 測試案例 |
| **Tech Overview** | [tech-overview.md](../../tech-overview.md) | 技術架構概覽 |
| **Table Schema** | [table-schema.md](../../table-schema.md) | 資料結構定義 |

## 📝 實現檢查清單

### ✅ 現狀確認
- [x] Sprint 燃盡圖基本視覺化功能
- [x] 健康狀態三色系統定義
- [x] 完成率卡片顯示
- [x] API 數據結構和端點
- [x] 前端組件架構基礎

### 🔍 需要驗證
- [ ] 健康狀態計算邏輯是否符合 AC 閾值要求
- [ ] 進度條與燃盡圖顏色是否完全同步
- [ ] 時間邊界處理是否正確（未來日期 null 值）
- [ ] Tooltip 顯示是否符合 AC 要求

### 🆕 需要實現
- [ ] 空資料和網路錯誤的友善錯誤處理 UI
- [ ] 重新載入功能
- [ ] 右上角健康狀態 Badge 組件
- [ ] 完整的測試案例腳本 (E2E + 單元測試)
- [ ] 載入狀態優化

### 🧪 需要測試
- [ ] TC-001~TC-003: 功能測試自動化
- [ ] TC-004~TC-006: 邊界測試實現
- [ ] TC-007: 異常處理測試
- [ ] 效能測試和響應式測試

## 💡 下一步建議

1. **立即開始**: 健康狀態計算邏輯驗證（最高優先級）
2. **快速實現**: 錯誤處理 UI 組件（用戶體驗關鍵）
3. **並行開發**: 測試案例腳本撰寫（確保品質）
4. **最後優化**: 視覺細節和效能調優

> **重要**: 由於專案已有完整的基礎架構，建議採用「驗證-修正-測試」的迭代方式，而非大幅重構。

---

**文件狀態**: 待 Review  
**預計更新**: 實現過程中根據發現問題持續更新
