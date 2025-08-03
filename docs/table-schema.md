# 資料表架構文件

本文件說明 Google Sheets 中 rawData 和 rawStatusTime 資料表的欄位含義和用途。

## rawData 資料表

## 欄位說明

### 基本識別欄位

| 欄位名稱 | 類型 | 說明 |
|---------|------|------|
| **Key** | string | Issue 的唯一識別碼，通常格式為 `PROJECT-NUMBER`（例如：IHAIC-1） |
| **Issue Type** | string | Issue 的類型，如 Epic、Story、Task、Bug 等 |
| **Projects** | string | 所屬專案的簡稱或代碼 |
| **Summary** | string | Issue 的標題或簡短描述 |
| **parent** | string | 父級 Issue 的 Key，用於建立 Issue 之間的層級關係 |

### 狀態與進度欄位

| 欄位名稱 | 類型 | 說明 |
|---------|------|------|
| **Status** | string | 當前狀態（如：Backlog、To Do、In Progress、Done） |
| **Sprint** | string | 所屬的 Sprint 名稱或編號 |
| **Status Category** | string | 狀態分類，通常為 To Do、In Progress、Done 三大類 |
| **Status Category Changed** | string | 狀態分類最後變更的時間戳記或記錄 |

### 優先級與重要性欄位

| 欄位名稱 | 類型 | 說明 |
|---------|------|------|
| **Priority** | string | 優先級（值為：Highest、High、Medium、Low、Lowest） |
| **Urgency** | string | 緊急程度，用於區分優先級相同但緊急程度不同的項目（值為：ASAP、In 1 week、In 2 weeks、In 1 Month、In 1 Q）|

### 估算與評分欄位

| 欄位名稱 | 類型 | 說明 |
|---------|------|------|
| **T-Size** | number | T-Shirt Size 估算法，（值為：XS、S、M、L、XL、2XL、Unknown）|
| **Confidence** | number | 估算的信心程度，可能是百分比或評分（值為：Highest、High、Medium、Low、Lowest） |
| **Story Points** | number | 敏捷開發中的故事點數，用於估算工作量 |
| **BusinessPoints** | number | 商業價值點數，用於衡量功能的商業價值 |

### 時間相關欄位

| 欄位名稱 | 類型 | 說明 |
|---------|------|------|
| **Created** | date | Issue 建立時間 |
| **Updated** | date | 最後更新時間 |
| **Resolved** | date | 解決/完成時間 |
| **Due date** | date | 預計到期日 |
| **Σ Time Spent** | string | 總計花費時間，時間單位為秒 |

### 分類與標籤欄位

| 欄位名稱 | 類型 | 說明 |
|---------|------|------|
| **Clients** | string | 相關客戶或客戶群組 |
| **TaskTags** | string | 任務標籤，用於分類和搜尋 |
| **Project.name** | string | Jira 專案ID |

## 資料類型說明

- **string**：文字資料
- **number**：數值資料，可包含小數
- **date**：日期時間格式，通常為 ISO 8601 格式（YYYY-MM-DD HH:mm:ss）

## 使用注意事項

1. **Key 欄位**是每筆資料的唯一識別碼，不可重複
2. **日期欄位**在沒有值時會顯示為 null 或空白
3. **數值欄位**如 Story Points 可能包含小數點，用於更精確的估算
4. **狀態欄位**的值可能因專案設定而有所不同

## 資料完整性

- 必填欄位：Key、Issue Type、Projects、Summary、Status、Priority
- 選填欄位：其他所有欄位根據實際使用情況可能為空

## 更新頻率

此資料表透過 Google Sheets API 讀取，系統設定了 5 分鐘的快取機制，因此資料最多可能有 5 分鐘的延遲。

---

## rawStatusTime 資料表

此資料表記錄每個 Issue 的狀態變更歷史，用於追蹤和分析狀態轉換的時間軸。

### 欄位說明

| 欄位名稱 | 類型 | 說明 |
|---------|------|------|
| **Key** | string | Issue 的唯一識別碼，與 rawData 表中的 Key 相對應 |
| **Summary** | string | Issue 的標題或簡短描述 |
| **Created** | date | Issue 建立時間 |
| **Status Transition.date** | date | 狀態變更發生的時間 |
| **Status Transition.from** | string | 變更前的狀態 |
| **Status Transition.to** | string | 變更後的狀態 |

### 資料結構說明

每個 Issue 可能有多筆記錄，每筆記錄代表一次狀態變更。透過這些記錄可以重建完整的狀態變更時間軸。

### 使用範例

以 PS-28 為例，其狀態變更歷史如下：

| Key | Summary | Created | Status Transition.date | Status Transition.from | Status Transition.to |
|-----|---------|---------|----------------------|---------------------|-------------------|
| PS-28 | 顧問講師服務-Task-2 | 7/19/2024 13:20:52 | 9/15/2024 18:09:38 | Routine | Done |
| PS-28 | 顧問講師服務-Task-2 | 7/19/2024 13:20:52 | 7/22/2024 17:05:26 | To Do | Routine |
| PS-28 | 顧問講師服務-Task-2 | 7/19/2024 13:20:52 | 7/19/2024 13:20:52 | Backlog | To Do |

時間軸解讀：
- **7/19/2024 13:20:52**：建立 Issue，初始狀態為 Backlog
- **7/19/2024 13:20:52**：狀態從 Backlog 變更為 To Do
- **7/22/2024 17:05:26**：狀態從 To Do 變更為 Routine
- **9/15/2024 18:09:38**：狀態從 Routine 變更為 Done

### 資料分析用途

1. **週期時間計算**：計算 Issue 在各狀態停留的時間
2. **流程效率分析**：識別瓶頸和延遲點
3. **趨勢追蹤**：分析團隊的工作流程變化
4. **SLA 監控**：確保符合服務等級協議

### 注意事項

1. 記錄按時間倒序排列（最新的變更在前）
2. Created 欄位在每筆記錄中都相同，代表 Issue 的原始建立時間
3. 第一筆狀態變更通常發生在建立時，from 狀態可能是系統預設值