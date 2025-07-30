from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class ColumnInfo(BaseModel):
    name: str
    type: str


class TableSummary(BaseModel):
    sheet_id: str
    sheet_name: str
    total_rows: int
    total_columns: int
    columns: List[ColumnInfo]
    last_updated: datetime


class TableRow(BaseModel):
    key: str
    issue_type: str
    projects: str
    summary: str
    status: str
    priority: str
    created: Optional[datetime]
    updated: Optional[datetime]
    resolved: Optional[datetime]
    story_points: Optional[float]
    sprint: Optional[str]
    due_date: Optional[datetime]


class PaginationInfo(BaseModel):
    current_page: int
    page_size: int
    total_pages: int
    total_records: int
    has_next: bool
    has_prev: bool


class FilterInfo(BaseModel):
    applied: List[str]
    available: Dict[str, List[str]]


class TableDataResponse(BaseModel):
    data: List[TableRow]
    pagination: PaginationInfo
    filters: FilterInfo


class FilterOptions(BaseModel):
    status: List[str]
    priority: List[str]
    assignee: List[str]
    created_date_range: Dict[str, datetime]


class HealthCheckResponse(BaseModel):
    status: str
    google_sheets_connection: str
    timestamp: datetime


class APIInfoResponse(BaseModel):
    message: str
    version: str