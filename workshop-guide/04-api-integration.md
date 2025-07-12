# 04 - API Integration

In this final section, you'll connect the frontend to the backend APIs and implement real-time features.

## Setting Up API Client

### 1. Create API Service

Create `frontend/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Issues API
  async getIssues(filters?: { status?: string; priority?: string; project?: string }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.project) params.append('project', filters.project);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/issues${query}`);
  }

  async getIssue(key: string) {
    return this.request(`/issues/${key}`);
  }

  async createIssue(issue: {
    issueType: string;
    project: string;
    summary: string;
    priority: string;
    storyPoints: number;
  }) {
    return this.request('/issues', {
      method: 'POST',
      body: JSON.stringify(issue),
    });
  }

  async updateIssue(key: string, updates: {
    summary?: string;
    status?: string;
    priority?: string;
    storyPoints?: number;
  }) {
    return this.request(`/issues/${key}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteIssue(key: string) {
    return this.request(`/issues/${key}`, {
      method: 'DELETE',
    });
  }

  async getIssueStats() {
    return this.request('/issues/stats');
  }

  // Projects API
  async getProjects() {
    return this.request('/projects');
  }

  async getChartData() {
    return this.request('/projects/chart-data');
  }

  // Users API
  async getUsers() {
    return this.request('/users');
  }

  async getActivity() {
    return this.request('/users/activity');
  }
}

export const apiClient = new ApiClient();
```

### 2. Create Custom Hooks

Create `frontend/hooks/use-api.ts`:

```typescript
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export function useIssues(filters?: { status?: string; priority?: string }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getIssues(filters);
      setIssues(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [filters?.status, filters?.priority]);

  return { issues, loading, error, refetch: fetchIssues };
}

export function useIssueStats() {
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    done: 0,
    highPriority: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getIssueStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useChartData() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getChartData();
        setChartData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  return { chartData, loading, error };
}

export function useActivity() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getActivity();
        setActivity(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch activity');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return { activity, loading, error };
}
```

## Updating the Dashboard Component

### 1. Replace Mock Data with API Calls

Update `frontend/components/jira-dashboard.tsx`:

```typescript
"use client"

import { useState } from "react"
import { useIssues, useIssueStats, useChartData, useActivity } from "@/hooks/use-api"
// ... other imports

export default function JiraDashboard() {
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")

  // Replace mock data with API calls
  const { issues, loading: issuesLoading, error: issuesError, refetch } = useIssues({
    status: statusFilter,
    priority: priorityFilter,
  })
  const { stats, loading: statsLoading } = useIssueStats()
  const { chartData, loading: chartLoading } = useChartData()
  const { activity, loading: activityLoading } = useActivity()

  // Loading state
  if (issuesLoading || statsLoading || chartLoading || activityLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (issuesError) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {issuesError}</p>
          <button 
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Rest of your component JSX */}
      {/* Replace hardcoded data with the API data */}
      
      {/* Stats cards - use stats object */}
      <div className="text-2xl font-bold">{stats.total}</div>
      <div className="text-2xl font-bold">{stats.inProgress}</div>
      <div className="text-2xl font-bold">{stats.done}</div>
      <div className="text-2xl font-bold">{stats.highPriority}</div>

      {/* Chart - use chartData */}
      <BarChart data={chartData}>
        {/* ... */}
      </BarChart>

      {/* Activity feed - use activity */}
      {activity.map((item, index) => (
        <div key={item.id || index}>
          {/* ... */}
        </div>
      ))}

      {/* Issues table - use issues */}
      {issues.map((issue) => (
        <TableRow key={issue.key}>
          {/* ... */}
        </TableRow>
      ))}
    </div>
  )
}
```

### 2. Add Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Implementing Real-time Features

### 1. Add Issue Creation Dialog

Create `frontend/components/create-issue-dialog.tsx`:

```typescript
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import { apiClient } from "@/lib/api"

interface CreateIssueDialogProps {
  onIssueCreated: () => void
}

export function CreateIssueDialog({ onIssueCreated }: CreateIssueDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    issueType: "Story",
    project: "Project Phoenix",
    summary: "",
    priority: "Medium",
    storyPoints: 1,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await apiClient.createIssue(formData)
      setOpen(false)
      setFormData({
        issueType: "Story",
        project: "Project Phoenix",
        summary: "",
        priority: "Medium",
        storyPoints: 1,
      })
      onIssueCreated()
    } catch (error) {
      console.error('Failed to create issue:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-10 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create Issue</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="issueType">Issue Type</Label>
            <Select 
              value={formData.issueType} 
              onValueChange={(value) => setFormData({ ...formData, issueType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Story">Story</SelectItem>
                <SelectItem value="Bug">Bug</SelectItem>
                <SelectItem value="Task">Task</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Input
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Enter issue summary..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lowest">Lowest</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Highest">Highest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storyPoints">Story Points</Label>
            <Input
              id="storyPoints"
              type="number"
              min="1"
              max="21"
              value={formData.storyPoints}
              onChange={(e) => setFormData({ ...formData, storyPoints: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Issue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

### 2. Add Status Update Functionality

Update the action menu in the issues table:

```typescript
// In the dashboard component, add an update function
const handleStatusUpdate = async (issueKey: string, newStatus: string) => {
  try {
    await apiClient.updateIssue(issueKey, { status: newStatus })
    refetch() // Refresh the issues list
  } catch (error) {
    console.error('Failed to update issue:', error)
  }
}

// In the dropdown menu for each issue:
<DropdownMenuContent align="end">
  <DropdownMenuLabel>Actions</DropdownMenuLabel>
  <DropdownMenuItem>View Details</DropdownMenuItem>
  <DropdownMenuItem>Edit</DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem onClick={() => handleStatusUpdate(issue.key, "In Progress")}>
    Move to In Progress
  </DropdownMenuItem>
  <DropdownMenuItem onClick={() => handleStatusUpdate(issue.key, "Done")}>
    Mark as Done
  </DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
</DropdownMenuContent>
```

## Testing the Integration

### 1. Start Both Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Test Features

1. **View Issues**: Visit http://localhost:3000 and verify issues load from API
2. **Filter Issues**: Test status and priority filters
3. **Create Issue**: Use the "Create Issue" button to add new issues
4. **Update Status**: Use the action menu to change issue status
5. **Real-time Updates**: Create/update issues and see changes immediately

### 3. Monitor API Calls

Open browser developer tools → Network tab to see API requests:
- GET `/api/issues` - Loading issues
- GET `/api/issues/stats` - Loading statistics
- POST `/api/issues` - Creating new issues
- PUT `/api/issues/:key` - Updating issues

## Advanced Features (Optional)

### 1. Add Search Functionality

```typescript
// Add to the dashboard component
const [searchTerm, setSearchTerm] = useState("")

// Filter issues by search term
const filteredIssues = issues.filter(issue =>
  issue.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
  issue.key.toLowerCase().includes(searchTerm.toLowerCase())
)

// Update the search input
<Input 
  type="search" 
  placeholder="Search issues..." 
  className="pl-8"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
```

### 2. Add Optimistic Updates

```typescript
const handleQuickStatusUpdate = async (issueKey: string, newStatus: string) => {
  // Optimistically update the UI
  setIssues(prev => prev.map(issue => 
    issue.key === issueKey 
      ? { ...issue, status: newStatus, updated: new Date().toISOString().split('T')[0] }
      : issue
  ))

  try {
    await apiClient.updateIssue(issueKey, { status: newStatus })
  } catch (error) {
    // Revert on error
    console.error('Failed to update issue:', error)
    refetch()
  }
}
```

### 3. Add Auto-refresh

```typescript
// Add to the dashboard component
useEffect(() => {
  const interval = setInterval(() => {
    refetch()
  }, 30000) // Refresh every 30 seconds

  return () => clearInterval(interval)
}, [refetch])
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend has `cors()` middleware enabled
   - Check that frontend is calling the correct API URL

2. **404 Errors**
   - Verify backend routes are properly set up
   - Check API endpoint URLs in frontend

3. **Data Not Updating**
   - Make sure to call `refetch()` after mutations
   - Check that backend is saving data correctly

4. **Environment Variables**
   - Restart frontend after changing `.env.local`
   - Ensure `NEXT_PUBLIC_` prefix for client-side variables

## Congratulations!

You've successfully built a full-stack Jira dashboard with:
- ✅ Next.js frontend with v0.dev generated components
- ✅ Express.js backend with RESTful APIs
- ✅ Real-time data fetching and updates
- ✅ Create, read, update operations
- ✅ Filtering and search functionality
- ✅ Error handling and loading states

The application demonstrates modern full-stack development practices using AI tools for rapid prototyping!