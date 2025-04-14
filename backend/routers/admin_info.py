from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

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
    return admin_info

@router.put("/admin-info")
async def update_admin_info(request: Request):
    global admin_info
    data = await request.json()
    admin_info.update(data)
    return admin_info
