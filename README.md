# AI 驅動敏捷開發工作坊
## 使用 Jira Dashboard 進行快速原型開發

歡迎參加這個使用 AI 驅動開發工具建構全端應用程式的綜合工作坊！本專案展示如何使用現代技術和 AI 輔助來快速原型開發類似 Jira 的儀表板。

## 🎯 工作坊目標

學習如何：
- **快速 UI 原型開發** 使用 v0.dev 即時生成 React 元件
- **全端開發** 使用 Next.js 15 和 Python FastAPI
- **容器化開發環境** 使用 Docker 簡化環境設定
- **API 整合** 與即時資料更新
- **AI 輔助開發** 工作流程以加速迭代

## 🏗️ 專案結構

```
training-jira-dashboard-workshop-base/
├── 📂 frontend/                 # Next.js + React + TypeScript + shadcn/ui
├── 📂 backend/                  # Python + FastAPI API
├── 📂 shared/                   # 共用型別和常數
├── 📂 mock-data/               # 開發用 JSON 資料檔案
├── 📂 workshop-guide/          # 逐步教學指南 (從這裡開始！)
├── 📂 docs/                    # 技術文件
├── 📂 scripts/                 # 開發自動化腳本
├── 📄 CLAUDE.md                # Claude Code AI 助手指引
└── 📄 package.json             # 專案配置
```

## 🚀 Quick Start (Docker Environment)

### Prerequisites
- **Docker Desktop** (唯一需要安裝的工具)
- Git
- Text editor (VS Code/Cursor recommended)

### Setup (學員只需要執行這些指令)

**macOS/Linux 學員:**
```bash
# 1. Clone the repository
git clone https://github.com/your-username/training-jira-dashboard-workshop-base.git
cd training-jira-dashboard-workshop-base

# 2. 啟動 Docker 環境 (一次啟動，全程使用)
make workshop-start

# 3. 等待服務啟動完成 (約 30-60 秒)
```

**Windows 學員:**
```cmd
# 1. Clone the repository
git clone https://github.com/your-username/training-jira-dashboard-workshop-base.git
cd training-jira-dashboard-workshop-base

# 2. 啟動 Docker 環境 (一次啟動，全程使用)
workshop.bat workshop-start

# 3. 等待服務啟動完成 (約 30-60 秒)
```

Visit:
- 🖥️ **Frontend**: http://localhost:3000 (Jira Dashboard)
- 🔧 **Backend API**: http://localhost:8000/api/health
- 📚 **API 文件**: http://localhost:8000/docs

### 🎯 學員開發流程

**macOS/Linux 學員:**
```bash
# 課程開始時啟動一次
make workshop-start

# 課程中修改程式碼 (即時生效，無需重啟)
# 修改 frontend/app/page.tsx → 瀏覽器自動更新
# 修改 backend/main.py → API 自動重新載入

# 課程結束時停止
make workshop-stop
```

**Windows 學員:**
```cmd
# 課程開始時啟動一次
workshop.bat workshop-start

# 課程中修改程式碼 (即時生效，無需重啟)
# 修改 frontend/app/page.tsx → 瀏覽器自動更新
# 修改 backend/main.py → API 自動重新載入

# 課程結束時停止
workshop.bat workshop-stop
```

### 🛠️ 常用指令

**macOS/Linux 學員:**
```bash
# 檢查服務狀態
make health

# 查看即時 logs
make logs

# 重置環境 (故障排除用)
make workshop-reset

# 進入容器 (進階使用)
make shell-frontend
make shell-backend
```

**Windows 學員:**
```cmd
# 檢查服務狀態
workshop.bat health

# 查看即時 logs
workshop.bat logs

# 重置環境 (故障排除用)
workshop.bat workshop-reset

# 查看服務狀態
workshop.bat ps
```

## 📚 工作坊指南

**第一次參加本工作坊？** 從綜合指南開始：

👉 **[開始工作坊：環境設定](./workshop-guide/README.md)**

### 學習路徑
1. **[01 - 環境設定](./workshop-guide/01-setup.md)** ⏱️ 30 分鐘
   - 工具安裝和專案概覽
   
2. **[02 - 前端探索](./workshop-guide/02-frontend-setup.md)** ⏱️ 45 分鐘
   - 了解 v0.dev 生成的元件
   - 自訂儀表板介面
   
3. **[03 - 後端開發](./workshop-guide/03-backend-setup.md)** ⏱️ 90 分鐘
   - 使用 Python FastAPI 建構 API
   - 建立 RESTful 端點
   
4. **[04 - API 整合](./workshop-guide/04-api-integration.md)** ⏱️ 60 分鐘
   - 連接前端和後端
   - 實作即時功能

**總時長**: ~4 小時

## 🛠️ 技術棧

### 前端 (v0.dev 生成)
- **⚛️ Next.js 15** - 使用 app router 的 React 框架
- **🎨 shadcn/ui** - 高品質元件庫
- **🎨 Tailwind CSS** - 實用優先的 CSS 框架
- **📊 Recharts** - 資料視覺化
- **🔷 TypeScript** - 型別安全

### 後端 (工作坊建構)
- **🐍 Python + FastAPI** - 現代 Python Web 框架
- **📄 Google Sheets 整合** - 真實資料來源
- **🔄 RESTful APIs** - 標準 HTTP 端點
- **📊 Pandas** - 資料處理

### 開發工具
- **🐳 Docker** - 容器化開發環境
- **🤖 v0.dev** - AI 驅動的 UI 元件生成
- **🤖 Claude Code** - AI 開發助手
- **📦 npm** - 套件管理

## ✨ 主要功能

### 儀表板功能
- 📊 **問題管理** - 建立、更新和追蹤問題
- 📈 **資料視覺化** - 圖表和統計
- 🔍 **篩選和搜尋** - 進階問題篩選
- 👥 **使用者管理** - 使用者檔案和指派
- 📱 **響應式設計** - 行動裝置友善介面

### 技術功能
- 🔄 **即時更新** - 立即 UI 回饋
- 🚀 **樂觀更新** - 流暢的使用者體驗
- 🛡️ **錯誤處理** - 全面的錯誤管理
- 🔧 **自動重新整理** - 保持資料最新
- 📡 **RESTful API** - 標準後端架構

## 🎓 學習成果

完成本工作坊後，你將了解：

- ✅ 如何運用 AI 工具進行快速原型開發
- ✅ 使用 Next.js 15 的現代 React 模式
- ✅ 使用 Python FastAPI 建構 API
- ✅ Docker 容器化開發環境
- ✅ 全端應用程式架構
- ✅ 即時資料同步模式
- ✅ 使用 AI 輔助的專業開發工作流程
- ✅ Google Sheets 整合真實資料

## 🔧 Development Commands (Docker Environment)

**macOS/Linux 學員:**
```bash
# 主要指令 (學員使用)
make workshop-start    # 啟動所有服務
make workshop-stop     # 停止所有服務
make workshop-reset    # 重置環境
make health           # 檢查服務狀態

# 查看 logs
make logs             # 查看所有服務 logs
make logs-frontend    # 查看前端 logs
make logs-backend     # 查看後端 logs

# 進入容器 (進階使用)
make shell-frontend   # 進入前端容器
make shell-backend    # 進入後端容器
```

**Windows 學員:**
```cmd
# 主要指令 (學員使用)
workshop.bat workshop-start    # 啟動所有服務
workshop.bat workshop-stop     # 停止所有服務
workshop.bat workshop-reset    # 重置環境
workshop.bat health           # 檢查服務狀態

# 查看 logs
workshop.bat logs             # 查看所有服務 logs
workshop.bat ps               # 查看服務狀態
```

**所有平台通用:**
```bash
# 直接使用 docker-compose
docker-compose up --build    # 建構並啟動
docker-compose down          # 停止服務
docker-compose logs -f       # 查看即時 logs
```

## 📖 文件

- **[學員參與指南](./docs/student-setup-guide.md)** - 完整的環境設定步驟 ⭐ **新學員請從這裡開始**
- **[工作坊指南](./workshop-guide/README.md)** - 完整教學
- **[Docker 設定指南](./docs/docker_setup_guide.md)** - Docker 環境設定
- **[CLAUDE.md](./CLAUDE.md)** - AI 助手指引
- **[模擬資料](./mock-data/README.md)** - 資料結構參考

## 🤝 貢獻

本工作坊專為學習而設計。歡迎：
- 實驗程式碼
- 新增功能
- 改善文件
- 分享學習經驗

## 📝 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案。

## 🌟 致謝

- **v0.dev** - 生成美麗的前端元件
- **shadcn/ui** - 優秀的元件庫
- **Claude Code** - AI 輔助開發指引
- **Docker** - 容器化開發環境
- **FastAPI** - 現代 Python Web 框架

---

## 🎯 學員須知

### ✅ 環境優勢
- **只需安裝 Docker Desktop** - 不需要安裝 Node.js、Python 等工具
- **一次啟動，全程使用** - Docker 容器會持續運行
- **即時開發** - 修改程式碼後自動生效，無需重啟
- **故障排除簡單** - 使用 `make workshop-reset` 即可重置環境

### 🚀 開發流程
1. **啟動環境**: `make workshop-start`
2. **修改程式碼**: 在編輯器中修改檔案
3. **即時驗證**: 瀏覽器自動更新，API 自動重新載入
4. **查看狀態**: `make health` 檢查服務狀態
5. **結束課程**: `make workshop-stop`

### 🛠️ 常用指令

**macOS/Linux 學員:**
```bash
make workshop-start    # 啟動環境
make health           # 檢查狀態
make logs             # 查看 logs
make workshop-reset   # 重置環境
make workshop-stop    # 停止環境
```

**Windows 學員:**
```cmd
workshop.bat workshop-start    # 啟動環境
workshop.bat health           # 檢查狀態
workshop.bat logs             # 查看 logs
workshop.bat workshop-reset   # 重置環境
workshop.bat workshop-stop    # 停止環境
```

**準備開始建構了嗎？** 👉 **[開始工作坊](./workshop-guide/README.md)**
