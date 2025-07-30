import pandas as pd
import requests
from io import StringIO
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple, Any
import config
from models import TableRow, FilterOptions


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