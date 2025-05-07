"""
地域情報取得に関するAPIルーター。

このモジュールでは、郵便番号や英語表記の地域名に基づいて、
対応する地域情報をデータベースから取得し、JSON形式で返却するAPIエンドポイントを提供します。

エンドポイント:
- GET /areas: 郵便番号から地域名のリストを取得
- GET /area/{area_en}: 英語表記の地域名から日本語の地域名を取得

使用するモデル:
- AreaZipcodeHigashi（郵便番号と地域名の対応情報）

レスポンス形式はPydanticモデルで定義されており、APIの自動ドキュメントにも対応しています。
"""

from typing import List
from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from backend.db.database import get_db  # 使ってるDBのセッション取得関数
from backend.db.models import AreaZipcodeHigashi

router = APIRouter()

class AreaInfo(BaseModel):
    """
    地域情報（日本語名と英語表記）のスキーマ。
    """
    area: str
    area_en: str

class AreaResponse(BaseModel):
    """
    地域情報リストのレスポンススキーマ。
    """
    areas: List[AreaInfo]

@router.get("/areas", response_model=AreaResponse)
async def get_areas(zipcode: str, db: Session = Depends(get_db)):
    """
    郵便番号から対応する地域情報を取得するエンドポイント。

    Args:
        zipcode (str): 検索対象の郵便番号
        db (Session): SQLAlchemyのDBセッション（自動依存注入）

    Returns:
        dict: 地域情報のリスト（日本語名・英語表記）

    Raises:
        HTTPException: 郵便番号が存在しない場合は 404 を返す
    """
    rows = db.query(AreaZipcodeHigashi).filter(
        AreaZipcodeHigashi.zipcode == zipcode
    ).all()

    if not rows:
        raise HTTPException(status_code=404, detail="Postal code not found")

    area_info_list = [AreaInfo(area=row.area, area_en=row.area_en) for row in rows]
    return {"areas": area_info_list}

@router.get("/area/{area_en}")
async def get_area_by_area_en(area_en: str, db: Session = Depends(get_db)):
    """
    英語表記の地域名から、日本語の地域名を取得するエンドポイント。

    Args:
        area_en (str): 英語表記の地域名
        db (Session): SQLAlchemyのDBセッション（自動依存注入）

    Returns:
        dict: 対応する地域名（日本語）

    Raises:
        HTTPException: 該当する地域が存在しない場合は 404 を返す
    """
    row = db.query(AreaZipcodeHigashi).filter(
        AreaZipcodeHigashi.area_en == area_en
    ).first()

    if not row:
        raise HTTPException(status_code=404, detail="Area not found")
    return {"area": row.area}
