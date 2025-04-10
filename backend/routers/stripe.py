import os
from fastapi import APIRouter, HTTPException, Request
import stripe
from dotenv import load_dotenv

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter()

# Stripe決済用のエンドポイント
@router.post("/create-payment-intent")
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
@router.post("/webhook")
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
