# React UI

PetFitの画面UIです。プロダクトの概要と統合デプロイの手順は、[ルートREADME](../README.md)を参照してください。

## セットアップ

```sh
npm ci
npm run dev
```

通常は <http://localhost:5173> で確認できます。

## コマンド

```sh
npm run lint     # ESLint
npm run build    # 本番用ビルド
npm run preview  # ビルド結果の確認
```

## 現在の実装範囲

- ホーム、理由選択、短時間の反撃、振り返り画面を実装しています。
- 登録・ログイン後、日次ログはDjango APIを通じてユーザーごとに保存します。
- JWTのアクセストークンとリフレッシュトークンを使い、アクセストークンの期限切れ時は自動更新します。
- `POST /api/reflections/` は同日分を更新するため、今日の回答をやり直しても記録が重複しません。
- 下部ナビの「運動」「ショップ」「お世話」はプレースホルダーです。

## 構成

- `src/pages/`: 画面コンポーネント
- `src/components/`: 再利用するUI部品
- `src/data/`: 理由・ナビゲーションなどの静的データ
- `src/types.ts`: UIで使う型定義
- `src/api/`: 将来のAPI連携の置き場
