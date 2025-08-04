import pandas as pd
import requests
from io import StringIO
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple, Any
import config
from models import TableRow, FilterOptions, SprintProgress, SprintStatusCount, SprintBugInfo


class GoogleSheetsService:
    def __init__(self):
        self.sheet_id = config.GOOGLE_SHEET_ID
        self.sheet_name = config.SHEET_NAME
        self.cache_duration = timedelta(seconds=config.CACHE_DURATION)
        self._cache = None
        self._cache_timestamp = None
        
    def _get_csv_url(self) -> str:
        return f"https://docs.google.com/spreadsheets/d/{self.sheet_id}/gviz/tq?tqx=out:csv&sheet={self.sheet_name}"
    
    def _fetch_data(self) -> pd.DataFrame:
        """Fetch data from Google Sheets and return as DataFrame"""
        try:
            response = requests.get(self._get_csv_url())
            response.raise_for_status()
            
            # Read CSV data
            df = pd.read_csv(StringIO(response.text))
            
            # 限制只讀取到 Column W (第 23 欄，index 22)
            # 取得所有欄位名稱
            all_columns = df.columns.tolist()
            # 只保留前 23 個欄位
            if len(all_columns) > 23:
                df = df.iloc[:, :23]
            
            # Ensure datetime columns are properly parsed
            if 'Created' in df.columns:
                df['Created'] = pd.to_datetime(df['Created'], errors='coerce')
            if 'Updated' in df.columns:
                df['Updated'] = pd.to_datetime(df['Updated'], errors='coerce')
            if 'Resolved' in df.columns:
                df['Resolved'] = pd.to_datetime(df['Resolved'], errors='coerce')
            if 'Due date' in df.columns:
                df['Due date'] = pd.to_datetime(df['Due date'], errors='coerce')
                
            return df
        except Exception as e:
            raise Exception(f"Failed to fetch data from Google Sheets: {str(e)}")
    
    def get_data(self, force_refresh: bool = False) -> pd.DataFrame:
        """Get data with caching support"""
        now = datetime.now()
        
        # Check if cache is valid
        if (not force_refresh and 
            self._cache is not None and 
            self._cache_timestamp is not None and 
            now - self._cache_timestamp < self.cache_duration):
            return self._cache.copy()
        
        # Fetch fresh data
        self._cache = self._fetch_data()
        self._cache_timestamp = now
        return self._cache.copy()
    
    def get_summary(self) -> Dict[str, Any]:
        """Get summary information about the sheet"""
        df = self.get_data()
        
        columns = []
        date_columns = ['Created', 'Updated', 'Resolved', 'Due date']
        numeric_columns = ['Story Points', 'BusinessPoints', 'T-Size', 'Confidence']
        
        for col in df.columns:
            if col in date_columns:
                col_type = "date"
            elif col in numeric_columns:
                col_type = "number"
            else:
                col_type = "string"
            columns.append({"name": col, "type": col_type})
        
        return {
            "sheet_id": self.sheet_id,
            "sheet_name": self.sheet_name,
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "columns": columns,
            "last_updated": datetime.now()
        }
    
    def apply_filters(self, df: pd.DataFrame, 
                     search: Optional[str] = None,
                     status: Optional[str] = None,
                     priority: Optional[str] = None) -> pd.DataFrame:
        """Apply search and filter criteria to DataFrame"""
        
        # Apply search across all text columns
        if search:
            text_columns = df.select_dtypes(include=['object']).columns
            mask = df[text_columns].apply(
                lambda x: x.astype(str).str.contains(search, case=False, na=False)
            ).any(axis=1)
            df = df[mask]
        
        # Apply status filter
        if status:
            df = df[df['Status'] == status]
        
        # Apply priority filter
        if priority:
            df = df[df['Priority'] == priority]
        
        return df
    
    def get_paginated_data(self, 
                          page: int = 1,
                          page_size: int = 100,
                          sort_by: str = "ID",
                          sort_order: str = "asc",
                          search: Optional[str] = None,
                          status: Optional[str] = None,
                          priority: Optional[str] = None) -> Tuple[List[Dict], Dict[str, Any]]:
        """Get paginated and filtered data"""
        
        # Get and filter data
        df = self.get_data()
        df = self.apply_filters(df, search, status, priority)
        
        # Sort data
        if sort_by in df.columns:
            df = df.sort_values(by=sort_by, ascending=(sort_order == "asc"))
        
        # Calculate pagination
        total_records = len(df)
        total_pages = (total_records + page_size - 1) // page_size
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        
        # Get page data
        page_data = df.iloc[start_idx:end_idx]
        
        # Convert to list of dicts
        records = []
        for _, row in page_data.iterrows():
            record = row.to_dict()
            # Convert timestamps to ISO format
            if pd.notna(record.get('Created')):
                record['Created'] = record['Created'].isoformat()
            if pd.notna(record.get('Updated')):
                record['Updated'] = record['Updated'].isoformat()
            records.append(record)
        
        # Prepare pagination info
        pagination_info = {
            "current_page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "total_records": total_records,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
        
        return records, pagination_info
    
    def get_filter_options(self) -> FilterOptions:
        """Get available filter options from the data"""
        df = self.get_data()
        
        # Get unique values for categorical columns
        status_values = df['Status'].dropna().unique().tolist() if 'Status' in df.columns else []
        priority_values = df['Priority'].dropna().unique().tolist() if 'Priority' in df.columns else []
        # Since there's no Assignee column, we'll use Projects instead
        assignee_values = df['Projects'].dropna().unique().tolist() if 'Projects' in df.columns else []
        
        # Get date range
        date_range = {}
        if 'Created' in df.columns:
            created_dates = df['Created'].dropna()
            if len(created_dates) > 0:
                date_range = {
                    "min": created_dates.min(),
                    "max": created_dates.max()
                }
        
        return FilterOptions(
            status=sorted(status_values),
            priority=sorted(priority_values),
            assignee=sorted(assignee_values),
            created_date_range=date_range
        )
    
    def get_applied_and_available_filters(self, 
                                        status: Optional[str] = None,
                                        priority: Optional[str] = None) -> Dict[str, Any]:
        """Get information about applied and available filters"""
        filter_options = self.get_filter_options()
        
        applied = []
        if status:
            applied.append("status")
        if priority:
            applied.append("priority")
        
        return {
            "applied": applied,
            "available": {
                "status": filter_options.status,
                "priority": filter_options.priority
            }
        }
    
    def get_sprint_progress(self, sprint_name: Optional[str] = None) -> SprintProgress:
        """Calculate Sprint progress and statistics"""
        df = self.get_data()
        
        # Filter by Sprint if specified
        if sprint_name and 'Sprint' in df.columns:
            df = df[df['Sprint'] == sprint_name]
        elif 'Sprint' in df.columns:
            # If no sprint specified, get the most recent active sprint
            # Find the most recent sprint based on due dates or creation dates
            most_recent_sprint = self._get_most_recent_sprint(df)
            if most_recent_sprint:
                df = df[df['Sprint'] == most_recent_sprint]
                sprint_name = most_recent_sprint
        
        # Calculate basic statistics
        total_stories = len(df)
        
        # Define completion statuses (can be customized)
        completion_statuses = ['Done', 'Resolved', 'Closed', 'Complete']
        
        # Calculate completed stories
        completed_stories = 0
        if 'Status' in df.columns:
            completed_stories = len(df[df['Status'].isin(completion_statuses)])
        
        completion_percentage = (completed_stories / total_stories * 100) if total_stories > 0 else 0
        
        # Calculate Story Points
        total_story_points = 0
        completed_story_points = 0
        
        if 'Story Points' in df.columns:
            # Convert to numeric, handling non-numeric values
            df['Story Points'] = pd.to_numeric(df['Story Points'], errors='coerce')
            total_story_points = df['Story Points'].sum()
            
            # Calculate completed story points
            completed_df = df[df['Status'].isin(completion_statuses)] if 'Status' in df.columns else df
            completed_story_points = completed_df['Story Points'].sum()
        
        story_points_completion_percentage = (completed_story_points / total_story_points * 100) if total_story_points > 0 else 0
        
        # Calculate status breakdown
        status_breakdown = []
        if 'Status' in df.columns:
            status_counts = df['Status'].value_counts()
            total_items = len(df)
            
            for status, count in status_counts.items():
                percentage = (count / total_items * 100) if total_items > 0 else 0
                status_breakdown.append(SprintStatusCount(
                    status=str(status),
                    count=int(count),
                    percentage=round(percentage, 2)
                ))
        
        # Calculate Bug statistics
        total_bugs = 0
        bugs_by_severity = {}
        bugs_by_status = []
        
        if 'Issue Type' in df.columns:
            # Count bugs
            bugs_df = df[df['Issue Type'] == 'Bug']
            total_bugs = len(bugs_df)
            
            # Bugs by severity (using Priority as severity proxy)
            if 'Priority' in bugs_df.columns:
                severity_counts = bugs_df['Priority'].value_counts()
                bugs_by_severity = {str(k): int(v) for k, v in severity_counts.items()}
            
            # Bugs by status
            if 'Status' in bugs_df.columns:
                bug_status_counts = bugs_df['Status'].value_counts()
                total_bug_items = len(bugs_df)
                
                for status, count in bug_status_counts.items():
                    percentage = (count / total_bug_items * 100) if total_bug_items > 0 else 0
                    bugs_by_status.append(SprintStatusCount(
                        status=str(status),
                        count=int(count),
                        percentage=round(percentage, 2)
                    ))
        
        # Calculate remaining work days (simplified calculation)
        remaining_work_days = None
        sprint_end_date = None
        
        # Try to estimate sprint end date from due dates
        if 'Due date' in df.columns:
            valid_due_dates = df['Due date'].dropna()
            if len(valid_due_dates) > 0:
                latest_due_date = valid_due_dates.max()
                if pd.notna(latest_due_date):
                    sprint_end_date = latest_due_date
                    # Calculate remaining work days
                    today = datetime.now().date()
                    if hasattr(latest_due_date, 'date'):
                        end_date = latest_due_date.date()
                        remaining_work_days = (end_date - today).days
        
        # Create bug info
        bug_info = SprintBugInfo(
            total_bugs=total_bugs,
            bugs_by_severity=bugs_by_severity,
            bugs_by_status=bugs_by_status
        )
        
        return SprintProgress(
            sprint_name=sprint_name or "Current Sprint",
            total_stories=total_stories,
            completed_stories=completed_stories,
            completion_percentage=round(completion_percentage, 2),
            total_story_points=round(total_story_points, 2),
            completed_story_points=round(completed_story_points, 2),
            story_points_completion_percentage=round(story_points_completion_percentage, 2),
            remaining_work_days=remaining_work_days,
            sprint_end_date=sprint_end_date,
            status_breakdown=status_breakdown,
            bug_info=bug_info,
            last_updated=datetime.now()
        )
    
    def _get_most_recent_sprint(self, df: pd.DataFrame) -> Optional[str]:
        """Find the most recent active sprint based on due dates or creation dates"""
        if 'Sprint' not in df.columns:
            return None
        
        # Get unique sprints
        sprints = df['Sprint'].dropna().unique()
        if len(sprints) == 0:
            return None
        
        # If only one sprint, return it
        if len(sprints) == 1:
            return str(sprints[0])
        
        # Try to find the most recent sprint based on due dates
        if 'Due date' in df.columns:
            # Group by sprint and find the latest due date for each sprint
            sprint_dates = {}
            for sprint in sprints:
                sprint_df = df[df['Sprint'] == sprint]
                valid_dates = sprint_df['Due date'].dropna()
                if len(valid_dates) > 0:
                    latest_date = valid_dates.max()
                    if pd.notna(latest_date):
                        sprint_dates[sprint] = latest_date
            
            if sprint_dates:
                # Find the sprint with the latest due date
                most_recent_sprint = max(sprint_dates.items(), key=lambda x: x[1])[0]
                return str(most_recent_sprint)
        
        # Fallback: try to find based on creation dates
        if 'Created' in df.columns:
            sprint_dates = {}
            for sprint in sprints:
                sprint_df = df[df['Sprint'] == sprint]
                valid_dates = sprint_df['Created'].dropna()
                if len(valid_dates) > 0:
                    latest_date = valid_dates.max()
                    if pd.notna(latest_date):
                        sprint_dates[sprint] = latest_date
            
            if sprint_dates:
                # Find the sprint with the latest creation date
                most_recent_sprint = max(sprint_dates.items(), key=lambda x: x[1])[0]
                return str(most_recent_sprint)
        
        # Final fallback: return the first non-empty sprint
        non_empty_sprints = [s for s in sprints if str(s).strip()]
        if non_empty_sprints:
            return str(non_empty_sprints[0])
        
        return None