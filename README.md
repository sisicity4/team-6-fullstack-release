# PetFit — 小さな「反撃」から運動習慣を支えるアプリ

運動をできなかった日を責めるのではなく、理由を記録して20〜60秒の小さな行動に切り替える習慣化アプリです。ペットの状態と振り返りを通じて、無理のない再開を後押しします。

このリポジトリは、React のUIとDjango REST APIを1つのHTTPSサービスとして公開するための統合・リリース構成です。

## 主な体験

1. ホームで「今日はできた？」に答える
2. できなかった場合は、理由（時間・疲労感・気分・体力）と任意のメモを記録する
3. 理由に応じた20〜60秒の「反撃」行動を実行する
4. 直近7日・30日の傾向、最後の反撃、反撃率を振り返る
5. 記録の傾向をペットの元気・ご機嫌・空腹として表示する

## 現在の実装状況

| 領域 | 状況 |
| --- | --- |
| 運動できなかった理由の記録・反撃タイマー・振り返りUI | 実装済み |
| UI上の記録保存 | JWT認証済みユーザーのDjango DBへ保存 |
| JWT認証、目標、振り返り、運動・身体データのREST API | 実装済み |
| UIとAPIの接続 | 登録・ログイン、トークン更新、日次ログの保存・取得を実装済み |
| 「運動」「ショップ」「お世話」の下部ナビ | プレースホルダー |
| Apple Health等の外部サービス連携 | 未実装（保存元を表すフィールドのみ） |

> ログイン後の画面操作は、同一オリジンのDjango APIを呼び出します。JWTはログイン状態を維持するためブラウザに保存し、アクセストークンの期限切れ時はリフレッシュトークンで更新します。

## 技術構成

```text
React 19 + Vite
        │  build
        ▼
Django + WhiteNoise ── /api/ ── Django REST Framework + JWT
        │
        └── PostgreSQL（RenderではManaged Postgres）
```

- フロントエンド: React 19 / TypeScript / Vite
- バックエンド: Django 5.2 / Django REST Framework / Simple JWT
- 本番配信: Dockerのマルチステージビルド、WhiteNoise、Gunicorn
- デプロイ構成: Render Blueprint + PostgreSQL
- 継続的検証: GitHub Actions（lint、型検査、build、依存関係監査、APIテスト、production設定検査）

UIとAPIを同一オリジンにまとめることで、CORS設定とデプロイ先を必要最小限にしています。

## ローカルで動かす

前提: Node.js 22系、Python 3.12系

### 1. 環境変数を用意する

```sh
cd backend
cp ../.env.example .env
```

ローカルでは既定でSQLiteを使います。`.env` はGitに追加しないでください。

### 2. APIを起動する

```sh
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

APIのヘルスチェックは <http://127.0.0.1:8000/api/health/> です。

### 3. UIを起動する

別のターミナルで実行します。

```sh
cd frontend
npm ci
npm run dev
```

表示されたURL（通常は <http://localhost:5173> ）を開きます。

## APIの概要

すべてのAPIは `/api/` 配下です。`/api/health/` とユーザー登録・ログイン以外は、JWTによる認証が必要です。

| 用途 | エンドポイント |
| --- | --- |
| ヘルスチェック | `GET /api/health/` |
| 登録・ログイン・トークン更新 | `POST /api/register/` / `POST /api/login/` / `POST /api/token/refresh/` |
| 目標 | `POST /api/goals/create/` / `GET /api/goals/` |
| プロフィール | `GET, POST /api/profile/` |
| 日次ログ・振り返り | `GET, POST /api/reflections/` |
| 運動記録・集計 | `POST /api/workouts/` / `GET /api/workouts/summary/` |
| 身体指標 | `POST /api/body-metrics/` |

認証が必要なリクエストには `Authorization: Bearer <access_token>` を付けます。

`POST /api/reflections/` は `log_date` をキーに同日の記録を更新します。理由ID、反撃秒数、メモ、成功状態を構造化して保存します。

## 検証

```sh
cd frontend && npm ci && npm run lint && npm run typecheck && npm run build && npm audit --omit=dev
cd ../backend && DEBUG=true SECRET_KEY=local-only-secret python3 manage.py test
```

GitHub Actionsでも、pull requestと`main`へのpushで同じ観点の検証に加え、production相当の `python manage.py check --deploy` を実行します。

## Renderへのデプロイ

1. RenderでこのリポジトリからBlueprintを作成する
2. `render.yaml` に従ってWebサービスとPostgreSQLを作成する
3. Renderが生成する `SECRET_KEY` を非公開のまま管理する

起動時にマイグレーションを適用し、`/api/health/` をヘルスチェックに使います。`DEBUG=false`、HTTPSリダイレクト、HSTSはRender構成で有効です。

## ディレクトリ構成

```text
.
├── frontend/          # React UI
├── backend/           # Django API
├── Dockerfile          # UIのビルドとDjango実行をまとめるイメージ
├── render.yaml         # Render Blueprint
└── .github/workflows/  # CI
```

## リリースの来歴

- UI: `Tech-Jam-KDG-2026-Winter/Team-6-React-frontend` の `develop` ブランチ（`facd5d6`）を基に統合
- API: `Tech-Jam-KDG-2026-Winter/Team-6-Django-backend` の `main` ブランチ（`ab1bd43`）を基に統合

統合リリースには不要なネストした `node_modules`、ビルド成果物、無関係なバックエンドブランチは含めていません。
