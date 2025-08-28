# 🚀 Jira Dashboard Workshop - 學員快速開始指南

## 📋 系統需求

請確保已安裝：
- **Docker Desktop** (必須)
- **Git** (必須)
- **文字編輯器** (VS Code 推薦)

## 🎯 快速啟動步驟

### 1️⃣ Clone 專案
```bash
git clone <repository-url>
cd training-jira-dashboard-workshop-base
```

### 2️⃣ 啟動環境

**Mac/Linux 使用者：**
```bash
make start
# 或
make workshop-start
```

**Windows 使用者：**
```cmd
workshop.bat start
```

### 3️⃣ 訪問應用

啟動成功後，打開瀏覽器訪問：
- 📱 **前端**: http://localhost:3000
- 🔧 **後端 API**: http://localhost:8001

## 📝 常用指令

| 功能 | Mac/Linux | Windows |
|------|-----------|---------|
| 啟動環境 | `make start` | `workshop.bat start` |
| 停止環境 | `make stop` | `workshop.bat stop` |
| 查看 logs | `make logs` | `workshop.bat logs` |
| 健康檢查 | `make health` | `workshop.bat health` |
| 重置環境 | `make reset` | `workshop.bat reset` |

## 🔍 故障排除

### 問題 1: Port 已被佔用
```bash
# 停止所有容器
docker-compose down

# 查看佔用 port 的程序
# Mac/Linux:
lsof -i :3000
lsof -i :8001

# Windows:
netstat -ano | findstr :3000
netstat -ano | findstr :8001
```

### 問題 2: Docker 未啟動
請確保 Docker Desktop 已經啟動並運行。

### 問題 3: 環境異常
```bash
# Mac/Linux
make reset

# Windows
workshop.bat reset
```

## 📂 專案結構

```
training-jira-dashboard-workshop-base/
├── frontend/           # Next.js 前端應用
│   ├── app/           # 頁面路由
│   ├── components/    # React 組件
│   └── hooks/         # 自定義 Hooks
├── backend-dotnet/    # .NET Core API
│   ├── Program.cs    # 主程式
│   └── *.cs          # API 實作
├── docker-compose.yml # Docker 配置
├── Makefile          # Mac/Linux 指令
└── workshop.bat      # Windows 指令
```

## ✏️ 開始修改代碼

### 測試環境是否正常：

1. 打開 `frontend/app/page.tsx`
2. 找到這行文字：
   ```tsx
   請修改這行文字並 commit 到 GitHub 確認是否能修改！
   ```
3. 修改成任何你想要的文字
4. 儲存檔案
5. 重新整理瀏覽器，查看修改是否生效

## 💡 小提示

- 前端會自動熱重載，修改後儲存即可看到效果
- 後端修改需要重新編譯，會自動進行
- 所有 logs 都可以透過 `make logs` 或 `workshop.bat logs` 查看
- 遇到問題時，先嘗試 `make health` 檢查服務狀態

## 🆘 需要幫助？

如果遇到任何問題，請：
1. 先查看 logs：`make logs` 或 `workshop.bat logs`
2. 執行健康檢查：`make health` 或 `workshop.bat health`
3. 嘗試重置環境：`make reset` 或 `workshop.bat reset`
4. 向講師尋求協助

---

**Happy Coding! 🎉**