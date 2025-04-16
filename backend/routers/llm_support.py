import os

from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
import openai

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter()

class Query(BaseModel):
    message: str

@router.post("/support/ask")
async def ask_llm(query: Query):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": query.message}]
    )
    return {"response": response.choices[0].message["content"]}
