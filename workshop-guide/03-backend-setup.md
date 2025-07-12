# 03 - Backend Setup

In this section, you'll create a Node.js/Express backend API to serve data to the Jira dashboard frontend.

## Creating the Backend Structure

### 1. Initialize the Backend

```bash
# From the root directory
cd backend

# Initialize package.json
npm init -y

# Install dependencies
npm install express cors dotenv
npm install -D nodemon typescript @types/node @types/express ts-node

# Create tsconfig.json
npx tsc --init
```

### 2. Create Basic File Structure

```bash
# Create directories
mkdir src src/routes src/models src/controllers src/middleware

# Create main files
touch src/app.ts src/server.ts
touch src/routes/issues.ts src/routes/projects.ts src/routes/users.ts
touch src/controllers/issueController.ts
touch src/models/Issue.ts
```

### 3. Configure package.json Scripts

Edit `backend/package.json`:

```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "echo 'Linting backend...'"
  }
}
```

### 4. Configure TypeScript

Edit `backend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Building the Express Server

### 1. Create the Main App

Create `backend/src/app.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import issueRoutes from './routes/issues';
import projectRoutes from './routes/projects';
import userRoutes from './routes/users';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/issues', issueRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
```

### 2. Create the Server Entry Point

Create `backend/src/server.ts`:

```typescript
import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
```

## Creating Data Models

### 1. Define Issue Model

Create `backend/src/models/Issue.ts`:

```typescript
export interface Issue {
  key: string;
  issueType: 'Story' | 'Bug' | 'Task';
  project: string;
  summary: string;
  parent?: string;
  status: 'To Do' | 'In Progress' | 'Done';
  sprint: string;
  dueDate: string;
  priority: 'Lowest' | 'Low' | 'Medium' | 'High' | 'Highest';
  storyPoints: number;
  created: string;
  updated: string;
  resolved: string | null;
}

export interface CreateIssueRequest {
  issueType: Issue['issueType'];
  project: string;
  summary: string;
  priority: Issue['priority'];
  storyPoints: number;
}

export interface UpdateIssueRequest {
  summary?: string;
  status?: Issue['status'];
  priority?: Issue['priority'];
  storyPoints?: number;
}
```

### 2. Create Data Service

Create `backend/src/models/DataService.ts`:

```typescript
import { Issue } from './Issue';
import * as fs from 'fs';
import * as path from 'path';

class DataService {
  private mockDataPath = path.join(__dirname, '../../mock-data');

  loadIssues(): Issue[] {
    try {
      const issuesPath = path.join(this.mockDataPath, 'issues.json');
      const data = fs.readFileSync(issuesPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading issues:', error);
      return [];
    }
  }

  saveIssues(issues: Issue[]): void {
    try {
      const issuesPath = path.join(this.mockDataPath, 'issues.json');
      fs.writeFileSync(issuesPath, JSON.stringify(issues, null, 2));
    } catch (error) {
      console.error('Error saving issues:', error);
    }
  }

  loadUsers() {
    try {
      const usersPath = path.join(this.mockDataPath, 'users.json');
      const data = fs.readFileSync(usersPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  loadProjects() {
    try {
      const projectsPath = path.join(this.mockDataPath, 'projects.json');
      const data = fs.readFileSync(projectsPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  }

  loadChartData() {
    try {
      const chartPath = path.join(this.mockDataPath, 'chart-data.json');
      const data = fs.readFileSync(chartPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading chart data:', error);
      return [];
    }
  }

  loadActivity() {
    try {
      const activityPath = path.join(this.mockDataPath, 'activity.json');
      const data = fs.readFileSync(activityPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading activity:', error);
      return [];
    }
  }
}

export default new DataService();
```

## Creating Controllers

### 1. Issue Controller

Create `backend/src/controllers/issueController.ts`:

```typescript
import { Request, Response } from 'express';
import { Issue, CreateIssueRequest, UpdateIssueRequest } from '../models/Issue';
import DataService from '../models/DataService';

export class IssueController {
  // GET /api/issues
  getAllIssues = (req: Request, res: Response) => {
    try {
      const issues = DataService.loadIssues();
      const { status, priority, project } = req.query;

      let filteredIssues = issues;

      if (status && status !== 'All') {
        filteredIssues = filteredIssues.filter(issue => issue.status === status);
      }

      if (priority && priority !== 'All') {
        filteredIssues = filteredIssues.filter(issue => issue.priority === priority);
      }

      if (project) {
        filteredIssues = filteredIssues.filter(issue => issue.project === project);
      }

      res.json(filteredIssues);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load issues' });
    }
  };

  // GET /api/issues/:key
  getIssueByKey = (req: Request, res: Response) => {
    try {
      const issues = DataService.loadIssues();
      const issue = issues.find(i => i.key === req.params.key);

      if (!issue) {
        return res.status(404).json({ error: 'Issue not found' });
      }

      res.json(issue);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load issue' });
    }
  };

  // POST /api/issues
  createIssue = (req: Request, res: Response) => {
    try {
      const issues = DataService.loadIssues();
      const newIssueData: CreateIssueRequest = req.body;

      // Generate new issue key
      const projectKey = newIssueData.project.split(' ')[1] || 'PROJ';
      const maxNum = Math.max(...issues.map(i => {
        const num = parseInt(i.key.split('-')[1]);
        return isNaN(num) ? 0 : num;
      }));
      
      const newIssue: Issue = {
        key: `${projectKey.toUpperCase()}-${maxNum + 1}`,
        issueType: newIssueData.issueType,
        project: newIssueData.project,
        summary: newIssueData.summary,
        status: 'To Do',
        sprint: 'Backlog',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: newIssueData.priority,
        storyPoints: newIssueData.storyPoints,
        created: new Date().toISOString().split('T')[0],
        updated: new Date().toISOString().split('T')[0],
        resolved: null
      };

      issues.push(newIssue);
      DataService.saveIssues(issues);

      res.status(201).json(newIssue);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create issue' });
    }
  };

  // PUT /api/issues/:key
  updateIssue = (req: Request, res: Response) => {
    try {
      const issues = DataService.loadIssues();
      const issueIndex = issues.findIndex(i => i.key === req.params.key);

      if (issueIndex === -1) {
        return res.status(404).json({ error: 'Issue not found' });
      }

      const updateData: UpdateIssueRequest = req.body;
      const updatedIssue = {
        ...issues[issueIndex],
        ...updateData,
        updated: new Date().toISOString().split('T')[0]
      };

      // Set resolved date if status changed to Done
      if (updateData.status === 'Done' && issues[issueIndex].status !== 'Done') {
        updatedIssue.resolved = new Date().toISOString().split('T')[0];
      }

      issues[issueIndex] = updatedIssue;
      DataService.saveIssues(issues);

      res.json(updatedIssue);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update issue' });
    }
  };

  // DELETE /api/issues/:key
  deleteIssue = (req: Request, res: Response) => {
    try {
      const issues = DataService.loadIssues();
      const issueIndex = issues.findIndex(i => i.key === req.params.key);

      if (issueIndex === -1) {
        return res.status(404).json({ error: 'Issue not found' });
      }

      issues.splice(issueIndex, 1);
      DataService.saveIssues(issues);

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete issue' });
    }
  };

  // GET /api/issues/stats
  getIssueStats = (req: Request, res: Response) => {
    try {
      const issues = DataService.loadIssues();
      
      const stats = {
        total: issues.length,
        inProgress: issues.filter(i => i.status === 'In Progress').length,
        done: issues.filter(i => i.status === 'Done').length,
        highPriority: issues.filter(i => ['High', 'Highest'].includes(i.priority)).length
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate stats' });
    }
  };
}

export default new IssueController();
```

## Creating Routes

### 1. Issues Routes

Create `backend/src/routes/issues.ts`:

```typescript
import { Router } from 'express';
import issueController from '../controllers/issueController';

const router = Router();

router.get('/', issueController.getAllIssues);
router.get('/stats', issueController.getIssueStats);
router.get('/:key', issueController.getIssueByKey);
router.post('/', issueController.createIssue);
router.put('/:key', issueController.updateIssue);
router.delete('/:key', issueController.deleteIssue);

export default router;
```

### 2. Projects Routes

Create `backend/src/routes/projects.ts`:

```typescript
import { Router } from 'express';
import DataService from '../models/DataService';

const router = Router();

router.get('/', (req, res) => {
  try {
    const projects = DataService.loadProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

router.get('/chart-data', (req, res) => {
  try {
    const chartData = DataService.loadChartData();
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load chart data' });
  }
});

export default router;
```

### 3. Users Routes

Create `backend/src/routes/users.ts`:

```typescript
import { Router } from 'express';
import DataService from '../models/DataService';

const router = Router();

router.get('/', (req, res) => {
  try {
    const users = DataService.loadUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load users' });
  }
});

router.get('/activity', (req, res) => {
  try {
    const activity = DataService.loadActivity();
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load activity' });
  }
});

export default router;
```

## Testing the Backend

### 1. Start the Backend Server

```bash
cd backend
npm run dev
```

The server should start on http://localhost:3001

### 2. Test API Endpoints

```bash
# Test health check
curl http://localhost:3001/api/health

# Get all issues
curl http://localhost:3001/api/issues

# Get issue stats
curl http://localhost:3001/api/issues/stats

# Get projects
curl http://localhost:3001/api/projects

# Get users
curl http://localhost:3001/api/users
```

### 3. Create Environment File

Create `backend/.env`:

```env
PORT=3001
NODE_ENV=development
```

## Next Steps

Your backend is now ready! In the next section, [04 - API Integration](./04-api-integration.md), you'll connect the frontend to use these APIs instead of mock data.