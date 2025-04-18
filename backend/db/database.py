# backend/db/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base

import os
from dotenv import load_dotenv

load_dotenv()

# .env または docker-compose.yml に記載したDB接続情報を使います
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/mydb")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# セッションを取得する依存関数（FastAPI用）
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
