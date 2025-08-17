# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jira Dashboard training workshop application demonstrating AI-driven full-stack development. The project is structured as a monorepo with separate frontend and backend applications, designed for rapid prototyping workshops.

### 在開始任何任務之前

- 請用平輩的方式跟我說話討論，不要對我用您這類敬語。
- 不要因爲我的語氣而去揣測我想聽什麼樣的答案。
- 如果你認爲自己是對的，請堅持立場，不用爲了討好我而改變回答。
- 請保持直接、清楚、理性。
- 如果不知道，請跟我討論。

## Monorepo Structure

```
training-jira-dashboard-workshop-base/
├── frontend/                    # Next.js 15 + React 19 + TypeScript
├── backend/                     # Python FastAPI (port 8000)
├── backend-dotnet/              # .NET 8 Web API (port 8001)
├── shared/                      # Shared TypeScript types and constants
├── mock-data/                   # JSON files for development data
├── docs/                        # Technical documentation
└── scripts/                     # Development scripts
```

## Development Commands

**Docker 環境 (推薦):**
- **啟動所有服務**: `make workshop-start` (啟動前端 + 雙後端)
- **停止所有服務**: `make workshop-stop`
- **健康檢查**: `make health`
- **執行所有測試**: `make test`

**前端 (Next.js):**
- **開發伺服器**: `cd frontend && npm run dev` (port 3000)
- **測試**: `make test-frontend`

**Python 後端 (FastAPI):**
- **開發伺服器**: port 8000
- **API 文件**: `http://localhost:8000/docs`
- **測試**: `make test-backend`

**.NET 後端 (Web API):**
- **開發伺服器**: port 8001
- **測試**: `make test-backend-dotnet`

## Architecture

### Frontend (v0.dev Generated)
- **Framework**: Next.js 15 with app router
- **UI Library**: shadcn/ui components with Tailwind CSS
- **Charts**: Recharts for data visualization
- **Key Component**: `frontend/components/jira-dashboard.tsx` - Main dashboard with issue tracking, filtering, charts, and activity feeds
- **API Integration**: Custom hooks in `frontend/hooks/use-api.ts` for backend communication

### Backend (雙後端架構)

#### Python 後端 (FastAPI)
- **Framework**: Python FastAPI
- **Port**: 8000
- **Data Source**: Google Sheets API integration
- **API 文件**: http://localhost:8000/docs
- **Key Files**:
  - `backend/main.py`: FastAPI 應用程式配置
  - `backend/services/sheets_service.py`: Google Sheets 服務
  - `backend/models.py`: 資料模型定義

#### .NET 後端 (Web API)
- **Framework**: .NET 8 Web API
- **Port**: 8001
- **Data Source**: Google Sheets API (CSV format)
- **Key Files**:
  - `backend-dotnet/Program.cs`: Web API 配置
  - `backend-dotnet/GoogleSheetsService.cs`: Google Sheets 服務
  - `backend-dotnet/Models.cs`: 資料模型定義
  - `backend-dotnet/SimpleTests.cs`: 基本測試案例

### Data Integration
- **Google Sheets**: 兩個後端都整合 Google Sheets 作為資料來源
- **API 格式**: RESTful endpoints for dashboard data, table data, and filtering
- **前端整合**: Frontend 可選擇使用任一後端 API

## Configuration Files

**Frontend:**
- `frontend/components.json`: shadcn/ui configuration
- `frontend/tailwind.config.ts`: Tailwind CSS configuration
- `frontend/next.config.mjs`: Next.js config (ESLint/TypeScript errors ignored for workshop)
- `frontend/.env.local`: Environment variables (API_URL)

**Python 後端:**
- `backend/config.py`: 配置檔案
- `backend/requirements.txt`: Python 依賴套件
- `backend/pytest.ini`: 測試配置

**.NET 後端:**
- `backend-dotnet/backend-dotnet.csproj`: 專案檔案與 NuGet 套件
- `backend-dotnet/appsettings.json`: 應用程式配置

## Workshop Learning Path

本專案包含完整的技術文件在 `/docs/` 目錄：
1. 環境設定與 Docker 容器化
2. 前端探索 (Next.js + shadcn/ui)
3. 雙後端 API 開發 (Python FastAPI + .NET Web API)
4. Google Sheets 整合與資料處理
5. 測試策略 (前端 Jest + 後端 pytest/xUnit)

## Development Notes

- **容器化**: 使用 Docker Compose 管理多服務環境
- **API 端點**:
  - Frontend: `http://localhost:3000`
  - Python 後端: `http://localhost:8000`
  - .NET 後端: `http://localhost:8001`
- **資料來源**: Google Sheets API 整合，支援即時資料存取
- **測試覆蓋**: 前端 Jest + Python pytest + .NET xUnit
- **開發工具**: Makefile (Linux/Mac) + workshop.bat (Windows) 提供統一指令介面
