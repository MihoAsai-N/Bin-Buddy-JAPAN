# グループ開発環境構築手順 

## 【前提】
- Docker 使用
- PostgreSQL
- backend: FastAPI + Alembic + SQLAlchemy
- frontend: Next.js (React)
- DB管理に DBeaver

---

## 【ディレクトリ構成】
```
project-root/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── db/
│   │   └── models.py
│   ├── alembic.ini
│   ├── alembic/
│   │   ├── versions/
│   │   └── env.py
│   ├── requirements.txt
│   └── main.py
├── frontend/
│   ├── Dockerfile
│   └── src/
└── .env
```

---

## 【Step 1: docker-compose.yml作成】
```yaml
db:
  image: postgres:13
  environment:
    POSTGRES_USER: user
    POSTGRES_PASSWORD: password
    POSTGRES_DB: mydb
  ports:
    - "5432:5432"
  volumes:
    - db-data:/var/lib/postgresql/data

backend:
  build:
    context: ./backend
  volumes:
    - ./backend:/app
  ports:
    - "8000:8000"
  environment:
    DATABASE_URL: postgresql://user:password@db:5432/mydb
  depends_on:
    - db

frontend:
  build:
    context: ./frontend
  ports:
    - "3000:3000"
  volumes:
    - ./frontend/src:/app/src
  depends_on:
    - backend

volumes:
  db-data:
```

---

## 【Step 2: PostgreSQLの確認項目】
- ユーザ名, パスワード, DB名の調整
- `alembic.ini` の `sqlalchemy.url` には docker-compose基準:
```ini
sqlalchemy.url = postgresql://user:password@db:5432/mydb
```
- DBeaverでは次の設定:
  - host: `localhost`
  - port: `5432`
  - DB: `mydb`
  - user: `user`
  - password: `password`

---

## 【Step 3: FastAPI + Alembic】
1. `backend/venv` から:
```
pip install alembic psycopg2-binary
```

2. Alembic初期化
```
alembic init alembic
```

3. `env.py`を修正
```python
from db.models import Base
from app.db.models import Base
```

4. `target_metadata = Base.metadata`に設定

---

## 【Step 4: モデルの作成 & Migration】

1. `models.py`にテーブル定義

2. Migration script 作成:
```
alembic revision --autogenerate -m "initial tables"
```

3. DBへ適用:
```
alembic upgrade head
```

---

## 【Step 5: CSVデータのインポート】
1. DBeaver で DBに接続
2. テーブルを取得 or 作成
3. 右クリック → "Import Data"
4. CSVを選択
5. "Auto generate table" は注意 (型推定が簡易のため)

---

## 【Step 6: 開発サーバー起動】
```
docker compose up --build
```

FastAPI: `http://localhost:8000`
Next.js: `http://localhost:3000`
DBeaver: `localhost:5432` の mydb に接続

---

## 【Tips】
- docker-compose.yml の `db` 名を DBeaver では `localhost`
- Alembic migration 前に model/テーブル確認
