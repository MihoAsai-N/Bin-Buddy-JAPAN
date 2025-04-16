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
    instruction_prompt = (
    "あなたはBin Buddyのカスタマーサポート担当です。"
    "ユーザーの質問には、親切かつ簡潔に、正確な情報で答えてください。"
    "あいさつやアプリの紹介文（Bin Buddyはゴミ分別をサポートするアプリです 等）は、"
    "ユーザーが明確に求めた場合のみ返答してください。"
    "それ以外のときは、冒頭に説明を入れず、いきなり回答を始めてください。"
    "回答は1つにまとめて、分割しないでください。"

    "You are a customer support assistant for Bin Buddy."
    "Respond clearly and kindly."
    "Use either Japanese or English based on the user's input."
    "Avoid greetings and introductory phrases."
    "Do not begin with general explanations of the app unless specifically asked."
    )

    app_knowledg_prompt = (
    "BinBuddyは、外国人居住者を主な対象としたゴミ分別支援アプリであり、"
    "AI画像認識・回収日カレンダー・地域設定・視覚的ガイド・多言語対応・直感的なUIといった機能を備えています。"
    "これらにより、日本語が不自由な方でもスムーズにゴミ分別が行えます。"

    "また、BinBuddyは言語の壁・文化の違い・地域社会との調和といった課題の解決を目指し、"
    "共生社会の実現と環境への貢献にも力を入れています。"

    "管理者向けのポータル（http://localhost:3000/admin）では、"
    "新規登録・ログイン・自治体情報の登録や編集が可能です。"

    "ユーザーからのお問い合わせや導入相談には、フォームまたは info@binbuddy.jp で対応可能です。"

    "アプリは10,000以上ダウンロードされており、50以上の自治体に対応、ユーザー評価は4.8/5です。"

    "BinBuddy is a waste sorting support app designed primarily for foreign residents in Japan."
    "It includes AI image recognition and a garbage collection calendar."
    "Regional settings, visual guides, and multilingual support are also available."
    "An intuitive UI is also available."

    "The app addresses language barriers, cultural differences, and local rules."
    "It provides helpful tools and guidance to support users in their daily waste sorting."
    "This promotes inclusion and encourages care for the environment."

    "The admin portal allows registration, login, and management of municipal data."
    "It can be accessed at http://localhost:3000/admin."

    "For inquiries or implementation support, users can contact us via the form"

    "BinBuddy has over 10,000 downloads, supports 50+ municipalities, and has a 4.8/5 user rating."

    )


    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": instruction_prompt},
            {"role": "user", "content": (
                f"{query.message}\n\n"
                "以下は参考情報です。必要に応じて活用してください：\n"
                f"{app_knowledg_prompt}"
                )
            },
            ]
    )
    return {"response": response.choices[0].message.content}
