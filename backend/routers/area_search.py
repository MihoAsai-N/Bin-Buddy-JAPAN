from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter()

area_data = [
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北34条東1丁目～15丁目", "connect_address": "札幌市東区北34条東1丁目～15丁目", "zipcode": "070834"},
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北35条東1丁目～15丁目", "connect_address": "札幌市東区北35条東1丁目～15丁目", "zipcode": "070835"},
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北36条東1丁目～15丁目", "connect_address": "札幌市東区北36条東1丁目～15丁目", "zipcode": "070836"},
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北37条東1丁目～15丁目", "connect_address": "札幌市東区北37条東1丁目～15丁目", "zipcode": "070837"},
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北38条東1丁目～15丁目", "connect_address": "札幌市東区北38条東1丁目～15丁目", "zipcode": "070838"},
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北39条東1丁目～15丁目", "connect_address": "札幌市東区北39条東1丁目～15丁目", "zipcode": "070839"},
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北40条東1丁目～15丁目", "connect_address": "札幌市東区北40条東1丁目～15丁目", "zipcode": "070840"},
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北41条東1丁目～15丁目", "connect_address": "札幌市東区北41条東1丁目～15丁目", "zipcode": "070841"},
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北42条東1丁目～15丁目", "connect_address": "札幌市東区北42条東1丁目～15丁目", "zipcode": "070842"},
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北43条東1丁目～15丁目", "connect_address": "札幌市東区北43条東1丁目～15丁目", "zipcode": "070843"},
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北44条東1丁目～15丁目", "connect_address": "札幌市東区北44条東1丁目～15丁目", "zipcode": "070844"},
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北45条東1丁目～15丁目", "connect_address": "札幌市東区北45条東1丁目～15丁目", "zipcode": "070845"},
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北46条東1丁目～15丁目", "connect_address": "札幌市東区北46条東1丁目～15丁目", "zipcode": "070846"},
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北47条東1丁目～15丁目", "connect_address": "札幌市東区北47条東1丁目～15丁目", "zipcode": "070847"},
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北48条東1丁目～15丁目", "connect_address": "札幌市東区北48条東1丁目～15丁目", "zipcode": "070848"},
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北49条東1丁目～15丁目", "connect_address": "札幌市東区北49条東1丁目～15丁目", "zipcode": "070849"},
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北50条東1丁目～15丁目", "connect_address": "札幌市東区北50条東1丁目～15丁目", "zipcode": "070850"},
    {"area": "東区①", "area_en": "Higashi-ku District No.1", "address1": "札幌市東区", "address2": "北51条東1丁目～15丁目", "connect_address": "札幌市東区北51条東1丁目～15丁目", "zipcode": "070851"},
    {"area": "東区②", "area_en": "Higashi-ku District No.2", "address1": "札幌市東区", "address2": "北34条東16丁目～30丁目", "connect_address": "札幌市東区北34条東16丁目～30丁目", "zipcode": "070834"},
    {"area": "東区②", "area_en": "Higashi-ku District No.2", "address1": "札幌市東区", "address2": "北35条東16丁目～30丁目", "connect_address": "札幌市東区北35条東16丁目～30丁目", "zipcode": "070835"},
    {"area": "東区②", "area_en": "Higashi-ku District No.2", "address1": "札幌市東区", "address2": "北36条東16丁目～30丁目", "connect_address": "札幌市東区北36条東16丁目～30丁目", "zipcode": "070836"},
    {"area": "東区②", "area_en": "Higashi-ku District No.2", "address1": "札幌市東区", "address2": "北37条東16丁目～30丁目", "connect_address": "札幌市東区北37条東16丁目～30丁目", "zipcode": "070837"},
    {"area": "東区②", "area_en": "Higashi-ku District No.2", "address1": "札幌市東区", "address2": "北38条東16丁目～30丁目", "connect_address": "札幌市東区北38条東16丁目～30丁目", "zipcode": "070838"},
    {"area": "東区②", "area_en": "Higashi-ku District No.2", "address1": "札幌市東区", "address2": "北39条東16丁目～30丁目", "connect_address": "札幌市東区北39条東16丁目～30丁目", "zipcode": "070839"},
    {"area": "東区②", "area_en": "Higashi-ku District No.2", "address1": "札幌市東区", "address2": "北40条東16丁目～30丁目", "connect_address": "札幌市東区北40条東16丁目～30丁目", "zipcode": "070840"},
]

class AreaInfo(BaseModel):
    area: str
    area_en: str

class AreaResponse(BaseModel):
    areas: List[AreaInfo]

@router.get("/areas", response_model=AreaResponse)
async def get_areas(postal_code: str):
    area_info_list = []
    for item in area_data:
        if item["zipcode"] == postal_code:
            area_info_list.append(AreaInfo(area=item["area"], area_en=item["area_en"]))

    if not area_info_list:
        raise HTTPException(status_code=404, detail="Postal code not found")
    return {"areas": area_info_list}