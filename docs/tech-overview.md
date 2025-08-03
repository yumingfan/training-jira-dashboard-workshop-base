# 技術架構概覽

本文件提供 Training Jira Dashboard Workshop 專案的技術架構深度解析，旨在協助工程師快速理解系統設計、技術選型和實作細節。

## 專案概述

這是一個展示 AI 驅動全端開發的教學專案，採用現代化技術堆疊建構敏捷開發儀表板。專案設計為 monorepo 架構，整合 Google Sheets 作為資料來源，支援 Docker 容器化部署。

### 專案定位
- **Jira Dashboard**：教學用原型展示，使用假資料
- **Google Sheets Table**：生產就緒功能，整合真實資料
- **目標**：展示從原型到生產的完整開發流程

## 系統架構圖

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Google Sheets  │────>│   Backend API    │────>│    Frontend     │
│   (rawData)     │ CSV │  (FastAPI)       │ API │   (Next.js)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                              │                           │
                              ▼                           ▼
                        ┌──────────┐               ┌──────────┐
                        │  Cache   │               │  React   │
                        │ (5 min)  │               │  Hooks   │
                        └──────────┘               └──────────┘
```

## 技術堆疊

### 前端技術

| 技術 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 15.2.4 | React 框架，使用 App Router |
| **React** | 19.0.0 | UI 函式庫 |
| **TypeScript** | 5.x | 型別安全 |
| **shadcn/ui** | latest | UI 元件庫（基於 Radix UI） |
| **Tailwind CSS** | 3.4.x | 實用優先的 CSS 框架 |
| **Recharts** | 2.x | 資料視覺化圖表 |
| **React Hook Form** | 7.x | 表單管理 |
| **Zod** | 3.x | Schema 驗證 |

#### 前端測試工具
| 技術 | 版本 | 用途 |
|------|------|------|
| **Jest** | 29.x | JavaScript 測試框架 |
| **React Testing Library** | 14.x | React 元件測試 |
| **@testing-library/jest-dom** | 6.x | DOM 測試擴充匹配器 |

### 後端技術

| 技術 | 版本 | 用途 |
|------|------|------|
| **Python** | 3.11 | 執行環境 |
| **FastAPI** | 0.104.1 | Web 框架 |
| **Uvicorn** | 0.24.0 | ASGI 伺服器 |
| **Pydantic** | 2.5.0 | 資料驗證和序列化 |
| **Pandas** | 2.1.3 | 資料處理 |
| **Requests** | 2.31.0 | HTTP 請求處理 |

#### 後端測試工具
| 技術 | 版本 | 用途 |
|------|------|------|
| **pytest** | 7.4.3 | Python 測試框架 |
| **pytest-asyncio** | 0.21.1 | 非同步測試支援 |
| **httpx** | 0.25.2 | 測試用 HTTP 客戶端 |

### 基礎設施

| 技術 | 用途 |
|------|------|
| **Docker** | 容器化 |
| **Docker Compose** | 容器編排 |
| **npm workspaces** | Monorepo 管理 |
| **Makefile** | 自動化指令 |

## 專案結構

```
training-jira-dashboard-workshop-base/
├── frontend/                 # Next.js 前端應用
│   ├── app/                 # App Router 路由
│   ├── components/          # React 元件
│   ├── hooks/              # 自訂 React Hooks
│   ├── lib/                # 工具函式
│   ├── public/             # 靜態資源
│   ├── __tests__/          # 前端測試檔案
│   ├── jest.config.js      # Jest 配置
│   └── jest.setup.js       # Jest 設定
├── backend/                 # FastAPI 後端應用
│   ├── main.py            # 應用入口
│   ├── config.py          # 配置管理
│   ├── models.py          # Pydantic 模型
│   ├── services/          # 商業邏輯
│   ├── tests/             # 後端測試檔案
│   └── pytest.ini         # pytest 配置
├── shared/                  # 共享程式碼
├── mock-data/              # 測試資料
├── workshop-guide/         # 工作坊教材
├── docs/                   # 技術文件
├── scripts/                # 輔助腳本
├── docker-compose.yml      # Docker 配置
├── Makefile               # 快速指令
└── package.json           # Monorepo 配置
```

## 核心功能模組

### 前端核心元件

1. **JiraDashboard** (`/frontend/components/jira-dashboard.tsx`) **[原型展示]**
   - 主要儀表板介面
   - **注意**：此為原型展示頁面，使用硬編碼的假資料
   - 包含 Issues 列表、圖表視覺化、活動記錄
   - 學員將在工作坊中學習如何整合真實 API

2. **GoogleSheetsTable** (`/frontend/components/google-sheets-table.tsx`)
   - 動態欄位顯示（支援到 Column W）
   - 表頭凍結與滾動支援
   - 分頁、排序、篩選功能
   - 響應式設計

3. **useGoogleSheets Hook** (`/frontend/hooks/use-google-sheets.ts`)
   - API 資料獲取與快取
   - 狀態管理
   - 錯誤處理
   - 自動重試機制

### 後端 API 端點

| 端點 | 方法 | 功能 | 參數 |
|------|------|------|------|
| `/` | GET | API 資訊 | - |
| `/api/health` | GET | 健康檢查 | - |
| `/api/table/summary` | GET | 表格摘要資訊 | - |
| `/api/table/data` | GET | 分頁資料查詢 | page, page_size, sort_by, sort_order, search, status, priority |
| `/api/table/filters` | GET | 可用篩選選項 | - |

### 資料模型

**前端 TypeScript 介面：**
```typescript
interface TableRow {
  [key: string]: any  // 動態欄位支援
}

interface TableSummary {
  sheet_id: string
  sheet_name: string
  total_rows: number
  total_columns: number
  columns: TableColumn[]
  last_updated: string
}
```

**後端 Pydantic 模型：**
```python
class TableDataResponse(BaseModel):
    data: List[Dict[str, Any]]
    pagination: PaginationInfo
    filters: FilterInfo
```

## Google Sheets 整合

### 資料存取機制

1. **無需 API 金鑰**：使用公開分享的 Google Sheets CSV 匯出 URL
2. **自動更新**：透過 5 分鐘快取機制平衡效能與即時性
3. **資料處理**：
   - CSV 格式自動解析
   - 日期時間欄位自動轉換
   - 數值型別智慧偵測
   - 欄位限制（僅讀取到 Column W）

## 資料來源架構

### 目前資料來源狀態

1. **Jira Dashboard 頁面** **[原型展示]**：
   - **重要**：此頁面為教學用原型，使用硬編碼的假資料展示
   - 資料直接寫在 React 元件內，非真實 API 整合
   - 作為工作坊的起始狀態，學員將學習如何整合真實 API
   - 完成工作坊後，將能連接真實後端 API

2. **Google Sheets Table 頁面** **[生產就緒]**：
   - 完整整合後端 FastAPI，展示真實資料整合
   - 即時從 Google Sheets 讀取資料
   - 實作完整的分頁、排序、篩選功能
   - 可作為實際專案的參考範例

3. **Mock Data 目錄** (`/mock-data/`)：
   - 包含預先準備的 JSON 檔案
   - issues.json、projects.json、users.json 等
   - 供後端 API 開發時使用（工作坊階段 3）

### 資料表結構

詳細的資料表架構說明請參考 [Table Schema 文件](./table-schema.md)。

#### rawData 資料表
主要資料表，包含 Issue 的完整資訊：
- **基本識別**：Key、Issue Type、Projects、Summary、parent
- **狀態與進度**：Status、Sprint、Status Category、Status Category Changed
- **優先級**：Priority、Urgency
- **估算**：T-Size、Confidence、Story Points、BusinessPoints
- **時間相關**：Created、Updated、Resolved、Due date、Σ Time Spent
- **分類標籤**：Clients、TaskTags、Project.name

#### rawStatusTime 資料表 **[尚未連線]**
記錄 Issue 狀態變更歷史，用於追蹤狀態轉換時間軸：
- **Key**：Issue 唯一識別碼
- **Summary**：Issue 標題
- **Created**：Issue 建立時間
- **Status Transition.date**：狀態變更時間
- **Status Transition.from**：變更前狀態
- **Status Transition.to**：變更後狀態

**重要提醒**：此資料表目前尚未整合到系統中，但完整的 schema 定義已記錄在 [Table Schema 文件](./table-schema.md) 中，供未來實作參考。

## 開發環境設定

### 環境需求

- Node.js >= 18.0.0
- npm >= 8.0.0
- Python >= 3.11
- Docker Desktop (可選)

### 快速啟動

```bash
# 方式一：使用 Docker（推薦）
make workshop-start

# 方式二：本地開發
npm run setup  # 安裝所有依賴
npm run dev    # 啟動前後端

# 方式三：分別啟動
cd frontend && npm run dev  # 前端 (http://localhost:3000)
cd backend && uvicorn main:app --reload  # 後端 (http://localhost:8000)
```

### 環境變數

**前端** (`frontend/.env.local`)：
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**後端** (`backend/config.py`)：
```python
GOOGLE_SHEET_ID = "1RmJjghgiV3XWLl2BaxT-md8CP3pqb1Wuk-EhFoqp1VM"
SHEET_NAME = "rawData"
# 注意：rawStatusTime sheet 尚未連線，但 schema 已記錄在 docs/table-schema.md
API_PORT = 8000
CACHE_DURATION = 300  # 5 分鐘
```

## 效能優化策略

### 前端優化

1. **資料快取**：使用 React hooks 實現客戶端快取
2. **虛擬滾動**：大量資料時的效能優化（未來功能）
3. **懶加載**：元件按需載入
4. **預設分頁大小**：100 筆資料

### 後端優化

1. **資料快取**：5 分鐘 Google Sheets 資料快取
2. **分頁處理**：避免一次載入所有資料
3. **欄位限制**：僅讀取必要欄位（到 Column W）
4. **非同步處理**：FastAPI 原生支援

## 安全性考量

1. **CORS 設定**：限制允許的來源
2. **輸入驗證**：Pydantic 自動驗證
3. **錯誤處理**：避免敏感資訊洩露
4. **無需憑證**：使用公開 Google Sheets，避免金鑰管理

## 部署架構

### Docker 容器配置

```yaml
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    
  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - GOOGLE_SHEET_ID=...
      - SHEET_NAME=rawData
```

### 生產環境建議

1. **前端**：部署至 Vercel/Netlify
2. **後端**：部署至 Cloud Run/App Engine
3. **快取**：考慮使用 Redis
4. **監控**：整合 Datadog/New Relic

## 已知限制與挑戰

### 技術限制

1. **Google Sheets API 限制**：
   - 公開分享的安全性考量
   - 無法寫入資料（唯讀）
   - 大量請求可能觸發限流

2. **效能限制**：
   - 大量資料（>10,000 筆）的處理效能
   - 即時更新延遲（5 分鐘快取）

3. **功能限制**：
   - 無使用者認證機制
   - 無資料寫入功能
   - 無即時協作功能

4. **教學設計限制**：
   - Jira Dashboard 刻意使用硬編碼資料作為起始點
   - 學員需要在工作坊中學習 API 整合
   - 部分功能保留為教學練習

### 擴展建議

1. **資料庫整合**：考慮整合 PostgreSQL 提升效能
2. **認證系統**：加入 JWT/OAuth 認證
3. **即時功能**：使用 WebSocket 實現即時更新
4. **API Gateway**：加入 Kong/Traefik 管理 API

## 開發最佳實踐

### 程式碼規範

1. **前端**：
   - 使用 TypeScript 確保型別安全
   - 遵循 React Hooks 規則
   - 元件拆分保持單一職責

2. **後端**：
   - 使用 Type Hints
   - 遵循 PEP 8 規範
   - 適當的錯誤處理

### Git 工作流程

1. 功能分支開發
2. 提交訊息遵循約定式提交
3. Code Review 流程
4. CI/CD 整合（GitHub Actions）

## 測試架構

### 測試策略

專案採用 Docker 容器內執行測試的策略，確保測試環境的一致性，學員無需在本地安裝測試工具。

### 前端測試

- **測試框架**：Jest + React Testing Library
- **測試位置**：`frontend/__tests__/`
- **執行方式**：`make test-frontend` 或 `workshop.bat test-frontend`
- **測試範例**：
  ```typescript
  // 測試首頁是否正確顯示環境測試訊息
  it('renders the environment test success message', () => {
    render(<Home />)
    const successMessage = screen.getByText(/Docker 環境測試成功/)
    expect(successMessage).toBeInTheDocument()
  })
  ```

### 後端測試

- **測試框架**：pytest
- **測試位置**：`backend/tests/`
- **執行方式**：`make test-backend` 或 `workshop.bat test-backend`
- **測試範例**：
  ```python
  def test_health_check():
      """測試健康檢查端點"""
      response = client.get("/api/health")
      assert response.status_code == 200
      assert response.json()["status"] == "healthy"
  ```

### 測試執行指令

```bash
# 前置條件：確保容器正在運行
make workshop-start

# 執行所有測試
make test

# 只執行前端測試
make test-frontend

# 只執行後端測試
make test-backend
```

## 相關文件

- [Table Schema 文件](./table-schema.md) - 詳細的資料表欄位說明
- [測試指南](./testing-guide.md) - 完整的測試框架說明與執行方式
- [API Overview](./api-overview.md) - API 端點詳細說明（如存在）
- [CLAUDE.md](../CLAUDE.md) - AI 開發助手指引

## 結論

這個專案展示了現代全端開發的最佳實踐，特別適合作為 AI 輔助開發的教學範例。透過整合 Google Sheets、容器化部署和現代化框架，提供了一個低門檻但功能完整的解決方案。

對於工程師而言，這個專案可以作為：
- 學習現代技術堆疊的範例
- 快速原型開發的起點
- AI 輔助開發流程的參考

未來可以根據實際需求，逐步擴展功能並優化架構。