"""
database.py

このモジュールは、SQLAlchemy のエンジンとセッション生成を管理し、
FastAPI の依存関係注入に使用される get_db 関数を提供します。
"""

import os

from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
# from db.models import Base

from dotenv import load_dotenv

load_dotenv()

# .env または docker-compose.yml に記載したDB接続情報を使います
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/mydb")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# セッションを取得する依存関数（FastAPI用）
def get_db() ->  Generator[Session, None, None]:
    """
    データベースセッションを取得するためのFastAPI依存関数。

    Yields:
        Session: SQLAlchemyデータベースセッション。
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
