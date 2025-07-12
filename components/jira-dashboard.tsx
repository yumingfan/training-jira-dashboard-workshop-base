"use client"

import { useState, useMemo } from "react"
import {
  ChevronDown,
  Search,
  PlusCircle,
  ListFilter,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  FileText,
  Star,
  Bug,
} from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartContainer } from "@/components/ui/chart"

const issueData = [
  {
    key: "PROJ-123",
    issueType: "Story",
    project: "Project Phoenix",
    summary: "Implement user authentication",
    parent: "PROJ-100",
    status: "In Progress",
    sprint: "Sprint 1",
    dueDate: "2025-07-20",
    priority: "High",
    storyPoints: 8,
    created: "2025-06-01",
    updated: "2025-07-10",
    resolved: null,
  },
  {
    key: "PROJ-124",
    issueType: "Bug",
    project: "Project Phoenix",
    summary: "Fix login button alignment issue",
    parent: "PROJ-123",
    status: "To Do",
    sprint: "Sprint 2",
    dueDate: "2025-07-25",
    priority: "Highest",
    storyPoints: 3,
    created: "2025-07-05",
    updated: "2025-07-11",
    resolved: null,
  },
  {
    key: "PROJ-125",
    issueType: "Task",
    project: "Project Phoenix",
    summary: "Set up staging environment",
    parent: "PROJ-101",
    status: "Done",
    sprint: "Sprint 1",
    dueDate: "2025-07-15",
    priority: "Medium",
    storyPoints: 5,
    created: "2025-06-10",
    updated: "2025-07-08",
    resolved: "2025-07-08",
  },
  {
    key: "PROJ-126",
    issueType: "Story",
    project: "Project Apollo",
    summary: "Design new dashboard layout",
    parent: "PROJ-200",
    status: "In Progress",
    sprint: "Sprint A",
    dueDate: "2025-08-01",
    priority: "High",
    storyPoints: 13,
    created: "2025-07-01",
    updated: "2025-07-12",
    resolved: null,
  },
  {
    key: "PROJ-127",
    issueType: "Task",
    project: "Project Phoenix",
    summary: "API documentation for user service",
    parent: "PROJ-123",
    status: "To Do",
    sprint: "Sprint 2",
    dueDate: "2025-07-30",
    priority: "Medium",
    storyPoints: 5,
    created: "2025-07-11",
    updated: "2025-07-11",
    resolved: null,
  },
  {
    key: "PROJ-128",
    issueType: "Bug",
    project: "Project Apollo",
    summary: "Chart data not loading correctly",
    parent: "PROJ-126",
    status: "Done",
    sprint: "Sprint A",
    dueDate: "2025-07-10",
    priority: "Low",
    storyPoints: 2,
    created: "2025-07-08",
    updated: "2025-07-10",
    resolved: "2025-07-10",
  },
]

const chartData = [
  { name: "To Do", value: 25 },
  { name: "In Progress", value: 40 },
  { name: "In Review", value: 15 },
  { name: "Done", value: 20 },
]

const recentActivity = [
  {
    user: "Alex Smith",
    action: "commented on",
    issue: "PROJ-123",
    time: "2 hours ago",
  },
  {
    user: "Jane Doe",
    action: "transitioned",
    issue: "PROJ-125 from In Progress to Done",
    time: "4 hours ago",
  },
  {
    user: "John Appleseed",
    action: "created",
    issue: "PROJ-127",
    time: "1 day ago",
  },
  {
    user: "Alex Smith",
    action: "assigned",
    issue: "PROJ-124 to Jane Doe",
    time: "2 days ago",
  },
]

const priorityIcons = {
  Highest: <ArrowUp className="h-4 w-4 text-red-600" />,
  High: <ArrowUp className="h-4 w-4 text-orange-500" />,
  Medium: <ArrowRight className="h-4 w-4 text-yellow-500" />,
  Low: <ArrowDown className="h-4 w-4 text-green-500" />,
  Lowest: <ArrowDown className="h-4 w-4 text-blue-500" />,
}

const issueTypeIcons = {
  Story: <Star className="h-4 w-4 text-green-500" />,
  Bug: <Bug className="h-4 w-4 text-red-500" />,
  Task: <CheckCircle2 className="h-4 w-4 text-blue-500" />,
}

export default function JiraDashboard() {
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")

  const filteredIssues = useMemo(() => {
    return issueData.filter((issue) => {
      const statusMatch = statusFilter === "All" || issue.status === statusFilter
      const priorityMatch = priorityFilter === "All" || issue.priority === priorityFilter
      return statusMatch && priorityMatch
    })
  }, [statusFilter, priorityFilter])

  const stats = useMemo(() => {
    const total = issueData.length
    const inProgress = issueData.filter((i) => i.status === "In Progress").length
    const done = issueData.filter((i) => i.status === "Done").length
    const highPriority = issueData.filter((i) => i.priority === "High" || i.priority === "Highest").length
    return { total, inProgress, done, highPriority }
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-lg font-semibold">Jira Dashboard</h1>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                Project Phoenix
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Project Phoenix</DropdownMenuItem>
              <DropdownMenuItem>Project Apollo</DropdownMenuItem>
              <DropdownMenuItem>Project Titan</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search issues..." className="pl-8" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Done</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.done}</div>
              <p className="text-xs text-muted-foreground">+5 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <ArrowUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.highPriority}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Issue Status Distribution</CardTitle>
              <CardDescription>A breakdown of issues by their current status.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className="h-[300px] w-full"
                /* each dataKey you visualize must be listed here */
                config={{
                  value: {
                    label: "Issues",
                    /* the same colour used on the <Bar> */
                    color: "hsl(221.2 83.2% 53.3%)",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    {/* Tooltip MUST live inside a ChartContainer context */}
                    <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                    <Bar dataKey="value" fill="hsl(221.2 83.2% 53.3%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>A timeline of recent events in your projects.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {recentActivity.map((activity, index) => (
                <div className="flex items-start gap-4" key={index}>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`/placeholder.svg?height=36&width=36&query=avatar${index}`} />
                    <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.user} <span className="text-sm text-muted-foreground">{activity.action}</span>{" "}
                      <span className="font-semibold text-blue-600">{activity.issue}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Issues</CardTitle>
            <CardDescription>Manage and track all your project issues.</CardDescription>
            <div className="flex items-center gap-2 pt-4">
              <div className="flex items-center gap-2">
                <Button variant={statusFilter === "All" ? "default" : "outline"} onClick={() => setStatusFilter("All")}>
                  All
                </Button>
                <Button
                  variant={statusFilter === "To Do" ? "default" : "outline"}
                  onClick={() => setStatusFilter("To Do")}
                >
                  To Do
                </Button>
                <Button
                  variant={statusFilter === "In Progress" ? "default" : "outline"}
                  onClick={() => setStatusFilter("In Progress")}
                >
                  In Progress
                </Button>
                <Button
                  variant={statusFilter === "Done" ? "default" : "outline"}
                  onClick={() => setStatusFilter("Done")}
                >
                  Done
                </Button>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Priorities</SelectItem>
                    <SelectItem value="Highest">Highest</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Lowest">Lowest</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-10 gap-1 bg-transparent">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                </Button>
                <Button size="sm" className="h-10 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create Issue</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Project</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Priority</TableHead>
                  <TableHead className="hidden md:table-cell">Due Date</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <TableRow key={issue.key}>
                    <TableCell className="font-medium">{issue.key}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {issueTypeIcons[issue.issueType as keyof typeof issueTypeIcons]}
                        <span className="hidden lg:inline">{issue.issueType}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{issue.project}</TableCell>
                    <TableCell>{issue.summary}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          issue.status === "Done" ? "default" : issue.status === "In Progress" ? "secondary" : "outline"
                        }
                        className={
                          issue.status === "Done"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                            : issue.status === "In Progress"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                              : ""
                        }
                      >
                        {issue.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        {priorityIcons[issue.priority as keyof typeof priorityIcons]}
                        <span>{issue.priority}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{issue.dueDate}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
