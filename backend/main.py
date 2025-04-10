from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import stripe

# 既存ルーターの読み込み
from routers import classify 

# .envファイルの読み込み
load_dotenv()

# Stripe秘密キーの設定
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

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

# Stripe決済用のエンドポイント
@app.post("/create-payment-intent")
async def create_payment_intent():
    try:
        intent = stripe.PaymentIntent.create(
            amount=2000,  # セント単位 (¥20)
            currency="jpy",
            payment_method_types=["card"]
        )
        return {"clientSecret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

# Stripe Webhook受信用のエンドポイント
@app.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Webhook署名が正しくありません") from exc

    # イベント処理例
    if event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        print(f"✅ 支払い成功: {payment_intent['id']}")

    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
