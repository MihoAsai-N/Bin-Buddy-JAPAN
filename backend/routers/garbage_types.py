"""
garbage_types.py

ごみの種類情報の取得に関する FastAPI ルーター。
"""

from fastapi import APIRouter

router = APIRouter()

# 仮データ
mock_garbage_types = [
    {"id": "1", "name": "可燃ごみ", "color": "bg-red-200 text-red-800"},
    {"id": "2", "name": "不燃ごみ", "color": "bg-gray-300 text-gray-800"},
    {"id": "3", "name": "資源ごみ", "color": "bg-green-200 text-green-800"},
]

@router.get("/garbage-types")
async def get_garbage_types():
    """
    ごみの種類情報を取得するエンドポイント。

    Returns:
        list[dict]: ごみの種類情報のリスト
    """
    return mock_garbage_types
