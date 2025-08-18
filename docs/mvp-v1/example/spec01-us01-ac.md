# Acceptance Criteria: US-001 Sprint 燃盡圖視覺化

> **檔案編號**: AC-001-sprint-burndown-visualization  
> **建立日期**: 2025-08-18  
> **最後更新**: 2025-08-18  
> **狀態**: 規劃中  
> **對應 User Story**: [US-001](./spec01-us01-sprintprogress.md#us-001-sprint-燃盡圖視覺化)

## 📋 User Story 回顧

**ID-001**: 作為 Scrum Master，我希望能在儀表板上看到即時更新的 Sprint 燃盡圖，並顯示當前 Sprint 完成率（已完成故事點數/總故事點數），以便在每日站會中快速識別進度是否落後於預期，並引導團隊討論真正的障礙。

## 🎯 驗收標準 (Acceptance Criteria)

### AC-001-01: 正常顯示燃盡圖與完成率

**場景：** Scrum Master 查看正常進行中的 Sprint 燃盡圖

```gherkin
Given Sprint 2 正在進行中
And 總故事點數為 20 SP
And 已完成 13 SP，剩餘 7 SP
And 今天是 Sprint 的第 7 天，共 10 天
When Scrum Master 進入儀表板頁面
Then 應顯示 Sprint 燃盡圖
And 顯示完成率為 "65% 完成"
And 顯示進度詳情 "已完成: 13 SP | 剩餘: 7 SP | 總計: 20 SP"
And 燃盡圖顯示理想燃盡線（從 20 SP 線性遞減至 0）
And 燃盡圖顯示實際燃盡線（反映當前 13 SP 的完成狀況）
And 進度條顯示 65% 的視覺進度
```

---

### AC-001-02: 進度健康度色彩指示 - 正常狀態

**場景：** Sprint 進度正常或超前時的視覺表現

```gherkin
Given Sprint 正在進行中
And 實際進度等於或超前理想進度
And 當前完成率為 70%，時間進度為 60%
When Scrum Master 查看儀表板
Then 進度條應顯示綠色
And 完成率數字應為綠色
And 燃盡圖實際線應為綠色
And 不顯示任何警告圖示
```

---

### AC-001-03: 進度健康度色彩指示 - 警示狀態

**場景：** Sprint 進度稍微落後時的視覺警示

```gherkin
Given Sprint 正在進行中
And 實際進度落後理想進度 10-20%
And 當前完成率為 50%，時間進度為 70%
When Scrum Master 查看儀表板
Then 進度條應顯示黃色
And 完成率數字應為黃色
And 燃盡圖實際線應為黃色
And 顯示輕微警告圖示（⚠️）
```

---

### AC-001-04: 進度健康度色彩指示 - 危險狀態

**場景：** Sprint 進度嚴重落後時的視覺警示

```gherkin
Given Sprint 正在進行中
And 實際進度落後理想進度 20% 以上
And 當前完成率為 30%，時間進度為 80%
When Scrum Master 查看儀表板
Then 進度條應顯示紅色
And 完成率數字應為紅色
And 燃盡圖實際線應為紅色
And 顯示嚴重警告圖示（🚨）
And 在進度區域顯示醒目的 "進度落後" 提示
```

---

### AC-001-05: 空資料或無效資料處理

**場景：** Google Sheets 資料為空或無效時的錯誤處理

```gherkin
Given Scrum Master 進入儀表板
When Google Sheets 中沒有 Sprint 資料
Or 總故事點數為 0
Or 無法連接到 Google Sheets
Then 應顯示友善的錯誤訊息 "無法載入 Sprint 資料，請檢查資料來源"
And 燃盡圖區域顯示占位符
And 完成率顯示 "資料載入中..."
And 提供重新載入按鈕
```

---

### AC-001-08: Sprint 時間邊界處理

**場景：** Sprint 開始第一天的顯示

```gherkin
Given 今天是 Sprint 的第 1 天
And 尚未有任何完成的故事點數
When Scrum Master 查看儀表板
Then 完成率應顯示 "0% 完成"
And 燃盡圖應只顯示理想線的起始點
And 實際線應從起始點開始
And 進度條應為空白狀態
```

**場景：** Sprint 最後一天的顯示

```gherkin
Given 今天是 Sprint 的最後一天
And 已完成 18 SP，剩餘 2 SP
When Scrum Master 查看儀表板
Then 完成率應顯示 "90% 完成"
And 應顯示剩餘工作提醒 "剩餘 2 SP 待完成"
And 如果進度落後應顯示明顯的風險警示
```

---

### AC-001-09: 燃盡圖資料點精確性

**場景：** 燃盡圖資料點的準確計算

```gherkin
Given Sprint 為期 10 天
And 總故事點數為 20 SP
And 每天都有進度更新
When 系統計算理想燃盡線
Then 第 1 天應為 20 SP
And 第 5 天應為 10 SP
And 第 10 天應為 0 SP
And 理想線應為直線遞減

When 系統計算實際燃盡線
Then 每個資料點應對應該日的累積完成故事點數
And 實際線應準確反映每日的進度變化
And 週末或非工作日應正確處理（不計入工作天數）
```

---

## 🔗 與其他 User Stories 的關聯

| 相關 US | 關聯點 | 注意事項 |
|---------|--------|----------|
| US-002 | 視覺警示功能 | 確保警示邏輯一致 |
| US-003 | 時間計算 | 共用 Sprint 時間邏輯 |
| US-005 | 資料同步 | 依賴即時資料更新 |

---

## 📝 變更記錄

| 日期       | 版本 | 變更內容 | 變更人 |
| ---------- | ---- | -------- | ------ |
| 2025-08-18 | 1.0  | 初版建立，基於 US-001 需求設計完整的驗收標準 | PM Team |

## 🔗 相關文件

- **User Story**: [`spec01-us01-sprintprogress.md`](./spec01-us01-sprintprogress.md)
- **Feature Spec**: [`spec01-progress.md`](./spec01-progress.md)
- **下一階段**: Test Cases（待建立）
