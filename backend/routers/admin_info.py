"""
admin_info.py

管理者情報の取得・更新に関する FastAPI ルーター。
"""

from datetime import datetime
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
    "paymentStatus": "paid",
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

@router.post("/admin-info")
async def create_admin_info(request: Request):
    """
    管理者情報を新規登録するエンドポイント。
    既存データを上書きする形で登録（仮実装）

    Args:
        request (Request): 登録データを含むリクエスト

    Returns:
        dict: 登録された管理者情報
    """
    data = await request.json()

    # lastLogin がなければ現在時刻を入れる（ISO文字列→"YYYY-MM-DD HH:MM"へ変換）
    if "lastLogin" not in data:
        data["lastLogin"] = datetime.now().strftime("%Y-%m-%d %H:%M")

    admin_info.clear()
    admin_info.update(data)

    return {
        "message": "管理者情報を登録しました（モック）",
        "data": admin_info
    }
