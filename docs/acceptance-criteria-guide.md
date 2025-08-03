## 驗收標準撰寫指引

為什麼要撰寫 Acceptance Criteria？

Acceptance Criteria（簡稱 AC）是用來明確描述 需求何時才算「完成且可被接受」 的條件，幫助 PO、PM 與開發團隊在實作前就對「完成的定義」建立清晰共識。

撰寫 AC 有以下幾個好處：
	•	幫助 PO 與團隊聚焦於「使用者價值」與「行為預期」
	•	協助開發團隊避免過度詮釋或誤解需求
	•	作為 QA 撰寫測試案例的依據
	•	作為後續自動化測試腳本產生的前置材料

Acceptance Criteria 撰寫格式：Gherkin

AC 採用 Gherkin 的 Given-When-Then 結構，明確表達「在什麼情境下、使用者執行了什麼動作、系統應該如何回應」。

場景：簡要描述情境
Given 某些前置條件成立
And 某些系統狀態存在
When 使用者執行某個動作
Then 系統應有的行為或回應
And 驗證結果或畫面變化

🎯 撰寫範圍與原則

撰寫 AC 時，請盡量涵蓋以下情境：
	•	✅ 正常流程（Happy Path）
	•	⚠️ 邊界條件（如：數值上下限、空值處理）
	•	❌ 異常情況（如：帳號不存在、權限不足）
	•	🔒 權限與安全（如：未登入不得存取）

撰寫原則請參考 SMART 原則：
	•	S：具體（Specific）
	•	M：可衡量（Measurable）
	•	A：可達成（Achievable）
	•	R：相關性高（Relevant）
	•	T：具時效性（Time-bound）

⸻

## 🔧 結構化 AI Prompt 模板建議

### ✅ 基礎 Acceptance Criteria 生成 Prompt

```
作為產品需求分析專家，請為以下 User Story 生成詳細的驗收標準：

**User Story：**
[在此輸入您的 User Story]

**Acceptance Criteria 格式要求：**
- 使用 Given-When-Then (Gherkin) 語法
- 使用商業語言（非技術術語）
- 涵蓋正常流程 (Happy Path)
- 包含邊界條件 (Edge Cases)
- 考慮異常情況 (Error Handling)
- 聚焦使用者行為與價值

**請生成至少 3 個場景：**
1. 正常流程場景
2. 邊界條件場景
3. 異常情況場景

**每個場景格式：**
場景：[簡潔描述場景]
Given [前置條件]
And [額外條件]
When [使用者行為]
And [額外行為]
Then [系統預期反應]
And [額外驗證點]
```

### 🎯 進階 Prompt（針對複雜功能）

```
請為以下 User Story 生成完整的驗收標準，並考慮以下面向：

**User Story：**
[輸入 User Story]

**需要涵蓋的場景類型：**
- ✅ 正常流程（Happy Path）
- ⚠️ 邊界條件（數值限制、空值處理）
- ❌ 異常情況（錯誤處理、網路異常）
- 🔒 權限控制（未登入、權限不足）
- 📱 不同裝置（桌面、手機、平板）

**輸出格式：**
每個場景請包含：
1. 場景名稱
2. Given-When-Then 結構
3. 具體的測試數據
4. 預期的使用者體驗

**注意事項：**
- 使用非技術語言
- 聚焦使用者價值
- 可被團隊成員理解
- 避免實作細節
```

### 📝 標準範例

**User Story：**
ID-005: 作為註冊使用者，我希望能透過帳號密碼登入系統，以便存取我的個人儀表板。

**生成的 Acceptance Criteria：**

```gherkin
場景：成功登入系統
Given 用戶帳號 "test@example.com" 已註冊並啟用
And 用戶位於登入頁面
When 用戶輸入正確密碼 "ValidPassword123"
And 點擊登入按鈕
Then 系統應驗證身份並導向至首頁
And 頁面顯示歡迎訊息

場景：帳號不存在
Given 用戶位於登入頁面
When 用戶輸入不存在的帳號 "nonexist@example.com"
And 輸入任意密碼
And 點擊登入按鈕
Then 系統應顯示錯誤訊息 "帳號或密碼錯誤"
And 使用者停留在登入頁面

場景：密碼錯誤
Given 用戶帳號 "test@example.com" 已註冊並啟用
And 用戶位於登入頁面
When 用戶輸入錯誤密碼 "WrongPassword"
And 點擊登入按鈕
Then 系統應顯示錯誤訊息 "帳號或密碼錯誤"
And 密碼欄位應清空
```

## 📋 Acceptance Criteria 和 Test Case 有什麼不同？

| 項目 | Acceptance Criteria | Test Case |
|---------|------|---------|
| **撰寫時機** | 需求規劃階段 | 開發或測試階段 |
| **撰寫角色** | PO / PM | QA / Dev |
| **撰寫目的** | 定義完成條件 | 驗證系統實作是否正確 |
| **語言** | Gherkin 商業語言（非技術） | 系統導向測試步驟 |
| **細節程度** | 聚焦使用者場景與行為 | 更細節，包含操作與驗證點 |
| **對象** | 團隊成員（可對話） | 測試或系統驗證工具 |

### 實際範例對比

**同一個功能的 AC vs Test Case：**

#### ✅ Acceptance Criteria (驗收標準)
```gherkin
場景：使用者成功登入系統
Given 使用者已註冊帳號 "john@example.com"
And 使用者位於登入頁面
When 使用者輸入正確的帳號密碼
And 點擊登入按鈕
Then 系統應導向至儀表板頁面
And 顯示歡迎訊息 "歡迎回來，John"
```

#### 🧪 Test Case (測試案例)
```
測試案例：TC001_登入功能驗證
前置條件：
1. 開啟瀏覽器，導向 https://app.example.com/login
2. 確認測試帳號 john@example.com 存在於資料庫
3. 確認密碼為 "TestPass123"

測試步驟：
1. 在帳號欄位輸入 "john@example.com"
2. 在密碼欄位輸入 "TestPass123"
3. 點擊 "登入" 按鈕
4. 等待頁面載入完成

預期結果：
1. 頁面 URL 變更為 https://app.example.com/dashboard
2. 頁面標題顯示 "儀表板"
3. 右上角顯示使用者名稱 "John"
4. 左側導航選單正常顯示
5. API 回應狀態碼為 200
6. localStorage 中存在 auth_token
```

⸻

## 📎 搭配其他文件的關聯

| 文件名稱 | 焦點 | 產出內容 |
|---------|------|---------|
| `feature-spec-template.md` | 功能規格撰寫 | 完整功能規格文件 |
| `user-story-guide.md` | 用戶故事 | 使用者導向的需求描述 |
| `testcase-guide.md` | 撰寫測試案例 | 測試目的、步驟與預期結果 |