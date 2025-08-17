# 📋 Python 後端 API Specification - Google Sheets Table View

## 🎯 專案概述
建立 Python FastAPI 後端服務，連接 Google Sheets 作為資料源，為前端 Table View 提供分頁資料 API 服務。

## 📊 資料源
- **Google Sheets URL**: https://docs.google.com/spreadsheets/d/1RmJjghgiV3XWLl2BaxT-md8CP3pqb1Wuk-EhFoqp1VM/edit?usp=sharing
- **主要工作表**: `rawData` (讀取範圍: A:W，包含 Project.name)
- **Sprint 資料工作表**: `GetJiraSprintValues` (讀取範圍: Column C，Sprint Name)
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
  - sprint: string (optional, Sprint 篩選條件)

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
}
```

### **5. 取得 Sprint 篩選選項**
```
GET /api/table/sprints
Response: {
    "sprints": [
        "All",
        "Sprint 1",
        "Sprint 2", 
        "Current Sprint",
        "No Sprints"
    ]
}
```

## 🎯 Dashboard MVP API 端點

### **6. 取得 Dashboard 統計資料（MVP 版本）**
```
GET /api/dashboard/stats
Query Parameters:
  - sprint: string (optional, Sprint 篩選條件)

Response: {
    "total_issues": 1250,
    "total_story_points": 89.5,
    "done_issues": 485,
    "done_story_points": 42.0,
    "last_updated": "2024-01-01T12:00:00Z"
}
```

### **7. 取得 Issue 狀態分布資料（MVP 版本）**
```
GET /api/dashboard/status-distribution
Query Parameters:
  - sprint: string (optional, Sprint 篩選條件)

Response: {
    "distribution": [
        {
            "status": "Done",
            "count": 485,
            "percentage": 38.8
        },
        {
            "status": "In Progress", 
            "count": 85,
            "percentage": 6.8
        },
        {
            "status": "To Do",
            "count": 680,
            "percentage": 54.4
        }
    ],
    "total_count": 1250,
    "last_updated": "2024-01-01T12:00:00Z"
}
```


## 🔧 實作需求

### **Google Sheets 連接邏輯**
```python
# CSV 格式讀取 URL (限制讀取到 Column W)
csv_url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={SHEET_NAME}&range=A:W"

# 使用 requests + pandas 讀取
response = requests.get(csv_url)
df = pd.read_csv(StringIO(response.text))

# 資料快取機制（避免頻繁請求 Google Sheets）
CACHE_DURATION = 300  # 5分鐘快取
```

### **Sprint 資料讀取邏輯**
```python
# 讀取 Sprint 資料 URL
sprint_csv_url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet=GetJiraSprintValues&range=C:C"

# 使用 requests + pandas 讀取 Sprint 資料
response = requests.get(sprint_csv_url)
sprint_df = pd.read_csv(StringIO(response.text))

# 處理 Sprint 選項：
# 1. 加入 "All" 選項
# 2. 移除 N/A 值
# 3. 去除重複
# 4. 加入 "No Sprints" 選項
def get_sprint_options(sprint_df):
    sprints = ['All']  # 預設第一個選項
    unique_sprints = sprint_df['Sprint Name'].dropna().unique()
    valid_sprints = [s for s in unique_sprints if s != 'N/A' and s.strip() != '']
    sprints.extend(sorted(valid_sprints))
    sprints.append('No Sprints')
    return sprints
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

### **Sprint 篩選邏輯**
```python
def apply_sprint_filter(df, sprint_filter=None):
    if not sprint_filter or sprint_filter == "All":
        # "All" 或空值：返回全部資料
        return df
    
    if sprint_filter == "No Sprints":
        # 篩選 Sprint 欄位為空白的項目
        return df[df['sprint'].isna() | (df['sprint'] == '') | (df['sprint'].str.strip() == '')]
    else:
        # 篩選指定 Sprint
        return df[df['sprint'] == sprint_filter]
```

### **Dashboard MVP 統計計算邏輯**
```python
def calculate_dashboard_stats_mvp(df):
    """計算 Dashboard MVP 關鍵指標"""
    total_issues = len(df)
    
    # 計算總故事點數（假設 Story Points 欄位名稱為 'story_points' 或 'storypoints'）
    story_points_col = None
    for col in df.columns:
        if 'story' in col.lower() and 'point' in col.lower():
            story_points_col = col
            break
    
    total_story_points = 0
    if story_points_col:
        total_story_points = df[story_points_col].fillna(0).sum()
    
    # 計算已完成的 Issues（Done 狀態）
    done_df = df[df['status'].str.contains('Done|done|Resolved|resolved', na=False)]
    done_issues = len(done_df)
    
    # 計算已完成的故事點數
    done_story_points = 0
    if story_points_col:
        done_story_points = done_df[story_points_col].fillna(0).sum()
    
    return {
        "total_issues": total_issues,
        "total_story_points": float(total_story_points),
        "done_issues": done_issues,
        "done_story_points": float(done_story_points),
        "last_updated": datetime.now().isoformat()
    }

def calculate_status_distribution_mvp(df):
    """計算 Issue 狀態分布（MVP 版本）"""
    status_counts = df['status'].value_counts()
    total_count = len(df)
    
    distribution = []
    for status, count in status_counts.items():
        percentage = round((count / total_count) * 100, 1)
        distribution.append({
            "status": status,
            "count": int(count),
            "percentage": percentage
        })
    
    return {
        "distribution": distribution,
        "total_count": total_count,
        "last_updated": datetime.now().isoformat()
    }
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
3. **Sprint 篩選**: 下拉選單篩選特定 Sprint 的 Issues
4. **響應式設計**: 支援桌面和行動裝置
5. **載入狀態**: 顯示載入動畫
6. **錯誤處理**: 顯示錯誤訊息

### **表格欄位**
- ID (可點擊排序)
- Title 
- Status 
- Priority 
- Assignee 
- Created Date (可排序)
- Updated Date (可排序)
- Description

### **UI/UX 設計**
- 現代化表格設計
- 懸停效果
- 選中行高亮
- 分頁資訊顯示
- 載入狀態指示器

## ✅ 驗收標準

### **後端功能需求**

#### **Google Sheets Table API**
1. ✅ 成功連接 Google Sheets 並讀取 rawData 工作表
2. ✅ 分頁 API 正常運行，每頁預設 100 筆資料
3. ✅ 支援排序功能
4. ✅ 支援 Sprint 篩選功能，讀取 GetJiraSprintValues 工作表
5. ✅ 提供 Sprint 選項 API 端點
6. ✅ 支援 CORS 讓前端可以呼叫 API
7. ✅ 包含錯誤處理和適當的 HTTP 狀態碼
8. ✅ 提供 Swagger 文件 (FastAPI 自動生成)
9. ✅ 資料快取機制避免頻繁請求 Google Sheets

#### **Dashboard MVP API**
10. 🔄 提供 Dashboard 統計資料 API 端點 (`/api/dashboard/stats`)
    - 支援 Sprint 篩選參數
    - 返回：總 Issue 數、總故事點數、完成 Issue 數、完成故事點數
11. 🔄 提供 Issue 狀態分布 API 端點 (`/api/dashboard/status-distribution`)
    - 支援 Sprint 篩選參數
    - 返回：各狀態的數量和百分比
12. 🔄 所有 Dashboard API 端點使用相同的資料快取機制
13. 🔄 Dashboard API 提供適當的統計計算和資料聚合

### **前端功能需求**

#### **Google Sheets Table 頁面**
1. ✅ 表格正確顯示 Google Sheets 資料
2. ✅ 分頁功能正常運作
3. ✅ 排序功能正常運作
4. ✅ Sprint 篩選下拉選單正常運作
5. ✅ Sprint 篩選與分頁的正確整合
6. ✅ 響應式設計支援各種螢幕尺寸
7. ✅ 載入狀態和錯誤處理

#### **Jira Dashboard MVP 頁面整合**
8. 🔄 Dashboard 主頁面整合 Google Sheets 資料來源
9. 🔄 4 個關鍵指標卡片顯示即時統計資料：
   - Total Issue Count
   - Total Story Points  
   - Total Done Item Count
   - Total Done Item Story Points
10. 🔄 Issue 狀態分布圖表（長條圖）正常顯示
11. 🔄 Sprint 下拉選單篩選功能正常運作
12. 🔄 選擇 Sprint 後，所有指標和圖表同步更新
13. 🔄 圖表支援滑鼠懸停顯示詳細數值
14. 🔄 Dashboard 頁面載入狀態和錯誤處理

### **測試需求**

#### **API 端點測試**
1. ✅ 可以透過 `http://localhost:8001/docs` 查看 API 文件（.NET backend）
2. ✅ 所有 Table API 端點都能返回正確格式的 JSON
3. ✅ Google Sheets 連接異常時能正確處理錯誤
4. ✅ 前端可以成功呼叫 API 並取得分頁資料
5. ✅ 表格功能（排序、Sprint 篩選）正常運作
6. 🔄 Dashboard Stats API 端點返回正確的 JSON 格式
   - 包含：total_issues, total_story_points, done_issues, done_story_points
7. 🔄 Dashboard Status Distribution API 端點返回正確的 JSON 格式
   - 包含：各狀態的 count 和 percentage
8. 🔄 Dashboard API 支援 Sprint 篩選參數
9. 🔄 Dashboard API 統計計算結果正確
10. 🔄 Dashboard API 快取機制運作正常

#### **整合測試**
11. 🔄 Jira Dashboard 頁面成功載入 Google Sheets 資料
12. 🔄 4 個 Score Cards 顯示正確的統計數值
13. 🔄 狀態分布圖表資料與 Google Sheets 資料一致
14. 🔄 Sprint 篩選功能在 Dashboard 頁面正常運作
15. 🔄 Dashboard 與 Google Sheets Table 資料來源同步

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