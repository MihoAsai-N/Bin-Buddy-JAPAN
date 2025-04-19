"""
admin_info.py

管理者情報の取得・更新に関する FastAPI ルーター。
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.converters import admin_info_to_response #TODO: VSCode の .env に PYTHONPATH を設定
from db.models import AdminInfo
from db.session import get_db

router = APIRouter()

# Pydanticモデルを定義
class AdminInfoCreate(BaseModel):
    """
    管理者情報の登録リクエストに使用するPydanticモデル。

    クライアントから受け取る管理者情報の構造を定義し、
    バリデーションや型チェックに使用されます。
    """
    uid: str
    municipalityCode: str
    municipalityName: str
    furigana: str
    postalCode: str
    address: str
    department: str
    contactPerson: str
    phoneNumber: str
    email: str
    paymentStatus: str
    lastLogin: datetime  # ISO 8601形式対応
    note: Optional[str] = None


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
async def create_admin_info(
    admin_data: AdminInfoCreate, db: Session = Depends(get_db)
):
    """
    管理者情報を新規登録するエンドポイント。

    既存の情報がある場合はエラーを返す（重複登録防止のため）。
    `lastLogin` が指定されていない場合は現在時刻を自動で設定する。

    Returns:
        dict: 登録された管理者情報（キャメルケース形式）

    Raises:
        HTTPException: 既に管理者情報が存在する場合（409 Conflict）
    """

    # UID で重複チェック
    existing_admin = db.query(AdminInfo).filter(AdminInfo.uid == admin_data.uid).first()
    if existing_admin:
        raise HTTPException(status_code=409, detail="このUIDはすでに登録されています")

    # スネークケースに変換
    admin = AdminInfo(
        uid=admin_data.uid,
        municipality_code=admin_data.municipalityCode,
        municipality_name=admin_data.municipalityName,
        furigana=admin_data.furigana,
        postal_code=admin_data.postalCode,
        address=admin_data.address,
        department=admin_data.department,
        contact_person=admin_data.contactPerson,
        phone_number=admin_data.phoneNumber,
        email=admin_data.email,
        payment_status=admin_data.paymentStatus,
        last_login=admin_data.lastLogin,
        note=admin_data.note,
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    return {
        "message": "管理者情報を登録しました",
        "data": admin_info_to_response(admin),
    }
