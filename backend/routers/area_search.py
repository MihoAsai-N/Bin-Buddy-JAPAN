from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict
from db.database import get_db  # 使ってるDBのセッション取得関数
from db.models import AreaZipcodeHigashi

router = APIRouter()

class AreaInfo(BaseModel):
    area: str
    area_en: str

class AreaResponse(BaseModel):
    areas: List[AreaInfo]

@router.get("/areas", response_model=AreaResponse)
async def get_areas(zipcode: str, db: Session = Depends(get_db)):
    rows = db.query(AreaZipcodeHigashi).filter(
        AreaZipcodeHigashi.zipcode == zipcode
    ).all()

    if not rows:
        raise HTTPException(status_code=404, detail="Postal code not found")

    area_info_list = [AreaInfo(area=row.area, area_en=row.area_en) for row in rows]
    return {"areas": area_info_list}

@router.get("/area/{area_en}")
async def get_area_by_area_en(area_en: str, db: Session = Depends(get_db)):
    row = db.query(AreaZipcodeHigashi).filter(
        AreaZipcodeHigashi.area_en == area_en
    ).first()

    if not row:
        raise HTTPException(status_code=404, detail="Area not found")
    return {"area": row.area}