"""
admin_info.py

管理者情報の取得・更新に関する FastAPI ルーター。
"""

from datetime import datetime
from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.converters import admin_info_to_response #TODO: VSCode の .env に PYTHONPATH を設定
from db.models import AdminInfo
from db.session import get_db

router = APIRouter()

@router.get("/admin-info")
def get_admin_info(db: Session = Depends(get_db)):
    """
    管理者情報を取得するエンドポイント。

    Returns:
        dict: データベースから取得した管理者情報（キャメルケース形式）
    
    Raises:
        HTTPException: 管理者情報が存在しない場合は 404 を返す。
    """
    admin = db.query(AdminInfo).first()
    if not admin:
        raise HTTPException(status_code=404, detail="管理者情報が見つかりません")
    return admin_info_to_response(admin)

@router.put("/admin-info")
async def update_admin_info(request: Request, db: Session = Depends(get_db)):
    """
    管理者情報を更新するエンドポイント。

    Args:
        request (Request): 更新データを含むリクエスト

    Returns:
        dict: 更新後の管理者情報
    """
    admin = db.query(AdminInfo).first()
    if not admin:
        raise HTTPException(status_code=404, detail="管理者情報が見つかりません")

    data = await request.json()

    for key, value in data.items():
        if hasattr(admin, key):
            setattr(admin, key, value)

    db.commit()
    db.refresh(admin)

    return {
        "message": "管理者情報を更新しました",
        "data": admin_info_to_response(admin),
    }

@router.post("/admin-info")
async def create_admin_info(request: Request, db: Session = Depends(get_db)):
    """
    管理者情報を新規登録するエンドポイント。

    既存の情報がある場合はエラーを返す（重複登録防止のため）。
    `lastLogin` が指定されていない場合は現在時刻を自動で設定する。

    Args:
        request (Request): 新規登録データを含むリクエスト

    Returns:
        dict: 登録された管理者情報（キャメルケース形式）

    Raises:
        HTTPException: 既に管理者情報が存在する場合（409 Conflict）
    """
    existing_admin = db.query(AdminInfo).first()
    if existing_admin:
        raise HTTPException(status_code=409, detail="管理者情報はすでに登録されています")

    data = await request.json()
    print("受信したデータ:", data)

    if "lastLogin" not in data:
        data["lastLogin"] = datetime.now().strftime("%Y-%m-%d %H:%M")

    # スネークケースに変換
    admin = AdminInfo(
        uid=data.get("uid"),
        municipality_code=data.get("municipalityCode"),
        municipality_name=data.get("municipalityName"),
        furigana=data.get("furigana"),
        postal_code=data.get("postalCode"),
        address=data.get("address"),
        department=data.get("department"),
        contact_person=data.get("contactPerson"),
        phone_number=data.get("phoneNumber"),
        email=data.get("email"),
        payment_status=data.get("paymentStatus"),
        last_login=datetime.strptime(data.get("lastLogin"), "%Y-%m-%d %H:%M"),
        note=data.get("note"),
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    return {
        "message": "管理者情報を登録しました",
        "data": admin_info_to_response(admin),
    }
