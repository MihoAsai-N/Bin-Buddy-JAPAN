"""
support/ask エンドポイントを提供する FastAPI ルーター。

このルーターは、ユーザーからの問い合わせ（自然言語の質問）を受け取り、
OpenAI GPT-4 モデルにリクエストを送信して応答を取得する。

主な機能:
- POST /support/ask : ユーザーの質問を受け取り、AIの回答を返す
- FAISS を使ってナレッジベースから類似文を検索（RAG構成）
- OpenAI API を通じて大規模言語モデル（LLM）と連携
- .env ファイルに設定された OPENAI_API_KEY を使用して認証

使用例:
    curl -X POST http://localhost:8000/support/ask \
        -H "Content-Type: application/json" \
        -d '{"message": "ゴミの分別方法を教えて"}'
"""

import os
import json
import glob
import faiss
import numpy as np

from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
router = APIRouter()

# ナレッジベース読み込み（複数JSONファイルを統合）
documents = []
for file_path in glob.glob("knowledge/*.json"):
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        documents.extend([item["content"] for item in data])


# ベクトル埋め込み生成
def embed(text: str) -> list[float]:
    """
    単一のテキストをOpenAIのEmbedding APIでベクトル化し、リスト形式で返す。

    Args:
        text (str): ベクトル化するテキスト（1文）

    Returns:
        list[float]: ベクトル表現（FAISS用）
    """
    response = client.embeddings.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response.data[0].embedding


# FAISS インデックス構築（初期化）
doc_embeddings = [embed(doc) for doc in documents]
index = faiss.IndexFlatL2(len(doc_embeddings[0]))
index.add(np.array(doc_embeddings).astype("float32"))# type: ignore
#NOTE:VSCode の型チェッカー（Pylance や Pyright）による誤検知。無視しても機能上の問題はなし。
class Query(BaseModel):
    """ユーザーから送信される問い合わせ内容を保持するリクエストボディスキーマ。"""
    message: str

@router.post("/support/ask")
async def ask_llm(query: Query):
    """
    ユーザーの質問を受け取り、OpenAI GPT-4 モデルに問い合わせて応答を返すエンドポイント。
    質問内容に基づきナレッジベースから類似情報を検索し、プロンプトに組み込む（RAG構成）。
    """
    instruction_prompt = (
        "あなたはBin Buddyのカスタマーサポート担当です。"
        "ユーザーの質問には、親切かつ簡潔に、正確な情報で答えてください。"
        "あいさつやアプリの紹介文（Bin Buddyはゴミ分別をサポートするアプリです 等）は、"
        "ユーザーが明確に求めた場合のみ返答してください。"
        "それ以外のときは、冒頭に説明を入れず、いきなり回答を始めてください。"
        "回答は1つにまとめて、分割しないでください。"
        "Use either Japanese or English based on the user's input."
    )

    # ユーザー入力のベクトル化と検索
    input_vec = np.array([embed(query.message)]).astype("float32")
    _, I = index.search(input_vec, k=3) # type: ignore
    #NOTE:FAISS公式の例でも I が使われている。無視しても機能上の問題はなし。
    context_docs = "\n\n".join([documents[i] for i in I[0]])

    user_prompt = (
        f"以下は参考情報です。必要に応じて活用してください：\n{context_docs}\n\n"
        f"質問: {query.message}"
    )

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": instruction_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    return {"response": response.choices[0].message.content.strip()}