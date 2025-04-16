"""Stripe決済用のエンドポイント定義。支払いインテントの作成とWebhookの処理を行う。"""

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
    """
    クライアント側でのカード決済のための PaymentIntent を作成し、
    client_secret を返す。
    
    Returns:
        dict[str, str | None]: PaymentIntent の client_secret を含む辞書
    """
    try:
        intent = stripe.PaymentIntent.create(
            amount=120000,
            currency="jpy",
            payment_method_types=["card"]
        )
        return {"clientSecret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

# Stripe Webhook受信用のエンドポイント
@router.post("/webhook")
async def stripe_webhook(request: Request):
    """
    Stripeから送信されたWebhookリクエストを検証・処理するエンドポイント。

    Args:
        request (Request): FastAPIのリクエストオブジェクト（Webhookのペイロードとヘッダーを含む）

    Returns:
        dict[str, str]: 処理が成功した場合は {"status": "success"} を返す

    Raises:
        HTTPException: Webhookの署名検証やイベント処理に失敗した場合に 400 を返す
    """
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
