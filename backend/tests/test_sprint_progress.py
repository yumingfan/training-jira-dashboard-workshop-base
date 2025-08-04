import pytest
from fastapi.testclient import TestClient
from main import app
from unittest.mock import Mock, patch
from datetime import datetime
from models import SprintProgress, SprintStatusCount, SprintBugInfo

client = TestClient(app)


class TestSprintProgressAPI:
    """Test cases for Sprint Progress API endpoint"""
    
    @pytest.fixture
    def mock_sprint_progress(self):
        """Mock Sprint progress data"""
        return SprintProgress(
            sprint_name="Sprint 1",
            total_stories=10,
            completed_stories=6,
            completion_percentage=60.0,
            total_story_points=50.0,
            completed_story_points=30.0,
            story_points_completion_percentage=60.0,
            remaining_work_days=5,
            sprint_end_date=datetime(2024, 12, 31),
            status_breakdown=[
                SprintStatusCount(status="Done", count=6, percentage=60.0),
                SprintStatusCount(status="In Progress", count=3, percentage=30.0),
                SprintStatusCount(status="To Do", count=1, percentage=10.0)
            ],
            bug_info=SprintBugInfo(
                total_bugs=3,
                bugs_by_severity={"High": 1, "Medium": 2},
                bugs_by_status=[
                    SprintStatusCount(status="Open", count=2, percentage=66.67),
                    SprintStatusCount(status="In Progress", count=1, percentage=33.33)
                ]
            ),
            last_updated=datetime.now()
        )
    
    def test_get_sprint_progress_success(self, mock_sprint_progress):
        """Test successful sprint progress retrieval"""
        with patch('services.sheets_service.GoogleSheetsService.get_sprint_progress') as mock_get_progress:
            mock_get_progress.return_value = mock_sprint_progress
            
            response = client.get("/api/sprint/progress")
            
            assert response.status_code == 200
            data = response.json()
            
            assert data["success"] is True
            assert data["message"] == "Sprint progress retrieved successfully"
            assert data["data"]["sprint_name"] == "Sprint 1"
            assert data["data"]["total_stories"] == 10
            assert data["data"]["completed_stories"] == 6
            assert data["data"]["completion_percentage"] == 60.0
            assert data["data"]["total_story_points"] == 50.0
            assert data["data"]["completed_story_points"] == 30.0
            assert data["data"]["story_points_completion_percentage"] == 60.0
            assert data["data"]["remaining_work_days"] == 5
            assert len(data["data"]["status_breakdown"]) == 3
            assert data["data"]["bug_info"]["total_bugs"] == 3
    
    def test_get_sprint_progress_with_sprint_name(self, mock_sprint_progress):
        """Test sprint progress with specific sprint name"""
        with patch('services.sheets_service.GoogleSheetsService.get_sprint_progress') as mock_get_progress:
            mock_get_progress.return_value = mock_sprint_progress
            
            response = client.get("/api/sprint/progress?sprint_name=Sprint%201")
            
            assert response.status_code == 200
            data = response.json()
            assert data["data"]["sprint_name"] == "Sprint 1"
    
    def test_get_sprint_progress_service_error(self):
        """Test sprint progress when service throws an error"""
        with patch('services.sheets_service.GoogleSheetsService.get_sprint_progress') as mock_get_progress:
            mock_get_progress.side_effect = Exception("Service error")
            
            response = client.get("/api/sprint/progress")
            
            assert response.status_code == 500
            data = response.json()
            assert "Failed to get sprint progress" in data["detail"]
    
    def test_get_sprint_progress_empty_data(self):
        """Test sprint progress with empty data"""
        empty_progress = SprintProgress(
            sprint_name="Empty Sprint",
            total_stories=0,
            completed_stories=0,
            completion_percentage=0.0,
            total_story_points=0.0,
            completed_story_points=0.0,
            story_points_completion_percentage=0.0,
            remaining_work_days=None,
            sprint_end_date=None,
            status_breakdown=[],
            bug_info=SprintBugInfo(
                total_bugs=0,
                bugs_by_severity={},
                bugs_by_status=[]
            ),
            last_updated=datetime.now()
        )
        
        with patch('services.sheets_service.GoogleSheetsService.get_sprint_progress') as mock_get_progress:
            mock_get_progress.return_value = empty_progress
            
            response = client.get("/api/sprint/progress")
            
            assert response.status_code == 200
            data = response.json()
            assert data["data"]["total_stories"] == 0
            assert data["data"]["completion_percentage"] == 0.0
            assert data["data"]["bug_info"]["total_bugs"] == 0


class TestSprintProgressService:
    """Test cases for Sprint Progress service methods"""
    
    @pytest.fixture
    def mock_dataframe(self):
        """Mock DataFrame with sprint data"""
        import pandas as pd
        from datetime import datetime
        
        data = {
            'Key': ['ISSUE-1', 'ISSUE-2', 'ISSUE-3', 'ISSUE-4'],
            'Issue Type': ['Story', 'Bug', 'Story', 'Bug'],
            'Status': ['Done', 'Open', 'Done', 'In Progress'],
            'Priority': ['High', 'Medium', 'Low', 'High'],
            'Story Points': [5.0, None, 3.0, None],
            'Sprint': ['Sprint 1', 'Sprint 1', 'Sprint 1', 'Sprint 1'],
            'Due date': [
                datetime(2024, 12, 31),
                datetime(2024, 12, 30),
                datetime(2024, 12, 29),
                datetime(2024, 12, 28)
            ]
        }
        return pd.DataFrame(data)
    
    def test_calculate_completion_percentage(self, mock_dataframe):
        """Test completion percentage calculation"""
        from services.sheets_service import GoogleSheetsService
        
        with patch.object(GoogleSheetsService, 'get_data', return_value=mock_dataframe):
            service = GoogleSheetsService()
            progress = service.get_sprint_progress("Sprint 1")
            
            # 2 out of 4 stories are done (Done status)
            assert progress.completion_percentage == 50.0
            assert progress.total_stories == 4
            assert progress.completed_stories == 2
    
    def test_calculate_story_points(self, mock_dataframe):
        """Test story points calculation"""
        from services.sheets_service import GoogleSheetsService
        
        with patch.object(GoogleSheetsService, 'get_data', return_value=mock_dataframe):
            service = GoogleSheetsService()
            progress = service.get_sprint_progress("Sprint 1")
            
            # Total story points: 5.0 + 3.0 = 8.0
            # Completed story points: 8.0 (both Done stories have points: 5.0 + 3.0)
            assert progress.total_story_points == 8.0
            assert progress.completed_story_points == 8.0
            assert progress.story_points_completion_percentage == 100.0
    
    def test_calculate_bug_statistics(self, mock_dataframe):
        """Test bug statistics calculation"""
        from services.sheets_service import GoogleSheetsService
        
        with patch.object(GoogleSheetsService, 'get_data', return_value=mock_dataframe):
            service = GoogleSheetsService()
            progress = service.get_sprint_progress("Sprint 1")
            
            # 2 bugs total
            assert progress.bug_info.total_bugs == 2
            # Bug status breakdown
            assert len(progress.bug_info.bugs_by_status) == 2
            # Bug severity (using Priority as proxy)
            assert progress.bug_info.bugs_by_severity["Medium"] == 1
            assert progress.bug_info.bugs_by_severity["High"] == 1
    
    def test_get_most_recent_sprint(self):
        """Test most recent sprint identification"""
        from services.sheets_service import GoogleSheetsService
        import pandas as pd
        from datetime import datetime
        
        # Create test data with multiple sprints
        data = {
            'Sprint': ['Sprint 1', 'Sprint 1', 'Sprint 2', 'Sprint 2', 'Sprint 3'],
            'Due date': [
                datetime(2024, 12, 31),
                datetime(2024, 12, 30),
                datetime(2025, 1, 15),
                datetime(2025, 1, 20),
                datetime(2025, 2, 1)
            ],
            'Created': [
                datetime(2024, 12, 1),
                datetime(2024, 12, 2),
                datetime(2025, 1, 1),
                datetime(2025, 1, 2),
                datetime(2025, 2, 1)
            ]
        }
        df = pd.DataFrame(data)
        
        service = GoogleSheetsService()
        most_recent = service._get_most_recent_sprint(df)
        
        # Should return Sprint 3 as it has the latest due date
        assert most_recent == "Sprint 3"
    
    def test_get_most_recent_sprint_fallback(self):
        """Test most recent sprint identification with fallback logic"""
        from services.sheets_service import GoogleSheetsService
        import pandas as pd
        from datetime import datetime
        
        # Create test data without due dates
        data = {
            'Sprint': ['Sprint 1', 'Sprint 2', 'Sprint 3'],
            'Created': [
                datetime(2024, 12, 1),
                datetime(2025, 1, 1),
                datetime(2025, 2, 1)
            ]
        }
        df = pd.DataFrame(data)
        
        service = GoogleSheetsService()
        most_recent = service._get_most_recent_sprint(df)
        
        # Should return Sprint 3 as it has the latest creation date
        assert most_recent == "Sprint 3" 