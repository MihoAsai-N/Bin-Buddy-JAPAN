# classify.py
from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import Dict, Optional  # Optional をインポート
from google.cloud import vision
import logging
# データベース操作用のライブラリ (例: SQLAlchemy)
# from sqlalchemy import create_engine, text
# from sqlalchemy.orm import sessionmaker

router = APIRouter()

# ロガーの設定 (上記と同様)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

# Google Cloud Vision API クライアントの初期化 (上記と同様)
client = vision.ImageAnnotatorClient()

class ClassifyResponse(BaseModel):
    """画像分類APIのレスポンスモデル"""
    predictions: Dict[str, float]
    best_match_label: Optional[str]  # Vision API の best match
    trash_category: Optional[str]    # データベースから検索したゴミの分類

# # データベースの接続情報 (実際の情報に置きかえる)
# DATABASE_URL = "your_database_url"
# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# # 分類一覧のテーブルモデル (実際のテーブル構造に合わせてください)
# class Classification(Base):
#     __tablename__ = "classifications"
#     id = Column(Integer, primary_key=True, index=True)
#     vision_label = Column(String, unique=True, index=True)
#     trash_category = Column(String)

@router.post("/api/classify", response_model=ClassifyResponse)
async def classify_image(image_file: UploadFile = File(...)):
    """画像をアップロードして分類し、ゴミの分類を検索します."""
    try:
        content = await image_file.read()
        image = vision.Image(content=content)
        response = client.annotate_image({"image": image, "features": [{"type": vision.Feature.Type.LABEL_DETECTION}]})
        labels = response.label_annotations
        predictions = {}
        for label in labels:
            predictions[label.description] = label.score
        best_match_label = max(predictions, key=predictions.get) if predictions else None

        logger.info(f"Vision API Best Match: {best_match_label}")

        trash_category = None
        if best_match_label:
            # # データベースから best_match_label に対応するゴミの分類を検索
            # db = next(get_db())
            # classification = db.query(Classification).filter(Classification.vision_label == best_match_label).first()
            # if classification:
            #     trash_category = classification.trash_category
            # else:
            #     logger.warning(f"データベースに '{best_match_label}' に対応する分類が見つかりませんでした。")
            #     trash_category = "unknown" # 見つからない場合は unknown などとする

            # **【モックデータでの対応 (実際のデータベース連携に置き換えてください)】**
            classification_map = {
                "Plastic": "Plastic",
                "Bottle": "Bottles",
                "Can": "Cans",
                "Paper": "Combustible",
                "Cardboard": "recyclable",
                "Food waste": "Combustible",
                "Garbage": "Combustible",
                "Glass": "Non-Combustible",
                "Metal": "Non-Combustible",
                "Battery": "hazardous",
                "Light bulb": "hazardous",
                "Tissue paper": "Combustible",
                # ... 他の分類
            }
            trash_category = classification_map.get(best_match_label, "unknown")
            logger.info(f"対応するゴミの分類: {trash_category}")

        return {"predictions": predictions, "best_match_label": best_match_label, "trash_category": trash_category}

    except Exception as e:
        logger.error(f"画像処理エラー: {e}")
        raise HTTPException(status_code=500, detail=f"画像処理エラー: {e}")