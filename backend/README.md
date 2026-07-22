# Team-6-Django-backend-feature-auth-goal-api

このディレクトリは Django API サービスを単独で管理するリポジトリです。React フロントエンドは別レポジトリで独立しており、`scripts/sync-react-to-django.sh` でビルド成果物を取り込んで `/app` で公開します。

## セットアップ
1. `cd Team-6-Django-backend-feature-auth-goal-api`
2. `python3 -m venv venv`
3. `source venv/bin/activate`
4. `pip install --break-system-packages -r requirements.txt`
5. `python manage.py migrate`

## 開発サーバー
- `python manage.py runserver 0.0.0.0:8000`
- `http://127.0.0.1:8000/api/` で DRF エンドポイント、`/app` で React SPA を提供します。

## React ビルド資産の取り込み
1. `scripts/sync-react-to-django.sh` を実行すると、React の `dist/` を Django のテンプレート・静的 assets にコピーし、`collectstatic` まで自動で回ります。
2. React 側のビルドは `Team-6-React-frontend/Team-6-react-frontend` で `npm run build` を手動またはスクリプトから実行してください。

## テスト
- `python manage.py test`

## 重要なパス
- `backend/static/app/assets/`：WhiteNoise で配信する React アセット
- `backend/templates/app/index.html`：React ルートを描画するテンプレート

このリポジトリ単体で API を開発しつつ、`scripts/sync-react-to-django.sh` を使って統合された `/app` を確認してください。
