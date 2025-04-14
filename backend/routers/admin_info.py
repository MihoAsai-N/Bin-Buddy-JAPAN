"""
admin_info.py

管理者情報の取得・更新に関する FastAPI ルーター。
"""

from fastapi import APIRouter, Request

router = APIRouter()

# 仮データ
admin_info = {
    "municipalityCode": "01100",
    "municipalityName": "札幌市",
    "furigana": "サッポロシ",
    "postalCode": "060-8611",
    "address": "北海道札幌市中央区北1条西2丁目",
    "department": "環境局 環境事業部",
    "contactPerson": "水井 花子",
    "phoneNumber": "123-4567-89",
    "email": "sapporo@binbuddy.jp",
    "lastLogin": "2023-04-10 09:30"
}

@router.get("/admin-info")
async def get_admin_info():
    """
    管理者情報を取得するエンドポイント。
    """
    return admin_info

@router.put("/admin-info")
async def update_admin_info(request: Request):
    """
    管理者情報を更新するエンドポイント。

    Args:
        request (Request): 更新データを含むリクエスト

    Returns:
        dict: 更新後の管理者情報
    """
    data = await request.json()
    admin_info.update(data)
    return admin_info
