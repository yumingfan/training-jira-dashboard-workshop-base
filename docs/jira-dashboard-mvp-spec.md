# FS-001-Jira Dashboard MVP - Feature Spec

> **檔案編號**: FS-001-jira-dashboard-mvp  
> **建立日期**: 2025-08-03  
> **最後更新**: 2025-08-03  
> **狀態**: [規劃中]

## 📝 功能概述

### 需求背景

目前團隊使用 Jira 管理專案，但原生 Jira 介面資訊分散，難以快速掌握專案整體狀態。團隊成員反饋需要一個集中式的儀表板，能夠一目了然地查看關鍵指標、Issue 狀態分布、優先級分布等資訊，並支援快速篩選和搜尋功能。

### 功能描述

建立一個視覺化的 Jira Dashboard，整合並展示專案的關鍵資訊，提供即時的專案健康度監控和 Issue 管理能力。

### 預期影響

- **使用者影響**: 
  - 減少查找資訊的時間，提升 30% 的工作效率
  - 提供直觀的資料視覺化，協助快速決策
  - 支援多專案切換，方便跨專案管理
  
- **技術影響**: 
  - 整合 Google Sheets 作為真實資料源
  - 前端需要實作響應式設計和資料視覺化
  - 後端需要提供資料聚合、統計計算和快取機制

## 🎯 需求規格

### 核心功能需求

1. **關鍵指標卡片（Score Cards）**: 
   - **Total Issue Count**: 總 Issue 數量統計
   - **Total Story Points**: 總故事點數統計
   - **Total Done Item Count**: 已完成 Issue 數量統計
   - **Total Done Item Story Points**: 已完成 Issue 故事點數統計
   - 數據來源：Google Sheets rawData 工作表即時統計
   - 即時更新數據，反映最新狀態

2. **Issue 狀態分布圖表（Bar Chart）**: 
   - 使用長條圖展示各狀態的 Issue 分布
   - 數據來源：Google Sheets rawData 工作表 Status 欄位統計
   - 支援滑鼠懸停顯示詳細數值

3. **Sprint 篩選功能**:
   - 提供 Sprint 下拉選單篩選器
   - 動態載入 Sprint 選項（來源：GetJiraSprintValues sheet 的 Column C）
   - 篩選邏輯：
     - "All" 選項：顯示全部資料（預設選項）
     - 忽略值為 "N/A" 的 Sprint
     - 顯示所有有效的 Sprint Name
     - "No Sprints" 選項：篩選 Sprint 欄位為空白的項目
   - 選擇 Sprint 後即時更新 Issues 列表

### 使用者體驗需求

- **操作流程**: 
  - 進入頁面即可看到 4 個關鍵指標卡片和狀態分布圖表
  - 使用 Sprint 下拉選單即時篩選資料
  - 選擇 Sprint 後，所有指標和圖表同步更新
  
- **介面需求**: 
  - 清晰的視覺層次，重要資訊優先顯示
  - 響應式設計，支援桌面和平板裝置
  - 統一的設計語言和顏色系統
  
- **效能需求**: 
  - 首次載入時間 < 3 秒
  - 資料更新延遲 < 1 秒
  - 流暢的互動體驗，無明顯卡頓

### 邊界與限制

- **功能邊界**: 
  - MVP 版本僅包含 4 個關鍵指標卡片和 1 個狀態分布圖表
  - 不包含優先級分布圖表、最近活動追蹤、Issue 列表管理
  - 不包含 Issue 的建立和編輯功能（僅查看統計）
  - 不包含使用者權限管理
  
- **技術限制**: 
  - 使用 Google Sheets 作為資料源，不直接連接 Jira API
  - 暫不支援行動裝置優化
  - 資料更新頻率受限於後端快取策略（5分鐘快取）
  
- **時程限制**: 
  - MVP 版本預計 1 週完成
  - 包含前後端開發和基本測試

## 🔧 技術考量

### 影響範圍

- **前端變更**: 
  - 簡化 `/components/jira-dashboard.tsx` 主要元件，僅包含 4 個 Score Cards 和 1 個 Bar Chart
  - 整合 Recharts 圖表庫（僅長條圖）
  - 使用 shadcn/ui 元件系統
  - 新增自訂 hooks 管理 Dashboard 資料狀態
  
- **後端變更**: 
  - 建立 2 個 Dashboard API 端點：統計資料 + 狀態分布
  - 實作 Google Sheets 資料統計計算邏輯（Issue Count、Story Points）
  - 加入記憶體快取機制
  - 支援 Sprint 篩選參數
  
- **資料來源變更**: 
  - 使用 Google Sheets 作為真實資料源
  - rawData 工作表提供 Issue 資料和 Story Points 資料
  - GetJiraSprintValues 工作表提供 Sprint 選項

### 相關資源

- **設計稿**: 使用 v0.dev 生成的原型設計
- **參考資料**: 
  - Jira 官方 Dashboard 功能
  - 類似的開源專案管理儀表板
  - Material Design 資料視覺化指南

## 🔄 後續開發階段

> **重要提醒**: Feature Spec 完成後，需要繼續以下階段才能開始開發

### 第二階段：User Story 拆分
- **使用指引**: [`user-story-guide.md`](./guides/user-story-guide.md)
- **目標**: 將此 Feature Spec 拆分為可執行的 User Stories
- **產出**: 符合 INVEST 原則的使用者故事集合

### 第三階段：Acceptance Criteria 設計
- **使用指引**: [`acceptance-criteria-guide.md`](./guides/acceptance-criteria-guide.md)
- **目標**: 為每個 User Story 設計驗收標準
- **產出**: Gherkin 格式的驗收標準

### 第四階段：Test Case 產出
- **使用指引**: [`testcase-guide.md`](./guides/testcase-guide.md)
- **目標**: 根據 AC 產出具體測試案例
- **產出**: 詳細的測試步驟與預期結果

### 開發準備檢查清單
- [ ] Feature Spec 已完成並經過團隊 Review
- [ ] User Stories 已拆分完成
- [ ] 每個 User Story 都有對應的 Acceptance Criteria
- [ ] Test Cases 已產出並經過 QA Review
- [ ] 技術方案已評估完成
- [ ] 設計稿已完成（如需要）

---

## 📝 變更記錄

| 日期         | 版本 | 變更內容 | 變更人    |
| ------------ | ---- | -------- | --------- |
| 2025-08-03 | 1.0  | 初版建立 | PM |

## 🔗 相關 User Stories

> **注意**: 此章節在 User Story 拆分完成後填入

| Story ID | Story 標題 | 狀態 | 負責人 |
|----------|-----------|------|--------|
| [待定]   | [待定] | [規劃中] | [待定] |

**相關連結:**
- User Stories 詳細文件: [待建立]
- Acceptance Criteria 文件: [待建立]
- Test Cases 文件: [待建立]