# 如何在 Visual Studio Code 中使用 GitHub Copilot

## 1. 啟動 GitHub Copilot Chat

### 方法一：使用快捷鍵
- **Windows/Linux**: `Ctrl + Shift + I`
- **macOS**: `Cmd + Shift + I`

### 方法二：使用命令面板
1. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (macOS)
2. 輸入 "GitHub Copilot: Open Chat"
3. 按 Enter

### 方法三：使用側邊欄
- 點擊左側活動欄中的 GitHub Copilot 圖示（聊天氣泡圖標）

## 2. Chat、Agent、Edit、Ask 的使用時機

### Chat（聊天模式）
- **使用時機**: 一般對話、代碼解釋、問題討論
- **特點**: 可以進行多輪對話，適合探索性問題
- **快捷鍵**: `Ctrl+Shift+I` / `Cmd+Shift+I`

### Agent（智能代理）
- **使用時機**: 需要特定專業知識的任務
- **常用 Agent**:
  - `@workspace` - 整個工作區的上下文
  - `@vscode` - VS Code 相關問題
  - `@terminal` - 終端機相關操作
- **使用方式**: 在 Chat 中輸入 `@` 後選擇對應的 Agent

### Edit（編輯模式）
- **使用時機**: 直接修改現有代碼
- **快捷鍵**: `Ctrl+I` (Windows/Linux) 或 `Cmd+I` (macOS)
- **特點**: 在編輯器中直接顯示建議的修改

### Ask（詢問模式）
- **使用時機**: 快速詢問選中代碼的相關問題
- **使用方式**: 選中代碼後右鍵選擇 "Copilot: Explain This"

## 3. 如何切換 AI 模型

### 在 Chat 面板中切換
1. 打開 Copilot Chat 面板
2. 點擊右上角的模型選擇器（通常顯示當前模型名稱）
3. 選擇可用的模型：
   - **GPT-4** - 更強大但較慢
   - **GPT-3.5** - 較快但功能稍弱

### 通過設置切換
1. 打開設置：`Ctrl+,` (Windows/Linux) 或 `Cmd+,` (macOS)
2. 搜索 "github.copilot.chat.model"
3. 選擇偏好的模型

## 4. 如何指定檔案作為上下文

### 方法一：使用 # 符號
```
#file:src/components/Button.tsx
請幫我優化這個按鈕組件
```

### 方法二：拖拽檔案
- 直接將檔案從檔案總管拖拽到 Chat 輸入框中

### 方法三：使用範圍選擇
1. 在編輯器中選中特定代碼
2. 在 Chat 中輸入問題，Copilot 會自動使用選中的代碼作為上下文

### 方法四：右鍵菜單
1. 在檔案總管中右鍵點擊檔案
2. 選擇 "Copilot: Add to Chat"

## 5. 如何使用 @ 功能（Agents）

### 常用 @ 命令

#### @workspace
```
@workspace 這個專案的架構是什麼？
@workspace 找出所有的 React 組件
@workspace 如何運行這個專案？
```

#### @vscode
```
@vscode 如何設定自動格式化？
@vscode 推薦的擴充套件有哪些？
@vscode 如何設定多個游標？
```

#### @terminal
```
@terminal 如何安裝 npm 套件？
@terminal 運行測試指令
@terminal 啟動開發伺服器
```

#### @github
```
@github 創建一個 pull request
@github 查看最近的 commits
```

### 使用技巧
- 輸入 `@` 後會顯示可用的 Agent 列表
- 可以組合使用：`@workspace #file:package.json 解釋這個專案的依賴關係`

## 6. 如何建立專案規則

### 創建 .copilot-instructions.md 檔案
在專案根目錄創建此檔案來定義專案特定的規則：

```markdown
# Copilot Instructions

## 代碼風格規範
- 使用 TypeScript
- 使用 2 個空格縮排
- 使用單引號而非雙引號
- 函數名使用 camelCase
- 組件名使用 PascalCase

## 專案結構
- React 組件放在 `components/` 資料夾
- 工具函數放在 `utils/` 資料夾
- 型別定義放在 `types/` 資料夾

## 測試規範
- 每個組件都需要有對應的測試檔案
- 使用 Jest 和 React Testing Library
- 測試檔案命名為 `*.test.tsx`

## 注意事項
- 避免使用 `any` 型別
- 優先使用函數式組件和 Hooks
- 確保所有組件都有適當的 TypeScript 型別
```

### 在 Chat 中引用規則
```
@workspace 根據專案規則創建一個新的 React 組件
@workspace 檢查這段代碼是否符合專案規範
```

## 7. 實用快捷鍵總覽

| 功能 | Windows/Linux | macOS |
|------|---------------|-------|
| 打開 Chat | `Ctrl+Shift+I` | `Cmd+Shift+I` |
| 內聯編輯 | `Ctrl+I` | `Cmd+I` |
| 接受建議 | `Tab` | `Tab` |
| 拒絕建議 | `Esc` | `Esc` |
| 下一個建議 | `Alt+]` | `Option+]` |
| 上一個建議 | `Alt+[` | `Option+[` |

## 8. 最佳實踐建議

1. **提供清晰的上下文**: 使用 `#file:` 或 `@workspace` 來提供相關檔案
2. **具體的問題**: 避免過於籠統的問題，提供具體的需求
3. **分步驟處理**: 複雜任務分解成多個小步驟
4. **驗證建議**: 總是檢查和測試 Copilot 提供的代碼
5. **善用專案規則**: 建立 `.copilot-instructions.md` 來確保一致性

## 9. 常見問題排解

### Copilot 沒有回應
- 檢查網路連接
- 確認 GitHub Copilot 擴充套件已安裝並已登入
- 重新啟動 VS Code

### 建議不相關
- 提供更多上下文
- 使用更具體的描述
- 嘗試使用不同的 @ Agent

### 代碼品質不佳
- 建立專案規則檔案
- 提供更詳細的需求描述
- 使用代碼審查和測試來驗證建議