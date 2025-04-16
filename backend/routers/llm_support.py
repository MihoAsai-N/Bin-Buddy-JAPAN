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
import openai

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

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
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": query.message}]
    )
    return {"response": response.choices[0].message["content"]}
