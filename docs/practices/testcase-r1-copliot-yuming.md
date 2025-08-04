# Test Cases for Sprint Progress & Quality Visibility (by Yuming)

---

| 測試案例編號 | 測試目標 | 相關 User Story | 相關 AC 場景 | 測試前置條件 | 測試步驟 | 預期結果 | 測試資料 | 測試類型 | 自動化程度 |
|---|---|---|---|---|---|---|---|---|---|
| TC-004-001 | 驗證 Jira Dashboard 正常顯示 Story 與 Subtask 狀態 | ID-004 | 場景：正常流程 | 1. Jira Story/Subtask 狀態已更新<br>2. 工程經理已登入 | 1. 打開 Jira Dashboard<br>2. 檢查 Story 剩餘時間與 Subtask 狀態 | 1. 顯示所有 Story 剩餘時間<br>2. 顯示所有 Subtask 狀態 | Story: S-001, Subtask: ST-001 | 功能測試 | 全自動（E2E） |
| TC-004-002 | 驗證 Dashboard 標示缺漏資訊 | ID-004 | 場景：邊界條件 | 1. 有 Story 未分配 Subtask 或 Subtask 狀態未更新 | 1. 打開 Jira Dashboard<br>2. 檢查缺漏標示 | 1. 缺漏 Story/Subtask 有明顯標示<br>2. 顯示補全提示 | Story: S-002 | 邊界測試 | 全自動（E2E） |
| TC-004-003 | 驗證 Dashboard 資料同步異常處理 | ID-004 | 場景：異常情況 | 1. 模擬 Jira 與 Dashboard 資料不同步 | 1. 打開 Jira Dashboard | 1. 顯示同步失敗訊息<br>2. 顯示支援指引 | 無 | 異常測試 | 全自動（E2E） |
| TC-005-001 | 驗證長期未完成 Story/Subtask 標示 | ID-005 | 場景：正常流程 | 1. 有 Story/Subtask 超過預期完成時間 | 1. 打開 Jira<br>2. 檢查逾期標示 | 1. 長期未完成 Story/Subtask 有標示<br>2. 顯示協助提示 | Story: S-003, Subtask: ST-003 | 功能測試 | 全自動（E2E） |
| TC-005-002 | 驗證逾期臨界點即時標示 | ID-005 | 場景：邊界條件 | 1. Story/Subtask 剛好達到逾期臨界點 | 1. 打開 Dashboard<br>2. 檢查標示 | 1. 臨界項目即時標示<br>2. 無遺漏 | Story: S-004 | 邊界測試 | 全自動（E2E） |
| TC-005-003 | 驗證無預期完成時間 Story/Subtask 處理 | ID-005 | 場景：異常情況 | 1. Story/Subtask 無預期完成時間 | 1. 打開 Dashboard<br>2. 檢查提示 | 1. 顯示需補全預期完成時間提示<br>2. 不誤判逾期 | Story: S-005 | 異常測試 | 全自動（E2E） |
| TC-006-001 | 驗證高優先級 Story 進度顯示 | ID-006 | 場景：正常流程 | 1. Sprint 已分配高優先級 Story | 1. 打開 Sprint 任務頁<br>2. 檢查高優先級 Story 進度 | 1. 顯示高優先級 Story 進度<br>2. 團隊專注於重要任務 | Story: S-006 | 功能測試 | 全自動（E2E） |
| TC-006-002 | 驗證優先級變動即時反映 | ID-006 | 場景：邊界條件 | 1. Story 優先級調整或未分配 | 1. 打開 Dashboard<br>2. 檢查優先級標示 | 1. 優先級變動即時反映<br>2. 未分配有標示 | Story: S-007 | 邊界測試 | 全自動（E2E） |
| TC-006-003 | 驗證優先級資料同步異常處理 | ID-006 | 場景：異常情況 | 1. 模擬優先級資料同步失敗 | 1. 打開 Dashboard | 1. 顯示同步異常訊息<br>2. 顯示修正建議 | 無 | 異常測試 | 全自動（E2E） |
| TC-007-001 | 驗證 Story Bug 數量與嚴重度顯示 | ID-007 | 場景：正常流程 | 1. Story 已關聯所有 Bug | 1. 打開 Jira<br>2. 檢查 Bug 數量與嚴重度 | 1. 顯示每個 Story 的 Bug 數量與嚴重度<br>2. 可評估品質 | Story: S-008, Bug: B-001 | 功能測試 | 全自動（E2E） |
| TC-007-002 | 驗證未關聯 Bug 或未標註嚴重度提示 | ID-007 | 場景：邊界條件 | 1. Story 無 Bug 或 Bug 無嚴重度 | 1. 打開 Dashboard<br>2. 檢查提示 | 1. 顯示需補全 Bug 關聯或嚴重度提示 | Story: S-009 | 邊界測試 | 全自動（E2E） |
| TC-007-003 | 驗證 Bug 資料同步異常處理 | ID-007 | 場景：異常情況 | 1. 模擬 Bug 資料同步異常 | 1. 打開 Dashboard | 1. 顯示同步失敗訊息<br>2. 顯示重新整理建議 | 無 | 異常測試 | 全自動（E2E） |
| TC-008-001 | 驗證 Burndown Chart 準確反映進度 | ID-008 | 場景：正常流程 | 1. Story/Subtask 狀態皆已更新 | 1. 打開 Burndown Chart<br>2. 檢查剩餘工作量 | 1. 圖表準確反映進度 | Story: S-010 | 功能測試 | 全自動（E2E） |
| TC-008-002 | 驗證異常 Subtask 狀態標示 | ID-008 | 場景：邊界條件 | 1. Subtask 尚未完成或狀態異常 | 1. 打開 Burndown Chart<br>2. 檢查異常標示 | 1. 圖表標示異常區段<br>2. 顯示補全提示 | Subtask: ST-011 | 邊界測試 | 全自動（E2E） |
| TC-008-003 | 驗證 Burndown Chart 資料異常處理 | ID-008 | 場景：異常情況 | 1. 模擬 Burndown Chart 資料異常 | 1. 打開圖表 | 1. 顯示資料異常訊息<br>2. 顯示修正建議 | 無 | 異常測試 | 全自動（E2E） |
| TC-009-001 | 驗證看板 Story/ Subtask 進度顯示 | ID-009 | 場景：正常流程 | 1. Jira 看板已同步所有狀態 | 1. 打開看板<br>2. 檢查 Story 進度與 Subtask 狀態 | 1. 顯示每個 Story 進度（未開始、進行中、待驗收、已完成）<br>2. 顯示所有 Subtask 狀態 | Story: S-012, Subtask: ST-012 | 功能測試 | 全自動（E2E） |
| TC-009-002 | 驗證看板未更新狀態標示 | ID-009 | 場景：邊界條件 | 1. 有 Story 或 Subtask 狀態未更新 | 1. 打開看板<br>2. 檢查未更新標示 | 1. 標示需補全狀態項目<br>2. 顯示負責人提示 | Story: S-013 | 邊界測試 | 全自動（E2E） |
| TC-009-003 | 驗證看板資料同步異常處理 | ID-009 | 場景：異常情況 | 1. 模擬看板資料同步異常 | 1. 打開看板 | 1. 顯示同步失敗訊息<br>2. 顯示支援指引 | 無 | 異常測試 | 全自動（E2E） |
