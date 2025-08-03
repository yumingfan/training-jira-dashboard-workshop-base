"""
Pytest configuration and shared fixtures
"""
import pytest
from typing import Generator
from fastapi.testclient import TestClient
from main import app


@pytest.fixture(scope="function")
def test_client() -> Generator[TestClient, None, None]:
    """提供測試用的 FastAPI client"""
    with TestClient(app) as client:
        yield client


@pytest.fixture(scope="function")
def sample_table_data():
    """提供測試用的範例表格資料"""
    return {
        "data": [
            {"key": "TEST-001", "summary": "Test Issue 1", "status": "To Do"},
            {"key": "TEST-002", "summary": "Test Issue 2", "status": "In Progress"},
        ],
        "pagination": {
            "page": 1,
            "page_size": 10,
            "total": 2,
            "total_pages": 1
        }
    }