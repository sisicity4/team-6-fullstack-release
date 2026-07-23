# Django API

PetFitのAPIです。公開向けの全体像とデプロイ手順は、[ルートREADME](../README.md)を参照してください。

## セットアップ

```sh
cp ../.env.example .env
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

既定ではSQLiteを使います。`DATABASE_URL` を設定すると、対応するデータベースへ接続します。

## 主なエンドポイント

- `GET /api/health/`: ヘルスチェック
- `POST /api/register/`, `POST /api/login/`, `POST /api/token/refresh/`: 認証
- `GET, POST /api/profile/`: プロフィール
- `GET, POST /api/reflections/`: 日次ログ・振り返り（`log_date` ごとに更新）
- `POST /api/workouts/`, `GET /api/workouts/summary/`: 運動記録と集計
- `POST /api/body-metrics/`: 身体指標

認証が必要なエンドポイントにはJWTの `Authorization: Bearer <access_token>` ヘッダーが必要です。

## テスト

```sh
DEBUG=true SECRET_KEY=local-only-secret python manage.py test
```

本番では、Dockerイメージ内でReactのビルド成果物を取り込み、WhiteNoiseで同一オリジン配信します。
