# 資料表架構文件

本文件說明 Google Sheets rawData 資料表中各欄位的含義和用途。

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
| **Priority** | string | 優先級（如：Highest、High、Medium、Low、Lowest） |
| **Urgency** | string | 緊急程度，用於區分優先級相同但緊急程度不同的項目 |

### 估算與評分欄位

| 欄位名稱 | 類型 | 說明 |
|---------|------|------|
| **T-Size** | number | T-Shirt Size 估算法，可能使用數值表示（如：1=XS, 2=S, 3=M, 5=L, 8=XL） |
| **Confidence** | number | 估算的信心程度，可能是百分比或評分 |
| **Story Points** | number | 敏捷開發中的故事點數，用於估算工作量 |
| **BusinessPoints** | number | 商業價值點數，用於衡量功能的商業價值 |

### 時間相關欄位

| 欄位名稱 | 類型 | 說明 |
|---------|------|------|
| **Created** | date | Issue 建立時間 |
| **Updated** | date | 最後更新時間 |
| **Resolved** | date | 解決/完成時間 |
| **Due date** | date | 預計到期日 |
| **Σ Time Spent** | string | 總計花費時間，可能包含時間單位（如：2h、3d） |

### 分類與標籤欄位

| 欄位名稱 | 類型 | 說明 |
|---------|------|------|
| **Clients** | string | 相關客戶或客戶群組 |
| **TaskTags** | string | 任務標籤，用於分類和搜尋 |
| **Project.name** | string | 專案的完整名稱 |

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