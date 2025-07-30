# 📋 Python 後端 API Specification - Google Sheets Table View

## 🎯 專案概述
建立 Python FastAPI 後端服務，連接 Google Sheets 作為資料源，為前端 Table View 提供分頁資料 API 服務。

## 📊 資料源
- **Google Sheets URL**: https://docs.google.com/spreadsheets/d/1RmJjghgiV3XWLl2BaxT-md8CP3pqb1Wuk-EhFoqp1VM/edit?usp=sharing
- **目標工作表**: `rawData`
- **存取權限**: 公開讀取（有連結的人都能檢視）
- **資料格式**: CSV 格式讀取

## 🛠️ 技術規格

### **框架與套件**
```
fastapi==0.104.1
uvicorn==0.24.0
requests==2.31.0
pandas==2.1.4
python-dotenv==1.0.0
pydantic==2.5.0
```

### **專案結構**
```
backend/
├── main.py              # FastAPI 主程式
├── requirements.txt     # Python 依賴套件
├── config.py           # 設定檔
├── models.py           # Pydantic 資料模型
├── services/
│   └── sheets_service.py # Google Sheets 服務層
└── tests/
    └── test_sheets.py   # 測試程式
```

## 🔗 API 端點規格

### **1. 健康檢查**
```
GET /
Response: {"message": "Google Sheets Table API is running!", "version": "1.0.0"}
```

### **2. 資料連接測試**
```
GET /api/health
Response: {
    "status": "healthy",
    "google_sheets_connection": "ok",
    "timestamp": "2024-01-01T12:00:00Z"
}
```

### **3. 取得表格資料摘要**
```
GET /api/table/summary
Response: {
    "sheet_id": "1RmJjghgiV3XWLl2BaxT-md8CP3pqb1Wuk-EhFoqp1VM",
    "sheet_name": "rawData",
    "total_rows": 1000,
    "total_columns": 8,
    "columns": [
        {"name": "ID", "type": "string"},
        {"name": "Title", "type": "string"},
        {"name": "Status", "type": "string"},
        {"name": "Priority", "type": "string"},
        {"name": "Assignee", "type": "string"},
        {"name": "Created", "type": "date"},
        {"name": "Updated", "type": "date"},
        {"name": "Description", "type": "string"}
    ],
    "last_updated": "2024-01-01T12:00:00Z"
}
```

### **4. 取得分頁表格資料**
```
GET /api/table/data
Query Parameters:
  - page: int (optional, default: 1, min: 1)
  - page_size: int (optional, default: 100, min: 10, max: 500)
  - sort_by: string (optional, default: "ID")
  - sort_order: string (optional, "asc" or "desc", default: "asc")
  - search: string (optional, 搜尋所有欄位)
  - status: string (optional, 篩選狀態)
  - priority: string (optional, 篩選優先級)

Response: {
    "data": [
        {
            "id": "JIRA-001",
            "title": "Bug Report",
            "status": "Open",
            "priority": "High",
            "assignee": "John Doe",
            "created": "2024-01-01T10:00:00Z",
            "updated": "2024-01-01T15:30:00Z",
            "description": "Critical bug found in login system"
        }
    ],
    "pagination": {
        "current_page": 1,
        "page_size": 100,
        "total_pages": 10,
        "total_records": 1000,
        "has_next": true,
        "has_prev": false
    },
    "filters": {
        "applied": ["status", "priority"],
        "available": {
            "status": ["Open", "In Progress", "Closed", "Rejected"],
            "priority": ["Low", "Medium", "High", "Critical"]
        }
    }
}
```

### **5. 取得篩選選項**
```
GET /api/table/filters
Response: {
    "status": ["Open", "In Progress", "Closed", "Rejected"],
    "priority": ["Low", "Medium", "High", "Critical"],
    "assignee": ["John Doe", "Jane Smith", "Bob Johnson"],
    "created_date_range": {
        "min": "2024-01-01T00:00:00Z",
        "max": "2024-12-31T23:59:59Z"
    }
}
```

## 🔧 實作需求

### **Google Sheets 連接邏輯**
```python
# CSV 格式讀取 URL
csv_url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={SHEET_NAME}"

# 使用 requests + pandas 讀取
response = requests.get(csv_url)
df = pd.read_csv(StringIO(response.text))

# 資料快取機制（避免頻繁請求 Google Sheets）
CACHE_DURATION = 300  # 5分鐘快取
```

### **分頁邏輯**
```python
def get_paginated_data(df, page=1, page_size=100, sort_by="ID", sort_order="asc"):
    # 排序
    df_sorted = df.sort_values(by=sort_by, ascending=(sort_order == "asc"))
    
    # 分頁
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    
    return df_sorted.iloc[start_idx:end_idx]
```

### **搜尋與篩選邏輯**
```python
def apply_filters(df, search=None, status=None, priority=None):
    if search:
        # 在所有文字欄位中搜尋
        mask = df.astype(str).apply(lambda x: x.str.contains(search, case=False, na=False)).any(axis=1)
        df = df[mask]
    
    if status:
        df = df[df['Status'] == status]
    
    if priority:
        df = df[df['Priority'] == priority]
    
    return df
```

### **錯誤處理**
- Google Sheets 連接失敗 → 返回 503 Service Unavailable
- 資料解析錯誤 → 返回 500 Internal Server Error
- 參數驗證錯誤 → 返回 400 Bad Request
- 分頁參數超出範圍 → 返回 400 Bad Request

### **CORS 設定**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # 前端開發伺服器
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

### **設定檔 (config.py)**
```python
GOOGLE_SHEET_ID = "1RmJjghgiV3XWLl2BaxT-md8CP3pqb1Wuk-EhFoqp1VM"
SHEET_NAME = "rawData"
API_HOST = "0.0.0.0"
API_PORT = 8000
DEBUG_MODE = True
DEFAULT_PAGE_SIZE = 100
MAX_PAGE_SIZE = 500
CACHE_DURATION = 300  # 5分鐘
```

## 🎨 前端 Table View 規格

### **表格功能需求**
1. **分頁控制**: 每頁顯示 100 筆資料，支援上一頁/下一頁
2. **排序功能**: 點擊欄位標題可排序
3. **搜尋功能**: 全域搜尋框，搜尋所有欄位
4. **篩選功能**: 下拉選單篩選狀態、優先級等
5. **響應式設計**: 支援桌面和行動裝置
6. **載入狀態**: 顯示載入動畫
7. **錯誤處理**: 顯示錯誤訊息

### **表格欄位**
- ID (可點擊排序)
- Title (可搜尋)
- Status (可篩選)
- Priority (可篩選)
- Assignee (可篩選)
- Created Date (可排序)
- Updated Date (可排序)
- Description (可搜尋)

### **UI/UX 設計**
- 現代化表格設計
- 懸停效果
- 選中行高亮
- 分頁資訊顯示
- 載入狀態指示器

## ✅ 驗收標準

### **後端功能需求**
1. ✅ 成功連接 Google Sheets 並讀取 rawData 工作表
2. ✅ 分頁 API 正常運行，每頁預設 100 筆資料
3. ✅ 支援排序、搜尋、篩選功能
4. ✅ 支援 CORS 讓前端可以呼叫 API
5. ✅ 包含錯誤處理和適當的 HTTP 狀態碼
6. ✅ 提供 Swagger 文件 (FastAPI 自動生成)
7. ✅ 資料快取機制避免頻繁請求 Google Sheets

### **前端功能需求**
1. ✅ 表格正確顯示 Google Sheets 資料
2. ✅ 分頁功能正常運作
3. ✅ 排序功能正常運作
4. ✅ 搜尋功能正常運作
5. ✅ 篩選功能正常運作
6. ✅ 響應式設計支援各種螢幕尺寸
7. ✅ 載入狀態和錯誤處理

### **測試需求**
1. ✅ 可以透過 `http://localhost:8000/docs` 查看 API 文件
2. ✅ 所有端點都能返回正確格式的 JSON
3. ✅ Google Sheets 連接異常時能正確處理錯誤
4. ✅ 前端可以成功呼叫 API 並取得分頁資料
5. ✅ 表格功能（排序、搜尋、篩選）正常運作

### **啟動方式**
```bash
# 後端
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 前端
cd frontend
npm install
npm run dev
```

### **驗證步驟**
1. 啟動後端服務
2. 訪問 http://localhost:8000 確認服務運行
3. 訪問 http://localhost:8000/docs 查看 API 文件
4. 測試 `/api/table/summary` 端點能正確返回資料摘要
5. 測試 `/api/table/data` 端點能返回分頁資料
6. 啟動前端服務並測試表格功能

---

**這份 spec 文件請直接提供給 Claude Code 進行實作！**