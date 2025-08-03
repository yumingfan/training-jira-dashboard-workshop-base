'use client'

import React, { useState, useMemo } from 'react'
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

  // 從資料和 summary 中動態獲取所有欄位
  const allColumns = useMemo(() => {
    if (summary && summary.columns) {
      return summary.columns.map(col => ({
        key: col.name.replace(/ /g, '_').replace(/\./g, '_').toLowerCase(),
        label: col.name,
        type: col.type,
        sortable: true
      }))
    }
    
    // 如果沒有 summary，從第一筆資料推斷欄位
    if (data.length > 0) {
      return Object.keys(data[0]).map(key => ({
        key: key,
        label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        type: 'string',
        sortable: true
      }))
    }
    
    return []
  }, [data, summary])

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

  const formatCellValue = (value: any, columnType: string, columnKey: string) => {
    if (value === null || value === undefined || value === '') return '-'
    
    // 日期欄位
    if (columnType === 'date' || ['created', 'updated', 'resolved', 'due_date'].includes(columnKey)) {
      return formatDate(value)
    }
    
    // 數字欄位
    if (columnType === 'number' && typeof value === 'number') {
      return value % 1 === 0 ? value.toString() : value.toFixed(2)
    }
    
    return String(value)
  }

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return sortOrder === 'asc' ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || ''
    if (statusLower.includes('done') || statusLower.includes('resolved')) return 'bg-green-100 text-green-800'
    if (statusLower.includes('progress')) return 'bg-blue-100 text-blue-800'
    if (statusLower.includes('backlog')) return 'bg-gray-100 text-gray-800'
    if (statusLower.includes('todo') || statusLower.includes('to do')) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const priorityLower = priority?.toLowerCase() || ''
    if (priorityLower.includes('highest') || priorityLower.includes('high')) return 'bg-red-100 text-red-800'
    if (priorityLower.includes('medium')) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
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
    <div className="w-full space-y-4 h-full flex flex-col">
      {/* Header with summary info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Google Sheets Table View</h1>
          {summary && (
            <p className="text-sm text-gray-500">
              Sheet: {summary.sheet_name} | Total Rows: {summary.total_rows} | Showing {summary.columns.length} columns
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

      {/* Table container with fixed height and scroll */}
      <div className="flex-1 min-h-0 rounded-md border bg-white">
        <div className="h-full overflow-auto relative">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-20 bg-gray-50">
              <tr>
                {allColumns.map((column) => (
                  <th
                    key={column.key}
                    className={`${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    } border-b border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900 bg-gray-50`}
                    onClick={() => column.sortable && handleSort(column.label)}
                  >
                    <div className="flex items-center min-w-[120px] max-w-[200px]">
                      <span className="truncate">{column.label}</span>
                      {column.sortable && renderSortIcon(column.label)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={allColumns.length || 1} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="mt-2 text-gray-500">Loading data...</p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={allColumns.length || 1} className="text-center py-8 text-gray-500">
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr key={row.key || index} className="hover:bg-gray-50">
                    {allColumns.map((column) => {
                      const value = row[column.key]
                      
                      // 特殊處理 Status 欄位
                      if (column.key === 'status' || column.label === 'Status') {
                        return (
                          <td key={column.key} className="px-4 py-3 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
                              {value || '-'}
                            </span>
                          </td>
                        )
                      }
                      
                      // 特殊處理 Priority 欄位
                      if (column.key === 'priority' || column.label === 'Priority') {
                        return (
                          <td key={column.key} className="px-4 py-3 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(value)}`}>
                              {value || '-'}
                            </span>
                          </td>
                        )
                      }
                      
                      // 一般欄位 - 限制最大寬度並允許換行
                      return (
                        <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                          <div className="min-w-[120px] max-w-[200px] break-words">
                            {formatCellValue(value, column.type, column.key)}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-2 py-3 bg-white border-t">
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