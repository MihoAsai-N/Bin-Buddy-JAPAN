from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.models import Municipality
from db.session import get_db
from utils.converters import municipality_to_response  # ★ 追加

router = APIRouter()

@router.get("/municipalities/{code}")
def get_municipality(code: str, db: Session = Depends(get_db)):
    municipality = db.query(Municipality).filter(Municipality.municipality_code == code).first()
    if not municipality:
        raise HTTPException(status_code=404, detail="Municipality not found")
    return municipality_to_response(municipality)
