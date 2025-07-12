# Mock Data

This directory contains mock data files for the Jira Dashboard Workshop.

## Files

- `issues.json` - Sample Jira issues with various types, statuses, and priorities
- `users.json` - User profiles and project assignments
- `projects.json` - Project information and metadata
- `chart-data.json` - Data for dashboard charts and statistics
- `activity.json` - Recent activity feed data

## Usage

These JSON files can be used by both frontend and backend to provide consistent mock data during development and testing.

### Frontend Usage
```typescript
import issues from '../mock-data/issues.json';
import users from '../mock-data/users.json';
```

### Backend Usage
```javascript
const issues = require('../mock-data/issues.json');
const users = require('../mock-data/users.json');
```

## Data Structure

### Issues
Each issue contains:
- `key`: Unique identifier (e.g., "PROJ-123")
- `issueType`: "Story", "Bug", or "Task"
- `project`: Project name
- `summary`: Brief description
- `status`: "To Do", "In Progress", or "Done"
- `priority`: "Lowest", "Low", "Medium", "High", "Highest"
- `storyPoints`: Estimation points
- Timestamps for created, updated, resolved dates

### Users
Each user contains:
- `id`: Unique identifier
- `name`: Full name
- `email`: Email address
- `role`: Job title/role
- `projects`: Array of assigned projects

### Projects
Each project contains:
- `key`: Project key/prefix
- `name`: Full project name
- `description`: Project description
- `lead`: User ID of project lead
- `status`: Project status
- `members`: Array of user IDs