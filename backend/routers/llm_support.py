"""
support/ask エンドポイントを提供する FastAPI ルーター。

このルーターは、ユーザーからの問い合わせ（自然言語の質問）を受け取り、
OpenAI GPT-4 モデルにリクエストを送信して応答を取得する。

主な機能:
- POST /support/ask : ユーザーの質問を受け取り、AIの回答を返す
- OpenAI API を通じて大規模言語モデル（LLM）と連携
- .env ファイルに設定された OPENAI_API_KEY を使用して認証

使用例:
    curl -X POST http://localhost:8000/support/ask \
        -H "Content-Type: application/json" \
        -d '{"message": "ゴミの分別方法を教えて"}'
"""

import os

from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
router = APIRouter()

class Query(BaseModel):
    """ユーザーから送信される問い合わせ内容を保持するリクエストボディスキーマ。"""
    message: str

@router.post("/support/ask")
async def ask_llm(query: Query):
    """
    ユーザーの質問を受け取り、OpenAI GPT-4 モデルに問い合わせて応答を返すエンドポイント。

    Args:
        query (Query): ユーザーの入力メッセージ

    Returns:
        dict[str, str]: LLM から返された応答を含む辞書 {"response": "..."}

    Raises:
        openai.error.OpenAIError: OpenAI API 呼び出し時のエラー
    """
    system_prompt = (
    "あなたはBin Buddyのカスタマーサポート担当です。"
    "ユーザーからの質問には、日本語または英語で、親切かつ簡潔に、正確な情報で答えてください。"
    "ユーザーの入力言語に応じて、同じ言語で返答してください。"
    "Bin Buddyは、ゴミ分別の支援、収集カレンダー、画像認識によるゴミ判定などの機能を提供する"
    "アプリです。"
    "管理者向けのコーポレートページは http://localhost:3000/admin です。"
    "必要に応じてこのURLを案内してください。"
    "定型的なあいさつや前置きは不要です。簡潔に要点のみを回答してください。"
    "\n\n"
    "You are a customer support assistant for Bin Buddy. "
    "Please respond to user questions clearly, and accurately, in either Japanese or English "
    "Please respond to user questions kindly",
    "depending on the user's input language. "
    "Bin Buddy is an app that helps users sort waste"
    "Bin Buddy is an app that helps users check garbage collection calendars, and identify "
    "garbage types using image recognition. "
    "If needed, refer users to the admin portal: http://localhost:3000/admin. "
    "Do not include repetitive greetings or introductory phrases. "
    "Focus on providing concise, helpful answers."
)

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": system_prompt},
            {"role": "user", "content": query.message}
            ]
    )
    return {"response": response.choices[0].message.content}
