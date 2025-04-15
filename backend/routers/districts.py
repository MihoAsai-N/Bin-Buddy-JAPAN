"""
districts.py

地区情報の取得に関する FastAPI ルーター。
"""

from fastapi import APIRouter

router = APIRouter()

# 仮データ
mock_districts = [
    {"id": "1", "name": "地区①"},
    {"id": "2", "name": "地区②"},
]

@router.get("/districts")
async def get_districts():
    """
    地区情報を取得するエンドポイント。

    Returns:
        list[dict]: 地区情報のリスト
    """
    return mock_districts
