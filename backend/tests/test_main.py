import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_read_root():
    """測試根路徑是否正常回應"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Google Sheets Table API is running!", "version": "1.0.0"}


def test_health_check():
    """測試健康檢查端點"""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert "timestamp" in response.json()


def test_table_summary():
    """測試表格摘要端點"""
    response = client.get("/api/table/summary")
    assert response.status_code == 200
    
    data = response.json()
    assert "sheet_id" in data
    assert "sheet_name" in data
    assert "total_rows" in data
    assert "total_columns" in data
    assert "columns" in data
    assert isinstance(data["columns"], list)