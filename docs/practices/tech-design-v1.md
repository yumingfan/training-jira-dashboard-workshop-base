# 技術設計文件 v1

基於 User Story、Acceptance Criteria 和 Test Cases 的技術設計方案。

## 1. 系統架構概述

### 1.1 整體架構
```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                    │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────────┐   │
│  │  Dashboard  │ │   Charts    │ │  Activity Feed   │   │
│  │ Components  │ │ Components  │ │   Components     │   │
│  └──────┬──────┘ └──────┬──────┘ └────────┬─────────┘   │
│         └────────────────┴──────────────────┘            │
│                          │                                │
│                    ┌─────▼─────┐                         │
│                    │   State   │                         │
│                    │Management │                         │
│                    └─────┬─────┘                         │
└─────────────────────────┼───────────────────────────────┘
                          │
                    ┌─────▼─────┐
                    │  API Layer │
                    │ (Express)  │
                    └─────┬─────┘
                          │
              ┌───────────┴───────────┐
              │                       │
        ┌─────▼─────┐          ┌─────▼─────┐
        │   Data    │          │  Google   │
        │  Service  │          │  Sheets   │
        │   Layer   │          │    API    │
        └─────┬─────┘          └─────┬─────┘
              │                      │
        ┌─────▼─────┐          ┌─────▼─────┐
        │   JSON    │          │   Google  │
        │   Files   │          │   Sheets  │
        └───────────┘          └───────────┘
```

### 1.2 技術棧
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Recharts
- **Backend**: Node.js, Express, TypeScript
- **Data Storage**: Google Sheets (primary), JSON files (cache)
- **API Communication**: RESTful APIs, 5分鐘快取策略

## 2. 前端架構設計

### 2.1 元件結構
```typescript
// 主要元件層級
components/
├── dashboard/
│   ├── SprintProgress.tsx        // ID-001: Sprint 進度監控
│   ├── BurndownChart.tsx         // ID-002: 自定義燃盡圖
│   ├── TeamMonitor.tsx           // ID-003: 團隊任務監控
│   ├── PersonalTasks.tsx         // ID-004: 個人任務追蹤
│   ├── StoryQuality.tsx          // ID-005: Story 品質監控
│   ├── BugStatistics.tsx         // ID-006: Bug 統計分析
│   ├── SubtaskView.tsx           // ID-007: Subtask 完整性
│   └── BlockedItems.tsx          // ID-008: 卡住項目分析
├── shared/
│   ├── filters/
│   ├── charts/
│   └── ui/
└── layouts/
```

### 2.2 狀態管理設計
```typescript
// 使用 Context API + useReducer 模式
interface DashboardState {
  sprint: {
    current: SprintData;
    progress: number;
    bugs: BugStatistics;
  };
  team: {
    members: TeamMember[];
    tasks: TaskAssignment[];
  };
  filters: {
    status: string[];
    assignee: string[];
    priority: string[];
    dateRange: DateRange;
  };
  settings: {
    customStatuses: StatusMapping;
    refreshInterval: number;
  };
}

// Actions
type DashboardAction = 
  | { type: 'SET_SPRINT_DATA'; payload: SprintData }
  | { type: 'UPDATE_FILTERS'; payload: Partial<Filters> }
  | { type: 'SET_CUSTOM_STATUS'; payload: StatusMapping }
  | { type: 'REFRESH_DATA' };
```

### 2.3 Hooks 設計
```typescript
// Custom hooks for data fetching and state management
export const useSprintProgress = () => {
  const { data, error, mutate } = useSWR('/api/sprint/progress', fetcher, {
    refreshInterval: 300000, // 5 minutes
    revalidateOnFocus: true
  });
  
  return {
    progress: data?.progress || 0,
    bugs: data?.bugs || [],
    isLoading: !error && !data,
    isError: error,
    refresh: mutate
  };
};

export const useBurndownChart = (customStatus?: string) => {
  const endpoint = `/api/burndown${customStatus ? `?status=${customStatus}` : ''}`;
  return useSWR(endpoint, fetcher);
};

export const useTeamMonitor = () => {
  const { data } = useSWR('/api/team/monitor', fetcher);
  
  const needsHelp = useMemo(() => {
    return data?.tasks.filter(task => 
      task.lastUpdate > HELP_THRESHOLD
    ) || [];
  }, [data]);
  
  return { tasks: data?.tasks || [], needsHelp };
};
```

## 3. 後端 API 設計

### 3.1 API 端點規劃
```typescript
// Sprint 相關端點
GET  /api/sprint/progress         // Sprint 整體進度和 Bug 統計
GET  /api/sprint/burndown         // 燃盡圖資料（支援自定義狀態）
GET  /api/sprint/bugs/trend       // Bug 趨勢分析

// Team 相關端點
GET  /api/team/monitor            // 團隊成員任務監控
GET  /api/team/member/:id         // 特定成員詳細資訊

// 個人任務端點
GET  /api/tasks/personal          // 個人任務列表和更新時間
GET  /api/tasks/blocked           // 卡住的任務分析

// Story 相關端點
GET  /api/stories/quality         // Story 測試狀況和 Bug
GET  /api/stories/:id/subtasks    // Story 的 Subtask 清單
```

### 3.2 資料模型設計
```typescript
// 核心資料模型
interface Issue {
  id: string;
  key: string;
  type: 'Story' | 'Bug' | 'Task' | 'Sub-task';
  status: string;
  assignee: string;
  priority: string;
  created: Date;
  updated: Date;
  lastStatusChange: Date;
  storyPoints: number;
  parentId?: string;
  labels: string[];
  customFields: {
    testCoverage?: number;
    blockedReason?: string;
    readyToRelease?: boolean;
  };
}

interface SprintData {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  issues: Issue[];
  totalPoints: number;
  completedPoints: number;
  customStatusMappings: Record<string, string[]>;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  assignedTasks: string[];
  workload: number;
  lastActive: Date;
}
```

### 3.3 資料處理邏輯
```typescript
// Sprint 進度計算
export const calculateSprintProgress = (sprint: SprintData) => {
  const totalWork = sprint.issues.reduce((sum, issue) => 
    sum + (issue.storyPoints || 1), 0
  );
  
  const completedWork = sprint.issues
    .filter(issue => isCompleted(issue, sprint.customStatusMappings))
    .reduce((sum, issue) => sum + (issue.storyPoints || 1), 0);
  
  const bugs = sprint.issues.filter(issue => issue.type === 'Bug');
  const bugsByFeature = groupBy(bugs, bug => 
    findParentFeature(bug, sprint.issues)
  );
  
  return {
    progress: (completedWork / totalWork) * 100,
    totalWork,
    completedWork,
    remainingDays: differenceInDays(sprint.endDate, new Date()),
    bugs: {
      total: bugs.length,
      byFeature: bugsByFeature,
      bySeverity: groupBy(bugs, 'priority')
    }
  };
};

// 任務更新時間分析
export const analyzeTaskUpdates = (tasks: Issue[]) => {
  const now = new Date();
  
  return tasks.map(task => {
    const daysSinceUpdate = differenceInDays(now, task.updated);
    const isBlocked = daysSinceUpdate > 3;
    const blockReason = task.customFields.blockedReason || 
      (daysSinceUpdate > 7 ? '長時間未更新' : '可能需要協助');
    
    return {
      ...task,
      daysSinceUpdate,
      isBlocked,
      blockReason,
      updateStatus: getUpdateStatus(daysSinceUpdate)
    };
  });
};
```

## 4. 資料整合方案

### 4.1 Google Sheets 整合
```typescript
// Google Sheets 資料同步服務
export class GoogleSheetsService {
  private sheets: sheets_v4.Sheets;
  private cache: NodeCache;
  
  constructor() {
    this.sheets = google.sheets({ version: 'v4', auth });
    this.cache = new NodeCache({ stdTTL: 300 }); // 5分鐘快取
  }
  
  async getIssues(): Promise<Issue[]> {
    const cached = this.cache.get<Issue[]>('issues');
    if (cached) return cached;
    
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Issues!A:W',
    });
    
    const issues = this.transformToIssues(response.data.values);
    this.cache.set('issues', issues);
    
    return issues;
  }
  
  private transformToIssues(rows: any[][]): Issue[] {
    const headers = rows[0];
    return rows.slice(1).map(row => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return this.mapToIssue(obj);
    });
  }
}
```

### 4.2 快取策略
```typescript
// 多層快取架構
class CacheManager {
  private memoryCache: NodeCache;
  private fileCache: FileCache;
  
  async get<T>(key: string): Promise<T | null> {
    // 1. 檢查記憶體快取
    const memoryResult = this.memoryCache.get<T>(key);
    if (memoryResult) return memoryResult;
    
    // 2. 檢查檔案快取
    const fileResult = await this.fileCache.get<T>(key);
    if (fileResult) {
      this.memoryCache.set(key, fileResult);
      return fileResult;
    }
    
    return null;
  }
  
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    // 同時更新兩層快取
    this.memoryCache.set(key, value, ttl);
    await this.fileCache.set(key, value);
  }
}
```

## 5. 效能優化設計

### 5.1 前端優化
```typescript
// 虛擬滾動實作
const VirtualizedTaskList = ({ tasks }: { tasks: Task[] }) => {
  const rowVirtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });
  
  return (
    <div ref={parentRef} className="h-full overflow-auto">
      <div style={{ height: rowVirtualizer.getTotalSize() }}>
        {rowVirtualizer.getVirtualItems().map(virtualRow => (
          <TaskRow
            key={tasks[virtualRow.index].id}
            task={tasks[virtualRow.index]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// 資料預載策略
const usePrefetch = () => {
  const router = useRouter();
  
  useEffect(() => {
    // 預載常用資料
    prefetch('/api/sprint/progress');
    prefetch('/api/team/monitor');
    
    // 基於使用者行為預測預載
    const handleMouseEnter = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a');
      if (link?.href) {
        const path = new URL(link.href).pathname;
        prefetch(path);
      }
    };
    
    document.addEventListener('mouseenter', handleMouseEnter, true);
    return () => document.removeEventListener('mouseenter', handleMouseEnter, true);
  }, []);
};
```

### 5.2 後端優化
```typescript
// 查詢優化
export class OptimizedDataService {
  // 批次查詢減少 API 呼叫
  async getBatchIssues(ids: string[]): Promise<Issue[]> {
    const chunks = chunk(ids, 50); // 每批次50個
    const results = await Promise.all(
      chunks.map(chunk => this.getIssuesByIds(chunk))
    );
    return results.flat();
  }
  
  // 平行處理提升效能
  async getSprintDashboardData(sprintId: string) {
    const [sprint, issues, members] = await Promise.all([
      this.getSprint(sprintId),
      this.getSprintIssues(sprintId),
      this.getTeamMembers()
    ]);
    
    // 平行計算各項統計
    const [progress, burndown, bugTrend] = await Promise.all([
      this.calculateProgress(issues),
      this.generateBurndown(issues, sprint),
      this.analyzeBugTrend(issues)
    ]);
    
    return { sprint, progress, burndown, bugTrend };
  }
}
```

## 6. 安全性設計

### 6.1 API 安全
```typescript
// Rate limiting
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分鐘
  max: 100, // 限制 100 個請求
  message: 'Too many requests',
  standardHeaders: true,
  legacyHeaders: false,
});

// Input validation
const validateSprintId = [
  param('id').isUUID().withMessage('Invalid sprint ID'),
  handleValidationErrors
];

// CORS 設定
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

### 6.2 資料存取控制
```typescript
// 資料過濾（暫時無認證系統）
export const filterSensitiveData = (data: any) => {
  // 移除敏感欄位
  const { email, phone, ...safeData } = data;
  return safeData;
};

// 未來可擴充的權限檢查
export const checkPermission = async (
  userId: string, 
  resource: string, 
  action: string
): Promise<boolean> => {
  // 目前回傳 true，未來實作權限系統
  return true;
};
```

## 7. 錯誤處理設計

### 7.1 前端錯誤處理
```typescript
// 全域錯誤邊界
export class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Dashboard error:', error, errorInfo);
    // 發送錯誤到監控服務
    logErrorToService(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// API 錯誤處理
export const apiErrorHandler = (error: any) => {
  if (error.response) {
    // 服務器回應錯誤
    switch (error.response.status) {
      case 404:
        toast.error('資料不存在');
        break;
      case 500:
        toast.error('服務器錯誤，請稍後再試');
        break;
      default:
        toast.error(error.response.data.message || '發生錯誤');
    }
  } else if (error.request) {
    // 網路錯誤
    toast.error('網路連線失敗');
  } else {
    // 其他錯誤
    toast.error('發生未知錯誤');
  }
};
```

### 7.2 後端錯誤處理
```typescript
// 統一錯誤處理中介軟體
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  };
  
  // 記錄錯誤
  logger.error(error);
  
  // 開發環境回傳詳細錯誤
  if (process.env.NODE_ENV === 'development') {
    error['stack'] = err.stack;
  }
  
  res.status(error.status).json({ error });
};

// 非同步錯誤包裝
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

## 8. 測試策略

### 8.1 測試架構
```typescript
// 前端測試設定
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

// 後端測試設定
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/'],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
  },
});
```

### 8.2 測試範例
```typescript
// 元件測試
describe('SprintProgress', () => {
  it('should display correct progress percentage', () => {
    const mockData = {
      progress: 75,
      totalWork: 100,
      completedWork: 75,
    };
    
    render(<SprintProgress data={mockData} />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });
  
  it('should show bug statistics', () => {
    const mockData = {
      bugs: {
        total: 10,
        critical: 2,
        high: 3,
        medium: 5,
      },
    };
    
    render(<SprintProgress data={mockData} />);
    
    expect(screen.getByText('10 Bugs')).toBeInTheDocument();
    expect(screen.getByText('2 Critical')).toBeInTheDocument();
  });
});

// API 測試
describe('GET /api/sprint/progress', () => {
  it('should return sprint progress data', async () => {
    const response = await request(app)
      .get('/api/sprint/progress')
      .expect(200);
    
    expect(response.body).toHaveProperty('progress');
    expect(response.body.progress).toBeGreaterThanOrEqual(0);
    expect(response.body.progress).toBeLessThanOrEqual(100);
  });
  
  it('should handle missing sprint gracefully', async () => {
    const response = await request(app)
      .get('/api/sprint/progress?id=invalid')
      .expect(404);
    
    expect(response.body.error.message).toBe('Sprint not found');
  });
});
```

## 9. 部署架構

### 9.1 容器化設定
```dockerfile
# Frontend Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]

# Backend Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

EXPOSE 3001
CMD ["node", "dist/server.js"]
```

### 9.2 部署流程
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001
    depends_on:
      - backend
      
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - GOOGLE_SHEETS_ID=${GOOGLE_SHEETS_ID}
      - GOOGLE_SERVICE_ACCOUNT=${GOOGLE_SERVICE_ACCOUNT}
    volumes:
      - ./data:/app/data
      
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
```

## 10. 監控與維運

### 10.1 應用程式監控
```typescript
// 效能監控
export const performanceMonitor = {
  trackApiCall: (endpoint: string, duration: number) => {
    metrics.histogram('api_call_duration', duration, {
      endpoint,
      method: 'GET',
    });
  },
  
  trackError: (error: Error, context: any) => {
    metrics.increment('errors', 1, {
      type: error.name,
      endpoint: context.endpoint,
    });
  },
  
  trackUserAction: (action: string, metadata: any) => {
    analytics.track({
      event: action,
      properties: metadata,
      timestamp: new Date(),
    });
  },
};

// 健康檢查端點
app.get('/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    responseTime: process.hrtime(),
    message: 'OK',
    timestamp: Date.now(),
    checks: {
      database: checkDatabase(),
      cache: checkCache(),
      googleSheets: checkGoogleSheets(),
    },
  };
  
  const allHealthy = Object.values(health.checks).every(check => check.healthy);
  res.status(allHealthy ? 200 : 503).json(health);
});
```

### 10.2 日誌管理
```typescript
// 結構化日誌
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'jira-dashboard' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// 請求日誌
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));
```

## 11. 可擴展性考量

### 11.1 未來功能擴展
1. **使用者認證系統**
   - OAuth 2.0 整合
   - 角色權限管理
   - Session 管理

2. **即時更新功能**
   - WebSocket 整合
   - Server-Sent Events
   - 即時通知系統

3. **進階分析功能**
   - AI 預測分析
   - 自動化建議
   - 趨勢預測

### 11.2 架構擴展點
```typescript
// Plugin 系統設計
interface DashboardPlugin {
  id: string;
  name: string;
  version: string;
  widgets: Widget[];
  hooks: {
    onDataUpdate?: (data: any) => void;
    onFilterChange?: (filters: any) => void;
    onInit?: () => void;
  };
}

// Widget 系統
interface Widget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'custom';
  render: (props: any) => ReactElement;
  dataSource: string;
  refreshInterval?: number;
}

// 擴展點註冊
export const pluginManager = {
  plugins: new Map<string, DashboardPlugin>(),
  
  register(plugin: DashboardPlugin) {
    this.plugins.set(plugin.id, plugin);
    plugin.hooks.onInit?.();
  },
  
  getWidgets(): Widget[] {
    return Array.from(this.plugins.values())
      .flatMap(plugin => plugin.widgets);
  },
};
```

## 12. 技術債務管理

### 12.1 已知限制
1. **無使用者認證**: 所有資料公開可見
2. **唯讀操作**: 無法寫入 Google Sheets
3. **5分鐘延遲**: 資料更新有延遲
4. **rawStatusTime 未整合**: 狀態變更歷史受限

### 12.2 改進計畫
```typescript
// 技術債務追蹤
const techDebt = [
  {
    id: 'TD-001',
    description: '實作使用者認證系統',
    impact: 'high',
    effort: 'large',
    priority: 1,
  },
  {
    id: 'TD-002',
    description: '整合 rawStatusTime 表',
    impact: 'medium',
    effort: 'medium',
    priority: 2,
  },
  {
    id: 'TD-003',
    description: '實作即時資料更新',
    impact: 'medium',
    effort: 'large',
    priority: 3,
  },
];
```

## 13. 文件與知識管理

### 13.1 API 文件
使用 OpenAPI 3.0 規範自動生成 API 文件：
```yaml
openapi: 3.0.0
info:
  title: Jira Dashboard API
  version: 1.0.0
paths:
  /api/sprint/progress:
    get:
      summary: Get sprint progress
      parameters:
        - name: sprintId
          in: query
          schema:
            type: string
      responses:
        '200':
          description: Sprint progress data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SprintProgress'
```

### 13.2 開發者指南
1. **Coding Standards**: 遵循 Airbnb TypeScript Style Guide
2. **Git Workflow**: Feature branch + PR review
3. **Testing Requirements**: 最低 80% 覆蓋率
4. **Documentation**: 所有公開 API 必須有文件

## 14. 總結

此技術設計文件提供了完整的系統架構和實作指引，涵蓋：

✅ **完整的系統架構**: 前後端分離，模組化設計
✅ **詳細的技術實作**: 包含程式碼範例和最佳實踐
✅ **效能優化策略**: 快取、虛擬滾動、批次處理
✅ **安全性考量**: 輸入驗證、速率限制、錯誤處理
✅ **可擴展性設計**: Plugin 系統、未來功能規劃
✅ **完整的測試策略**: 單元測試、整合測試、E2E 測試
✅ **部署和維運方案**: 容器化、監控、日誌管理

系統設計充分考慮了現有限制和未來擴展需求，為開發團隊提供清晰的實作指引。