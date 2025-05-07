"""
areas.py

エリア情報の取得に関する FastAPI ルーター。
"""

from fastapi import APIRouter

router = APIRouter()

# 仮データ
mock_areas = [
    {"id": "1", "districtId": "1", "name": "中央区①"},
    {"id": "2", "districtId": "1", "name": "中央区②"},
    {"id": "3", "districtId": "1", "name": "中央区③"},
    {"id": "4", "districtId": "2", "name": "東区①"},
    {"id": "5", "districtId": "2", "name": "東区①"},
    {"id": "6", "districtId": "2", "name": "東区①"},
    {"id": "7", "districtId": "2", "name": "東区①"},
    {"id": "8", "districtId": "2", "name": "東区②"},
    {"id": "9", "districtId": "2", "name": "東区②"},
]

@router.get("/admin_areas")
async def get_admin_areas():
    """
    エリア情報を取得するエンドポイント。

    Returns:
        list[dict]: エリア情報のリスト
    """
    return mock_areas
