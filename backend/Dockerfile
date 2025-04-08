FROM python:3.9-slim

WORKDIR /app

# システムの依存関係をインストール
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Python パッケージをインストール
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY . .

# Google Cloud 認証ファイルのパーミッションを設定
RUN chmod 600 google_vision_key.json

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]