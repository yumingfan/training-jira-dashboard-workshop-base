# Acceptance Criteria for Sprint Progress & Quality Visibility (by Yuming)

---

## ID-004: Sprint Story 與 Subtask 狀態可視化

### 場景：正常流程
Given 團隊成員已在 Jira 上更新 Story 與所有 Subtask 的狀態
When 工程經理打開 Jira Dashboard
Then 可以看到每個 Story 的剩餘時間與所有 Subtask 的最新狀態
And 能一目了然 Sprint 進度

### 場景：邊界條件
Given 有 Story 尚未分配 Subtask 或 Subtask 狀態未更新
When 工程經理檢視 Dashboard
Then 系統應明確標示缺漏資訊的 Story 或 Subtask
And 提示需補全狀態

### 場景：異常情況
Given Jira 與 Dashboard 資料同步異常
When 工程經理打開 Dashboard
Then 系統應顯示同步失敗訊息
And 提供重新整理或聯絡支援的指引

---

## ID-005: 長期未完成項目識別

### 場景：正常流程
Given Sprint 進行中，部分 Story/Subtask 已超過預期完成時間
When 工程經理檢視 Jira
Then 系統應自動標示長期未完成的 Story/Subtask
And 顯示建議協助或調整分配的提示

### 場景：邊界條件
Given 有 Story/Subtask 剛好達到預設的逾期臨界點
When 工程經理檢視 Dashboard
Then 系統應即時更新標示狀態
And 不遺漏任何臨界項目

### 場景：異常情況
Given 部分 Story/Subtask 無預期完成時間設定
When 工程經理檢視 Dashboard
Then 系統應提示需補全預期完成時間
And 不將其誤判為逾期

---

## ID-006: 優先級任務執行監控

### 場景：正常流程
Given Sprint 開始前，團隊已分配高優先級 Story
When 工程經理檢視 Sprint 任務
Then 可以看到高優先級 Story 的執行進度
And 團隊專注於重要任務

### 場景：邊界條件
Given 有 Story 優先級調整或未分配優先級
When 工程經理檢視 Dashboard
Then 系統應即時反映優先級變動
And 標示未分配優先級的 Story

### 場景：異常情況
Given 優先級資料同步失敗
When 工程經理檢視 Dashboard
Then 系統應顯示同步異常訊息
And 提供修正建議

---

## ID-007: Story Bug 數量與嚴重度追蹤

### 場景：正常流程
Given 每個 Story 已關聯所有相關 Bug
When 工程經理檢視 Jira
Then 可以看到每個 Story 的 Bug 數量與嚴重程度
And 能評估交付品質

### 場景：邊界條件
Given 有 Story 尚未關聯任何 Bug 或 Bug 嚴重度未標註
When 工程經理檢視 Dashboard
Then 系統應提示需補全 Bug 關聯或嚴重度資訊

### 場景：異常情況
Given Bug 資料同步異常
When 工程經理檢視 Dashboard
Then 系統應顯示同步失敗訊息
And 提供重新整理建議

---

## ID-008: Burndown Chart 準確反映進度

### 場景：正常流程
Given Story 與 Subtask 狀態皆已更新
When 工程經理檢視 Burndown Chart
Then 圖表能準確反映剩餘工作量與進度

### 場景：邊界條件
Given 有部分 Subtask 尚未完成或狀態異常
When 工程經理檢視 Burndown Chart
Then 圖表應標示異常區段
And 提示需補全狀態

### 場景：異常情況
Given Burndown Chart 資料來源異常
When 工程經理檢視圖表
Then 系統應顯示資料異常訊息
And 提供修正建議

---

## ID-009: Story 與 Subtask 進度透明化

### 場景：正常流程
Given Jira 看板已同步所有 Story 與 Subtask 狀態
When 工程經理檢視看板
Then 可以明確看到每個 Story 的進度（未開始、進行中、待驗收、已完成）
And 同步顯示所有 Subtask 狀態

### 場景：邊界條件
Given 有 Story 或 Subtask 狀態未更新
When 工程經理檢視看板
Then 系統應標示需補全狀態的項目
And 提示負責人盡快更新

### 場景：異常情況
Given 看板資料同步異常
When 工程經理檢視看板
Then 系統應顯示同步失敗訊息
And 提供重新整理或聯絡支援的指引
