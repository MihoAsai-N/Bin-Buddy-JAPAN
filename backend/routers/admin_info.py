"""
admin_info.py

管理者情報の取得・更新に関する FastAPI ルーター。
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from fastapi import APIRouter, Request, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.utils.converters import admin_info_to_response
from backend.db.models import AdminInfo
from backend.db.session import get_db

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


CAMEL_TO_SNAKE = {
    "municipalityCode": "municipality_code",
    "municipalityName": "municipality_name",
    "furigana": "furigana",
    "postalCode": "postal_code",
    "address": "address",
    "department": "department",
    "contactPerson": "contact_person",
    "phoneNumber": "phone_number",
    "email": "email",
    "paymentStatus": "payment_status",
    "lastLogin": "last_login",
    "note": "note",
}


@router.get("/admin-info")
def get_admin_info(
    uid: str = Query(..., description="FirebaseのUID"), db: Session = Depends(get_db)
):
    """
    指定されたUIDに対応する管理者情報を取得するエンドポイント。

    Returns:
        dict: データベースから取得した管理者情報（キャメルケース形式）

    Raises:
        HTTPException: 管理者情報が存在しない場合は 404 を返す。
    """
    admin = db.query(AdminInfo).filter(AdminInfo.uid == uid).first()
    if not admin:
        raise HTTPException(status_code=404, detail="管理者情報が見つかりません")
    return admin_info_to_response(admin)


@router.put("/admin-info")
async def update_admin_info(
    request: Request,
    uid: str = Query(..., description="FirebaseのUID"),
    db: Session = Depends(get_db),
):
    """
    管理者情報を更新するエンドポイント。

    Args:
        request (Request): 更新データを含むリクエスト

    Returns:
        dict: 更新後の管理者情報
    """
    print("✅ PUT /admin-info エンドポイントに到達しました")

    try:
        data = await request.json()

    except Exception as e:
        print("❌ JSONパース失敗:", str(e))
        raise HTTPException(status_code=400, detail="不正なJSONです") from e

    admin = db.query(AdminInfo).filter(AdminInfo.uid == uid).first()
    if not admin:
        print("⚠️ UIDに該当する管理者が見つかりません")
        raise HTTPException(status_code=404, detail="管理者情報が見つかりません")

    for camel_key, value in data.items():
        snake_key = CAMEL_TO_SNAKE.get(camel_key)

        if snake_key and hasattr(admin, snake_key):
            setattr(admin, snake_key, value)

    db.commit()
    db.refresh(admin)

    return {
        "message": "管理者情報を更新しました",
        "data": admin_info_to_response(admin),
    }


@router.post("/admin-info")
async def create_admin_info(admin_data: AdminInfoCreate, db: Session = Depends(get_db)):
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
