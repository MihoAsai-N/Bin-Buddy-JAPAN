"""
garbage_types.py

ごみの種類情報の取得に関する FastAPI ルーター。
"""

from fastapi import APIRouter

router = APIRouter()

# 仮データ
mock_garbage_types = [
    {"id": "1", "name": "燃やせるごみ", "color": "bg-red-100 text-red-800"},
    {"id": "2", "name": "燃やせないごみ", "color": "bg-gray-200 text-gray-800"},
    {"id": "3", "name": "びん・缶・ペット", "color": "bg-green-100 text-green-800"},
    {"id": "4", "name": "容器プラ", "color": "bg-yellow-100 text-yellow-800"},
    {"id": "5", "name": "雑がみ", "color": "bg-blue-100 text-blue-800"},
    {"id": "6", "name": "枝・葉・草", "color": "bg-emerald-100 text-emerald-800"},
    {"id": "7", "name": "スプレー缶類", "color": "bg-purple-100 text-purple-800"},
]

@router.get("/garbage-types")
async def get_garbage_types():
    """
    ごみの種類情報を取得するエンドポイント。

    Returns:
        list[dict]: ごみの種類情報のリスト
    """
    return mock_garbage_types
