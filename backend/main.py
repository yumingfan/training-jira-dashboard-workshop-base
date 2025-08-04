from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from datetime import datetime
import sys
import os
import pandas as pd

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import config
from models import (
    APIInfoResponse, 
    HealthCheckResponse, 
    TableSummary,
    TableDataResponse,
    FilterOptions,
    TableRow,
    PaginationInfo,
    FilterInfo,
    SprintProgressResponse
)
from services.sheets_service import GoogleSheetsService

# Initialize FastAPI app
app = FastAPI(
    title="Google Sheets Table API",
    description="API for reading and displaying Google Sheets data in table format",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Initialize Google Sheets service
sheets_service = GoogleSheetsService()


@app.get("/", response_model=APIInfoResponse)
async def root():
    """Root endpoint - API information"""
    return APIInfoResponse(
        message="Google Sheets Table API is running!",
        version="1.0.0"
    )


@app.get("/api/health", response_model=HealthCheckResponse)
async def health_check():
    """Health check endpoint"""
    try:
        # Try to connect to Google Sheets
        sheets_service.get_summary()
        sheets_status = "ok"
    except Exception as e:
        sheets_status = f"error: {str(e)}"
    
    return HealthCheckResponse(
        status="healthy",
        google_sheets_connection=sheets_status,
        timestamp=datetime.now()
    )


@app.get("/api/table/summary", response_model=TableSummary)
async def get_table_summary():
    """Get summary information about the Google Sheets table"""
    try:
        summary = sheets_service.get_summary()
        return TableSummary(**summary)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Failed to connect to Google Sheets: {str(e)}")


@app.get("/api/table/data", response_model=TableDataResponse)
async def get_table_data(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(config.DEFAULT_PAGE_SIZE, ge=10, le=config.MAX_PAGE_SIZE, description="Number of items per page"),
    sort_by: str = Query("Key", description="Column to sort by"),
    sort_order: str = Query("asc", pattern="^(asc|desc)$", description="Sort order"),
    search: Optional[str] = Query(None, description="Search query for all fields"),
    status: Optional[str] = Query(None, description="Filter by status"),
    priority: Optional[str] = Query(None, description="Filter by priority")
):
    """Get paginated table data with optional filtering and sorting"""
    try:
        # Get paginated data
        records, pagination_info = sheets_service.get_paginated_data(
            page=page,
            page_size=page_size,
            sort_by=sort_by,
            sort_order=sort_order,
            search=search,
            status=status,
            priority=priority
        )
        
        # Get filter information
        filter_info = sheets_service.get_applied_and_available_filters(status, priority)
        
        # Convert records to dictionaries with all fields
        table_rows = []
        for record in records:
            # 創建一個新的字典來存儲所有欄位
            row_data = {}
            
            # 處理所有欄位
            for key, value in record.items():
                # 處理特殊欄位名稱，將空格轉換為底線
                field_name = key.replace(' ', '_').replace('.', '_').lower()
                
                # 處理不同類型的值
                if pd.isna(value):
                    row_data[field_name] = None
                elif isinstance(value, (pd.Timestamp, datetime)):
                    row_data[field_name] = value.isoformat()
                elif isinstance(value, (int, float)):
                    row_data[field_name] = value
                else:
                    row_data[field_name] = str(value)
            
            table_rows.append(row_data)
        
        return TableDataResponse(
            data=table_rows,
            pagination=PaginationInfo(**pagination_info),
            filters=FilterInfo(**filter_info)
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/api/table/filters", response_model=FilterOptions)
async def get_filter_options():
    """Get available filter options"""
    try:
        filter_options = sheets_service.get_filter_options()
        return filter_options
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get filter options: {str(e)}")


@app.get("/api/sprint/progress", response_model=SprintProgressResponse)
async def get_sprint_progress(
    sprint_name: Optional[str] = Query(None, description="Sprint name to filter by")
):
    """Get Sprint progress and statistics"""
    try:
        sprint_progress = sheets_service.get_sprint_progress(sprint_name)
        
        return SprintProgressResponse(
            success=True,
            data=sprint_progress,
            message="Sprint progress retrieved successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get sprint progress: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=config.API_HOST,
        port=config.API_PORT,
        reload=config.DEBUG_MODE
    )