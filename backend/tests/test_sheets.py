import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.sheets_service import GoogleSheetsService


def test_google_sheets_connection():
    """Test basic connection to Google Sheets"""
    service = GoogleSheetsService()
    
    try:
        # Test fetching data
        print("Testing Google Sheets connection...")
        df = service.get_data()
        print(f"✓ Successfully connected! Found {len(df)} rows and {len(df.columns)} columns")
        print(f"✓ Columns: {list(df.columns)}")
        
        # Test summary
        summary = service.get_summary()
        print(f"✓ Summary retrieved: {summary['total_rows']} rows in sheet '{summary['sheet_name']}'")
        
        # Test filter options
        filters = service.get_filter_options()
        print(f"✓ Filter options retrieved:")
        print(f"  - Status values: {filters.status[:5]}..." if len(filters.status) > 5 else f"  - Status values: {filters.status}")
        print(f"  - Priority values: {filters.priority}")
        
        # Test pagination
        records, pagination = service.get_paginated_data(page=1, page_size=10)
        print(f"✓ Pagination test: Got {len(records)} records for page 1")
        print(f"  - Total pages: {pagination['total_pages']}")
        print(f"  - Total records: {pagination['total_records']}")
        
        print("\n✅ All tests passed!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False
    
    return True


if __name__ == "__main__":
    test_google_sheets_connection()