# 02 - Frontend Setup

In this section, you'll explore the v0.dev generated frontend and learn how to customize the Jira dashboard interface.

## Understanding the v0.dev Generated Code

The frontend was created using v0.dev, an AI tool that generates React components from prompts. Let's examine what was generated:

### Key Components

1. **Main Dashboard** (`frontend/components/jira-dashboard.tsx`)
   - Central dashboard component with issue table, charts, and activity feed
   - Implements filtering, search, and responsive design
   - Uses shadcn/ui components for consistent styling

2. **UI Components** (`frontend/components/ui/`)
   - 50+ pre-built components from shadcn/ui
   - Includes tables, cards, buttons, forms, dialogs, and more
   - Fully customizable with Tailwind CSS

3. **App Structure** (`frontend/app/`)
   - Next.js 15 app router structure
   - Root layout with global styles
   - Main page importing the dashboard

### Technology Stack

- **Next.js 15** - React framework with app router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Lucide React** - Beautiful icons
- **Recharts** - Chart and data visualization

## Exploring the Dashboard Features

### 1. Start the Development Server

```bash
cd frontend
npm run dev
```

Visit http://localhost:3000 to see the dashboard.

### 2. Dashboard Sections

**Header**
- Project selector dropdown
- Search functionality
- User profile menu

**Statistics Cards**
- Total Issues, In Progress, Done, High Priority
- Real-time calculated from mock data

**Chart Section**
- Bar chart showing issue status distribution
- Recent activity timeline

**Issue Table**
- Sortable columns with issue details
- Filtering by status and priority
- Action menu for each issue

### 3. Interactive Features

Try these features:
- Filter issues by status (All, To Do, In Progress, Done)
- Filter by priority using the dropdown
- Notice responsive design on different screen sizes
- Hover effects and loading states

## Customizing the Interface

### 1. Modify Mock Data

Edit the mock data directly in `frontend/components/jira-dashboard.tsx`:

```typescript
// Find the issueData array around line 38
const issueData = [
  {
    key: "PROJ-129", // Add your own issue
    issueType: "Story",
    project: "Your Project",
    summary: "Your feature description",
    status: "In Progress",
    priority: "High",
    // ... other fields
  },
  // ... existing issues
]
```

### 2. Add New Status Types

```typescript
// Add new status in the filter buttons (around line 356)
<Button
  variant={statusFilter === "In Review" ? "default" : "outline"}
  onClick={() => setStatusFilter("In Review")}
>
  In Review
</Button>
```

### 3. Customize Styling

The project uses Tailwind CSS. You can customize:

```typescript
// Change card colors
<Card className="border-blue-200 bg-blue-50">

// Modify badge styles
<Badge className="bg-purple-100 text-purple-800">
  Custom Status
</Badge>

// Update table styling
<Table className="border-2 border-gray-200">
```

### 4. Add New Components

Create a new component in `frontend/components/`:

```typescript
// frontend/components/issue-details.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function IssueDetails({ issue }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{issue.key}: {issue.summary}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Status: {issue.status}</p>
        <p>Priority: {issue.priority}</p>
        <p>Story Points: {issue.storyPoints}</p>
      </CardContent>
    </Card>
  )
}
```

## Working with shadcn/ui

### Adding New Components

```bash
# Add new shadcn/ui components
npx shadcn@latest add dialog
npx shadcn@latest add calendar
npx shadcn@latest add form
```

### Component Configuration

Check `frontend/components.json` for shadcn/ui configuration:
- Style: "default"
- Base color: "neutral"
- CSS variables: enabled
- Icons: Lucide React

## TypeScript Integration

The project is fully typed. Key type locations:

```typescript
// Issue type definition (add to frontend/lib/types.ts if created)
interface Issue {
  key: string;
  issueType: 'Story' | 'Bug' | 'Task';
  project: string;
  summary: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Lowest' | 'Low' | 'Medium' | 'High' | 'Highest';
  storyPoints: number;
  created: string;
  updated: string;
  resolved: string | null;
}
```

## Exercises

### Exercise 1: Add New Issue Type
Add an "Epic" issue type with appropriate icon and styling.

### Exercise 2: Implement Search
Make the search input functional to filter issues by summary.

### Exercise 3: Add Issue Creation
Create a dialog form for adding new issues to the table.

### Exercise 4: Responsive Improvements
Enhance mobile responsiveness for the issue table.

## Troubleshooting

### Common Issues

1. **Styling not applying**
   ```bash
   # Rebuild Tailwind classes
   npm run dev
   ```

2. **Import errors**
   ```typescript
   // Check path aliases in tsconfig.json
   import { Button } from "@/components/ui/button"
   ```

3. **Type errors**
   ```typescript
   // Add proper TypeScript types
   const issue: Issue = { /* ... */ }
   ```

## Next Steps

Once you're comfortable with the frontend structure, proceed to [03 - Backend Setup](./03-backend-setup.md) to create the API backend.