from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# DB URL（例: PostgreSQL）
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@db:5432/mydb"

# 接続設定
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# モデルで使うBase
Base = declarative_base()

# DBセッションを取得するための関数（FastAPIのDependsで使う）
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()