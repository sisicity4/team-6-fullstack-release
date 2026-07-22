## セットアップ手順

1. このディレクトリへ移動
   `cd Team-6-react-frontend/Team-6-react-frontend`
2. 依存関係をインストール
   `npm install`

## 開発サーバー

- `npm run dev` — Viteの開発サーバーを起動し、`http://localhost:5173`（またはログに表示されたURL）をブラウザで開いて動作確認します。

## その他のスクリプト

- `npm run build` — 本番ビルドを生成
- `npm run preview` — ビルド成果物をローカル静的サーバーで確認
- `npm run lint` — ESLintでコード品質をチェック

※ 上記のコマンドはすべて `Team-6-react-frontend/Team-6-react-frontend` の中で実行してください。

## フォルダーファイル構成と役割

- `src/pages/` — 各画面（Home/Reason Input/Battle/Reflectionなど）のコンポーネント
- `src/components/` — BottomNavや共通のCard、StatusGaugeなどの汎用UI
- `src/components/ui/` — 再利用性の高いUI部品（カード枠・ゲージなど）
- `src/data/` — 理由リストやナビゲーションデータのモック定義
- `src/api/` — 将来的なDjango API呼び出しラッパー
- `src/assets/` — SVGや画像
- `src/types.ts` — Screen／Reason／PetStatusなどの型定義

## 開発時のポイント

1. `npm run dev` でサーバーを立ち上げ、画面下部の `現在 screen: ...` インジケーターを見ながら操作すれば、どの画面に遷移したかが視覚的に追えます。
2. `src/App.tsx` の `screen` による制御（`HomePage` → `ReasonInputPage` → `CounterActionPage` → `ReflectionPage`）を活用し、必要に応じて新しいscreenを追加。
3. Django APIとの連携は `src/api/` にfetchヘルパーを作って置き、`src/data/` のモックを差し替えていく形で進めます。
4. 認証トークンや履歴はlocalStorageまたはcontextを使って保持する設計です。
