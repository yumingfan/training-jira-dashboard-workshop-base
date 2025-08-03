import { useState, useEffect, useCallback } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface TableColumn {
  name: string
  type: string
}

export interface TableSummary {
  sheet_id: string
  sheet_name: string
  total_rows: number
  total_columns: number
  columns: TableColumn[]
  last_updated: string
}

export interface TableRow {
  [key: string]: any  // 動態欄位，可以接受任何欄位名稱和值
}

export interface PaginationInfo {
  current_page: number
  page_size: number
  total_pages: number
  total_records: number
  has_next: boolean
  has_prev: boolean
}

export interface FilterInfo {
  applied: string[]
  available: {
    status: string[]
    priority: string[]
  }
}

export interface TableDataResponse {
  data: TableRow[]
  pagination: PaginationInfo
  filters: FilterInfo
}

export interface FilterOptions {
  status: string[]
  priority: string[]
  assignee: string[]
  created_date_range: {
    min: string
    max: string
  }
}

export interface UseGoogleSheetsParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
  status?: string
  priority?: string
}

export function useGoogleSheets(params: UseGoogleSheetsParams = {}) {
  const [data, setData] = useState<TableRow[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [filters, setFilters] = useState<FilterInfo | null>(null)
  const [summary, setSummary] = useState<TableSummary | null>(null)
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    page = 1,
    pageSize = 100,
    sortBy = 'Key',
    sortOrder = 'asc',
    search,
    status,
    priority
  } = params

  // Fetch table summary
  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/table/summary`)
      if (!response.ok) throw new Error('Failed to fetch table summary')
      const data = await response.json()
      setSummary(data)
    } catch (err) {
      console.error('Error fetching summary:', err)
    }
  }, [])

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/table/filters`)
      if (!response.ok) throw new Error('Failed to fetch filter options')
      const data = await response.json()
      setFilterOptions(data)
    } catch (err) {
      console.error('Error fetching filter options:', err)
    }
  }, [])

  // Fetch table data
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
      })

      if (search) queryParams.append('search', search)
      if (status) queryParams.append('status', status)
      if (priority) queryParams.append('priority', priority)

      const response = await fetch(`${API_BASE_URL}/table/data?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`)
      }

      const result: TableDataResponse = await response.json()
      setData(result.data)
      setPagination(result.pagination)
      setFilters(result.filters)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, sortBy, sortOrder, search, status, priority])

  // Initial load
  useEffect(() => {
    fetchSummary()
    fetchFilterOptions()
  }, [fetchSummary, fetchFilterOptions])

  // Fetch data when params change
  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = () => {
    fetchData()
  }

  return {
    data,
    pagination,
    filters,
    summary,
    filterOptions,
    loading,
    error,
    refetch
  }
}