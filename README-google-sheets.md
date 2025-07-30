# Google Sheets Table View Implementation

## Overview
This implementation provides a full-stack solution for displaying Google Sheets data in a table view with pagination, sorting, searching, and filtering capabilities.

## Architecture

### Backend (Python FastAPI)
- **Location**: `/backend`
- **Port**: 8000
- **API Documentation**: http://localhost:8000/docs
- **Key Features**:
  - Connects to Google Sheets via CSV export URL
  - Provides RESTful API endpoints
  - 5-minute data caching to reduce API calls
  - Full CORS support for frontend integration

### Frontend (Next.js + React)
- **Location**: `/frontend`
- **Port**: 3001
- **Google Sheets Page**: http://localhost:3001/google-sheets
- **Key Features**:
  - Modern table UI with shadcn/ui components
  - Real-time search across all fields
  - Status and Priority filters
  - Column sorting (click headers)
  - Pagination with navigation controls
  - Loading states and error handling
  - Responsive design

## Running the Application

### Start Backend:
```bash
cd backend
python3 -m pip install -r requirements.txt
python3 start_server.py
```

### Start Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Access Points
- **Frontend Table View**: http://localhost:3001/google-sheets
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Features Implemented

### Table View
- ✅ Displays data from Google Sheets (727 rows, 61 columns)
- ✅ Pagination (100 items per page by default)
- ✅ Column sorting (Key, Summary, Status, Priority, Created, Updated)
- ✅ Global search functionality
- ✅ Filter by Status and Priority
- ✅ Responsive design for mobile and desktop
- ✅ Loading and error states
- ✅ Status and Priority badges with color coding

### API Endpoints
- `GET /` - Health check
- `GET /api/health` - API health with Google Sheets connection status
- `GET /api/table/summary` - Table metadata
- `GET /api/table/data` - Paginated table data with filters
- `GET /api/table/filters` - Available filter options

## Data Source
- **Google Sheets ID**: 1RmJjghgiV3XWLl2BaxT-md8CP3pqb1Wuk-EhFoqp1VM
- **Sheet Name**: rawData
- **Access**: Public read-only