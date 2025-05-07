# DEVELOPER_SETUP.md

## ステップ 1: `.sql` ファイルを DB コンテナにコピー

以下のコマンドを**ローカルのPowerShell**から実行して、ホスト上の `.sql` ファイルを PostgreSQL の Docker コンテナにコピーします。

```powershell
docker cp backend/db/seed_admin_info.sql section9_binbuddy-db-1:/tmp/seed_admin_info.sql
docker cp backend/db/seed_municipalities.sql section9_binbuddy-db-1:/tmp/seed_municipalities.sql
```

> `section9_binbuddy-db-1` は `docker ps` で確認できる **PostgreSQL コンテナ名**です。

---

## ステップ 2: DB に対して SQL を実行

次に、以下のコマンドでコンテナ内の SQL ファイルを実行して、DB にデータを挿入します。

```powershell
docker compose exec db psql -U user -d mydb -f /tmp/seed_admin_info.sql
docker compose exec db psql -U user -d mydb -f /tmp/seed_municipalities.sql
```

- `-U user`: DBのユーザー名
- `-d mydb`: データベース名

---

## 注意事項

- すでに同じ UID のデータが存在している場合、`duplicate key value violates unique constraint` エラーが出ます。
  - 対処法:
    - データを一度削除: `DELETE FROM admin_info;`
    - または `.sql` ファイルの UID を変更
- SQL ファイルの中身を変更した場合、再度 `docker cp` でコピーしなおしてください。
- Alembic マイグレーションは事前に `alembic upgrade head` を済ませてください。

---

_最終更新日: 2025-05-07_

---

## ステップ 3: Stripe CLI の立ち上げ

### 目的

Stripe Webhook をローカルで受け取って FastAPI バックエンドに転送するために使用します。

### 手順

#### 1. Stripe CLI を起動

以下のコマンドを実行し、Webhook を FastAPI バックエンドへ転送します（ポート8000想定）:

```bash
stripe listen --forward-to localhost:8000/webhook
```

#### 2. `.env` 設定（必要に応じて）

`.env` ファイルに以下のようにWebhookシークレットキーを設定してください:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### 3. 注意事項

- `stripe` コマンドが見つからない場合は、[Stripe CLI公式ページ](https://stripe.com/docs/stripe-cli) を参照してインストールしてください。
- `stripe listen` 実行後に表示される `whsec_...` を `.env` に反映してください。
