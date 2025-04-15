"""
areas.py

エリア情報の取得に関する FastAPI ルーター。
"""

from fastapi import APIRouter

router = APIRouter()

# 仮データ
mock_areas = [
    {"id": "1", "districtId": "1", "name": "エリア①"},
    {"id": "2", "districtId": "1", "name": "エリア②"},
    {"id": "3", "districtId": "1", "name": "エリア③"},
    {"id": "4", "districtId": "2", "name": "エリア①"},
    {"id": "5", "districtId": "2", "name": "エリア②"},
]

@router.get("/areas")
async def get_areas():
    """
    エリア情報を取得するエンドポイント。

    Returns:
        list[dict]: エリア情報のリスト
    """
    return mock_areas
