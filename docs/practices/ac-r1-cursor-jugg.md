# Round 1: Acceptance Criteria 生成結果

基於 Round 4 User Story 生成的驗收標準，使用 Given-When-Then (Gherkin) 格式。

## ID-001: Sprint 進度與 BUG 監控

### 場景：產品經理查看 Sprint 整體進度
Given 產品經理已進入 Jira Dashboard 系統
And 當前 Sprint 正在進行中
And Sprint 包含多個 Story 和 Bug
When 產品經理進入 Sprint 進度頁面
Then 系統應顯示 Sprint 的整體完成百分比
And 顯示各功能的 Bug 數量統計
And 顯示剩餘工作時間與 Sprint 結束時間的對比

### 場景：查看功能 Bug 詳細資訊
Given 產品經理位於 Sprint 進度頁面
And 某個功能存在多個 Bug
When 產品經理點擊該功能的 Bug 統計數字
Then 系統應顯示該功能的所有 Bug 清單
And 顯示每個 Bug 的嚴重程度和狀態
And 顯示 Bug 的趨勢圖表

### 場景：Sprint 無 Bug 情況
Given 產品經理已進入系統
And 當前 Sprint 中沒有記錄任何 Bug
When 產品經理查看 Sprint 進度頁面
Then 系統應顯示 Bug 數量為 0
And 顯示相應的提示訊息 "目前沒有發現 Bug"

## ID-002: 自定義狀態燃盡圖

### 場景：Scrum Master 查看自定義燃盡圖
Given Scrum Master 已進入系統
And 團隊已設定自定義狀態（如 Ready to Release = Done）
And Sprint 中有多個不同狀態的 Story
When Scrum Master 進入燃盡圖頁面
And 選擇 "Ready to Release" 作為完成狀態
Then 系統應顯示基於自定義狀態的燃盡圖
And 圖表應反映實際的工作完成狀況
And 顯示剩餘工作量與理想燃盡線的對比

### 場景：切換不同完成狀態
Given Scrum Master 位於燃盡圖頁面
And 系統支援多種完成狀態定義
When Scrum Master 切換完成狀態（如 Done、Ready to Release、Deployed）
Then 系統應即時更新燃盡圖顯示
And 顯示對應狀態下的剩餘工作量
And 保持圖表的時間軸不變

### 場景：無自定義狀態設定
Given Scrum Master 已進入系統
And 團隊尚未設定自定義狀態
When Scrum Master 進入燃盡圖頁面
Then 系統應顯示預設的完成狀態
And 提供設定自定義狀態的選項
And 顯示說明文字 "可設定自定義完成狀態"

## ID-003: 團隊成員任務監控

### 場景：資深開發者查看團隊任務分配
Given 資深開發者已進入系統
And 團隊中有多個成員正在進行不同任務
When 資深開發者進入團隊監控頁面
Then 系統應顯示所有團隊成員的任務分配狀況
And 顯示每個成員的最後更新時間
And 顯示任務的當前狀態和進度

### 場景：識別需要協助的同事
Given 資深開發者位於團隊監控頁面
And 某個同事的任務已超過預期時間未更新
When 資深開發者查看該同事的任務詳情
Then 系統應高亮顯示長時間未更新的任務
And 顯示任務卡住的時間長度
And 提供聯絡該同事的快速方式

### 場景：查看特定成員詳細資訊
Given 資深開發者位於團隊監控頁面
When 資深開發者點擊某個團隊成員
Then 系統應顯示該成員的詳細任務清單
And 顯示每個任務的開始時間和最後更新時間
And 顯示任務的優先級和預計完成時間

## ID-004: 個人任務更新時間監控

### 場景：開發者查看個人任務更新狀況
Given 開發者已進入系統
And 開發者有多個分配的任務
When 開發者進入個人任務頁面
Then 系統應顯示所有分配任務的最後更新時間
And 顯示與當前日期的時間差距
And 高亮顯示長時間未更新的任務

### 場景：識別被忽略的任務
Given 開發者位於個人任務頁面
And 某個任務已超過 3 天未更新
When 開發者查看該任務詳情
Then 系統應顯示警告訊息 "此任務已超過 3 天未更新"
And 顯示任務的預期完成時間
And 提供快速更新任務狀態的選項

### 場景：任務正常更新情況
Given 開發者位於個人任務頁面
And 所有任務都在正常更新週期內
When 開發者查看任務列表
Then 系統應顯示所有任務為正常狀態
And 不顯示任何警告訊息
And 顯示任務的進度百分比

## ID-005: Story 測試完成狀況與 Bug 監控

### 場景：產品經理查看 Story 測試狀況
Given 產品經理已進入系統
And Sprint 中有多個 Story 包含測試任務
When 產品經理進入 Story 品質監控頁面
Then 系統應顯示每個 Story 的測試完成狀況
And 顯示每個 Story 的 Bug 數量
And 顯示測試覆蓋率百分比

### 場景：查看 Story 詳細測試資訊
Given 產品經理位於 Story 品質監控頁面
When 產品經理點擊某個 Story
Then 系統應顯示該 Story 的所有測試案例清單
And 顯示每個測試案例的執行狀態
And 顯示相關的 Bug 詳細資訊

### 場景：Story 無測試任務情況
Given 產品經理位於 Story 品質監控頁面
And 某個 Story 沒有設定測試任務
When 產品經理查看該 Story
Then 系統應顯示 "此 Story 尚未設定測試任務"
And 提供新增測試任務的選項
And 顯示品質風險警告

## ID-006: Sprint Bug 統計與趨勢分析

### 場景：Team Lead 查看 Bug 統計
Given Team Lead 已進入系統
And 當前 Sprint 中有多個 Bug
When Team Lead 進入 Bug 統計頁面
Then 系統應顯示 Bug 總數統計
And 顯示按嚴重程度分類的 Bug 數量
And 顯示 Bug 趨勢圖表

### 場景：查看 Bug 趨勢分析
Given Team Lead 位於 Bug 統計頁面
And Sprint 已進行多天
When Team Lead 查看 Bug 趨勢圖表
Then 系統應顯示每日新增 Bug 數量
And 顯示已解決 Bug 數量
And 顯示 Bug 解決時間趨勢

### 場景：Bug 數量異常情況
Given Team Lead 位於 Bug 統計頁面
And 某天 Bug 數量突然增加
When Team Lead 查看該天的詳細資訊
Then 系統應高亮顯示異常的 Bug 數量
And 顯示可能的原因分析
And 提供調整開發流程的建議

## ID-007: Story Subtask 完整性檢查

### 場景：開發者查看 Story 完整 Subtask
Given 開發者已進入系統
And 某個 Story 包含多個 Subtask
When 開發者點擊該 Story
Then 系統應顯示完整的 Subtask 清單
And 顯示每個 Subtask 的工作量估算
And 顯示 Subtask 的依賴關係

### 場景：Story 無 Subtask 情況
Given 開發者已進入系統
And 某個 Story 尚未設定 Subtask
When 開發者點擊該 Story
Then 系統應顯示 "此 Story 尚未設定 Subtask"
And 提供新增 Subtask 的選項
And 顯示工作量估算提醒

### 場景：查看 Subtask 詳細資訊
Given 開發者位於 Story 詳情頁面
When 開發者點擊某個 Subtask
Then 系統應顯示該 Subtask 的詳細描述
And 顯示工作量估算和實際耗時
And 顯示相關的測試案例

## ID-008: 項目卡住時間與原因分析

### 場景：產品經理查看項目卡住狀況
Given 產品經理已進入系統
And 某個項目已超過預期時間未更新
When 產品經理進入項目監控頁面
Then 系統應顯示所有卡住項目的清單
And 顯示每個項目的卡住時間長度
And 顯示可能的卡住原因分析

### 場景：查看項目卡住詳細原因
Given 產品經理位於項目監控頁面
When 產品經理點擊某個卡住的項目
Then 系統應顯示該項目的詳細卡住原因
And 顯示相關的阻礙因素
And 提供解決建議和介入選項

### 場景：項目正常進行情況
Given 產品經理位於項目監控頁面
And 所有項目都在正常進行中
When 產品經理查看項目列表
Then 系統應顯示所有項目為正常狀態
And 不顯示任何卡住警告
And 顯示項目的正常進度

## 系統限制與注意事項

### 當前系統能力
- ✅ 支援 Google Sheets 資料讀取（5分鐘快取）
- ✅ 提供分頁、排序、篩選功能
- ✅ 支援動態欄位顯示（到 Column W）
- ✅ 具備圖表視覺化能力
- ✅ 支援響應式設計

### 系統限制
- ⚠️ 無使用者認證系統（所有資料公開可見）
- ⚠️ 僅支援唯讀操作（無法寫入資料）
- ⚠️ 資料更新有 5 分鐘延遲
- ⚠️ 無角色權限控制
- ⚠️ rawStatusTime 表尚未整合（狀態變更歷史受限）

### 技術實作考量
- 所有 AC 都基於現有的 API 端點實作
- 使用現有的資料欄位進行統計和分析
- 圖表功能使用 Recharts 實作
- 分頁和篩選使用現有的後端 API

## 驗收標準檢查清單

### 功能完整性檢查
- ✅ 所有 User Story 都有對應的 Acceptance Criteria
- ✅ 涵蓋正常流程、邊界條件和異常情況
- ✅ 使用 Given-When-Then 格式
- ✅ 聚焦使用者行為和價值
- ✅ 符合系統實際技術能力

### 可測試性檢查
- ✅ 每個場景都有明確的驗證點
- ✅ 包含具體的測試數據和預期結果
- ✅ 可被 QA 團隊理解並執行測試
- ✅ 基於現有 API 端點和資料欄位

### 商業價值檢查
- ✅ 解決原始痛點問題
- ✅ 提升團隊工作效率
- ✅ 改善專案管理品質
- ✅ 符合教學專案的目標
