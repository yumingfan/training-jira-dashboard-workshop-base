'use client'

import React, { useState } from 'react'
import { useGoogleSheets } from '@/hooks/use-google-sheets'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown, Search, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

export function GoogleSheetsTable() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [sortBy, setSortBy] = useState('Key')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')

  const {
    data,
    pagination,
    filters,
    summary,
    filterOptions,
    loading,
    error,
    refetch
  } = useGoogleSheets({
    page,
    pageSize,
    sortBy,
    sortOrder,
    search,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
  })

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm')
    } catch {
      return dateString
    }
  }

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return sortOrder === 'asc' ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={refetch}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Header with summary info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Google Sheets Table View</h1>
          {summary && (
            <p className="text-sm text-gray-500">
              Sheet: {summary.sheet_name} | Total Rows: {summary.total_rows} | Columns: {summary.total_columns}
            </p>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search all fields..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1) // Reset to first page on search
              }}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={statusFilter} onValueChange={(value) => {
          setStatusFilter(value)
          setPage(1)
        }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">All Status</SelectItem>
            {filterOptions?.status.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={(value) => {
          setPriorityFilter(value)
          setPage(1)
        }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">All Priority</SelectItem>
            {filterOptions?.priority.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('Key')}
              >
                <div className="flex items-center">
                  Key {renderSortIcon('Key')}
                </div>
              </TableHead>
              <TableHead>Issue Type</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('Summary')}
              >
                <div className="flex items-center">
                  Summary {renderSortIcon('Summary')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('Status')}
              >
                <div className="flex items-center">
                  Status {renderSortIcon('Status')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('Priority')}
              >
                <div className="flex items-center">
                  Priority {renderSortIcon('Priority')}
                </div>
              </TableHead>
              <TableHead>Story Points</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('Created')}
              >
                <div className="flex items-center">
                  Created {renderSortIcon('Created')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('Updated')}
              >
                <div className="flex items-center">
                  Updated {renderSortIcon('Updated')}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  <p className="mt-2 text-gray-500">Loading data...</p>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.key} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{row.key}</TableCell>
                  <TableCell>{row.issue_type}</TableCell>
                  <TableCell>{row.projects}</TableCell>
                  <TableCell className="max-w-xs truncate" title={row.summary}>
                    {row.summary}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${row.status === 'Done' ? 'bg-green-100 text-green-800' : 
                        row.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        row.status === 'Backlog' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${row.priority === 'Highest' || row.priority === 'High' ? 'bg-red-100 text-red-800' : 
                        row.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {row.priority}
                    </span>
                  </TableCell>
                  <TableCell>{row.story_points || '-'}</TableCell>
                  <TableCell className="text-sm">{formatDate(row.created)}</TableCell>
                  <TableCell className="text-sm">{formatDate(row.updated)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-700">
            Showing {((pagination.current_page - 1) * pagination.page_size) + 1} to{' '}
            {Math.min(pagination.current_page * pagination.page_size, pagination.total_records)} of{' '}
            {pagination.total_records} results
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(1)}
              disabled={!pagination.has_prev}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page - 1)}
              disabled={!pagination.has_prev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              <Input
                type="number"
                min={1}
                max={pagination.total_pages}
                value={page}
                onChange={(e) => {
                  const newPage = parseInt(e.target.value)
                  if (newPage >= 1 && newPage <= pagination.total_pages) {
                    setPage(newPage)
                  }
                }}
                className="w-16 text-center"
              />
              <span className="text-sm text-gray-700">/ {pagination.total_pages}</span>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page + 1)}
              disabled={!pagination.has_next}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(pagination.total_pages)}
              disabled={!pagination.has_next}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}