# 測試指南

本文件說明如何在 Docker 環境中執行前端和後端的測試。

## 重要提醒

本專案使用 Docker 容器化環境，所有測試都應該在 Docker 容器內執行，無需在本地安裝任何測試工具。

### 執行測試的前置條件

1. **容器必須在運行中**：
   ```bash
   # 先啟動所有服務
   make workshop-start
   ```

2. **首次執行測試**（如果剛新增測試套件）：
   ```bash
   # 方式一：重建並啟動容器
   make workshop-reset
   
   # 方式二：只重建特定容器
   docker-compose build backend
   docker-compose up -d
   ```

3. **確認服務正常運行**：
   ```bash
   make health
   ```

## 前端測試 (Frontend Testing)

### 測試框架
- **Jest**: JavaScript 測試框架
- **React Testing Library**: React 元件測試工具
- **jest-dom**: 提供額外的 DOM 匹配器

### 執行測試 (Docker 環境)

**前置條件**：確保容器正在運行 (`make workshop-start`)

```bash
# 方式一：從外部執行容器內的測試
make test-frontend

# 方式二：進入容器執行測試
make shell-frontend
npm test

# 監聽模式（開發時使用，在容器內執行）
npm run test:watch
```

### 測試檔案結構
```
frontend/
├── __tests__/
│   └── app/
│       └── page.test.tsx    # 首頁測試
├── jest.config.js           # Jest 配置
└── jest.setup.js           # 測試環境設定
```

### 範例測試
```typescript
// __tests__/app/page.test.tsx
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home Page', () => {
  it('renders the environment test success message', () => {
    render(<Home />)
    const successMessage = screen.getByText(/Docker 環境測試成功/)
    expect(successMessage).toBeInTheDocument()
  })
})
```

## 後端測試 (Backend Testing)

### 測試框架
- **pytest**: Python 測試框架
- **pytest-asyncio**: 非同步測試支援
- **httpx**: 測試 HTTP 客戶端

### 執行測試 (Docker 環境)

**前置條件**：確保容器正在運行 (`make workshop-start`)

```bash
# 方式一：從外部執行容器內的測試
make test-backend

# 方式二：進入容器執行測試
make shell-backend
pytest

# 執行特定測試檔案
pytest tests/test_main.py

# 顯示詳細輸出
pytest -v
```

### 測試檔案結構
```
backend/
├── tests/
│   ├── __init__.py
│   ├── conftest.py         # 共用測試配置和 fixtures
│   └── test_main.py        # API 端點測試
└── pytest.ini              # pytest 配置
```

### 範例測試
```python
# tests/test_main.py
def test_health_check():
    """測試健康檢查端點"""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
```

## Windows 學員測試指令

```cmd
# 前端測試
workshop.bat test-frontend

# 後端測試
workshop.bat test-backend

# 或進入容器執行
workshop.bat shell-frontend
npm test

workshop.bat shell-backend
pytest
```

## 持續整合 (CI)

建議在 GitHub Actions 或其他 CI 工具中設定自動測試：

```yaml
# .github/workflows/test.yml
name: Run Tests

on: [push, pull_request]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm test

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: cd backend && pip install -r requirements.txt
      - run: cd backend && pytest
```

## 測試最佳實踐

1. **單元測試優先**: 先寫小而快的單元測試
2. **測試隔離**: 每個測試應該獨立執行，不依賴其他測試
3. **描述性命名**: 測試名稱應該清楚描述測試內容
4. **AAA 模式**: Arrange (準備), Act (執行), Assert (驗證)
5. **Mock 外部依賴**: 使用 mock 避免測試依賴外部服務

## 常見問題

### 前端測試問題

**問題**: `Cannot find module '@/components/...'`
**解決**: 確認 jest.config.js 中的 moduleNameMapper 設定正確

### 後端測試問題

**問題**: `ModuleNotFoundError: No module named 'main'`
**解決**: 確保在 backend 目錄下執行 pytest，或設定 PYTHONPATH

## 下一步

- 增加更多測試案例
- 設定測試覆蓋率目標
- 整合 E2E 測試
- 建立測試自動化流程