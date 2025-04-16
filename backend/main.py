from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import classify

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

# ルート確認用
@app.get("/")
def read_root():
    return {"message": "お前は今、正しくFastAPIに辿り着いた"}

# 起動用（Dockerには不要だけどローカルで便利）
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
