"""
districts.py

地区情報の取得に関する FastAPI ルーター。
"""

from fastapi import APIRouter

router = APIRouter()

# 仮データ
mock_districts = [
    {"id": "1", "name": "中央区"},
    {"id": "2", "name": "東区"},
    {"id": "3", "name": "北区"},
    {"id": "4", "name": "西区"},
    {"id": "5", "name": "南区"},
    {"id": "6", "name": "手稲区"},
    {"id": "7", "name": "豊平区"},
    {"id": "8", "name": "清田区"},
    {"id": "9", "name": "白石区"},
    {"id": "10", "name": "厚別区"},



]

@router.get("/districts")
async def get_districts():
    """
    地区情報を取得するエンドポイント。

    Returns:
        list[dict]: 地区情報のリスト
    """
    return mock_districts
