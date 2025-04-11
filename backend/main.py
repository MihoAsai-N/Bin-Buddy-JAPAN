from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# 既存ルーターの読み込み
from routers import classify, stripe

# .envファイルの読み込み
load_dotenv()

app = FastAPI()

# CORSミドルウェアの設定 (フロントエンドからのリクエストを許可)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.jsの開発サーバーのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーターをアプリケーションに含める
app.include_router(classify.router)
app.include_router(stripe.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
