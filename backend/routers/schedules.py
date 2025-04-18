"""
schedules.py

ごみ収集スケジュールの取得に関する FastAPI ルーター。
"""

from fastapi import APIRouter

router = APIRouter()

# 仮データ
mock_schedules = [
    {"id": "1", "districtId": "1", "areaId": "1", "day": "月曜日", "garbageTypeId": "1"},
    {"id": "2", "districtId": "1", "areaId": "2", "day": "火曜日", "garbageTypeId": "2"},
    {"id": "3", "districtId": "2", "areaId": "4", "day": "金曜日", "garbageTypeId": "3"},
    {"id": "4", "districtId": "2", "areaId": "5", "day": "月曜日", "garbageTypeId": "4"},
    {"id": "5", "districtId": "2", "areaId": "6", "day": "火曜日", "garbageTypeId": "5"},
    {"id": "6", "districtId": "2", "areaId": "7", "day": "水曜日", "garbageTypeId": "6"},
    {"id": "7", "districtId": "2", "areaId": "8", "day": "木曜日", "garbageTypeId": "7"},
    {"id": "8", "districtId": "2", "areaId": "9", "day": "金曜日", "garbageTypeId": "1"},
]


@router.get("/schedules")
async def get_schedules():
    """
    ごみ収集スケジュールを取得するエンドポイント。

    Returns:
        list[dict]: スケジュール情報のリスト
    """
    return mock_schedules
