from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import Dict
from google.cloud import vision

router = APIRouter()

# Google Cloud Vision API クライアントの初期化
client = vision.ImageAnnotatorClient()

class ClassifyResponse(BaseModel):
    """画像分類APIのレスポンスモデル"""
    predictions: Dict[str, float]
    best_match: str | None

@router.post("/api/classify", response_model=ClassifyResponse)
async def classify_image(image_file: UploadFile = File(...)):
    """画像をアップロードして分類します."""
    try:
        content = await image_file.read()
        image = vision.Image(content=content)

        response = client.annotate_image({"image": image, "features": [{"type": vision.Feature.Type.LABEL_DETECTION}]})
        labels = response.label_annotations

        predictions = {}
        for label in labels:
            predictions[label.description] = label.score

        # 最も可能性の高いラベルを特定
        best_match = max(predictions, key=predictions.get) if predictions else None

        return {"predictions": predictions, "best_match": best_match}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"画像処理エラー: {e}")