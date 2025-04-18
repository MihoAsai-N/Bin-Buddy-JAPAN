"""FastAPI アプリケーションのエントリーポイント。CORS設定およびルーターを含む。"""

# import os # 今は未使用
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# 既存ルーターの読み込み
from routers import classify, checkout, admin_info, area_search,llm_support

# .envファイルの読み込み
load_dotenv()

app = FastAPI()

# CORSミドルウェアの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーターをアプリケーションに含める
app.include_router(classify.router)
app.include_router(area_search.router)
app.include_router(checkout.router)
app.include_router(admin_info.router)
app.include_router(llm_support.router)

# ルート確認用
@app.get("/")
def read_root():
    return {"message": "お前は今、正しくFastAPIに辿り着いた"}

# 起動用（Dockerには不要だけどローカルで便利）
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
