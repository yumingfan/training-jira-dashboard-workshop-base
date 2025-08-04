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
    data: List[Dict[str, Any]]  # 改為接受動態欄位的字典列表
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


# Sprint Progress Models
class SprintStatusCount(BaseModel):
    status: str
    count: int
    percentage: float


class SprintBugInfo(BaseModel):
    total_bugs: int
    bugs_by_severity: Dict[str, int]
    bugs_by_status: List[SprintStatusCount]


class SprintProgress(BaseModel):
    sprint_name: str
    total_stories: int
    completed_stories: int
    completion_percentage: float
    total_story_points: float
    completed_story_points: float
    story_points_completion_percentage: float
    remaining_work_days: Optional[int]
    sprint_end_date: Optional[datetime]
    status_breakdown: List[SprintStatusCount]
    bug_info: SprintBugInfo
    last_updated: datetime


class SprintProgressResponse(BaseModel):
    success: bool
    data: SprintProgress
    message: str