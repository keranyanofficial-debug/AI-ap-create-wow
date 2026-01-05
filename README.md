# Habit Gacha（習慣ガチャ）

毎日1分で「人生がちょっと進むタスク」を引く習慣化アプリのMVPです。Next.js(App Router) + TypeScript + Tailwind + shadcn/ui + Supabaseで構成しています。

## 特徴
- 毎日1件だけのタスクを生成（LLM or ローカルテンプレ）
- 完了でXP付与、連続記録（streak）更新
- 履歴カレンダーで完了日を可視化
- 週次ふりかえりサマリを自動生成
- 投稿用カード画像（PNG）を生成して共有

## セットアップ

### 1. Supabaseプロジェクトの作成
1. Supabaseで新規プロジェクトを作成
2. SQL Editorで `schema.sql` を実行
3. Auth → Providersで Email を有効化

### 2. 環境変数
`.env.local` を作成して以下を設定してください。

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=... # optional
OPENAI_MODEL=gpt-4o-mini
```

### 3. 依存関係のインストール

> **npm install が 403 になる場合の対処**
>
> このリポジトリは標準の npm レジストリを使用しますが、企業プロキシや
> セキュリティポリシーでブロックされることがあります。以下の順に確認してください。
>
> 1. npm のレジストリ設定が正しいか確認
> ```
> npm config get registry
> ```
> 期待値: `https://registry.npmjs.org/`
>
> 2. レジストリを明示的に設定
> ```
> npm config set registry https://registry.npmjs.org/
> ```
>
> 3. プロキシが設定されている場合は見直し
> ```
> npm config get proxy
> npm config get https-proxy
> ```
>
> 4. 社内ネットワーク制限がある場合
>    - 許可されたレジストリに npm を向ける
>    - セキュリティチームに `registry.npmjs.org` の許可を依頼
>
> 5. それでも失敗する場合
>    - `npm login` が必要な場合があります
>    - キャッシュを削除して再実行: `npm cache clean --force`

```
npm install
```

### 4. 起動

```
npm run dev
```

`http://localhost:3000` を開いて確認してください。

## 画面構成

- `/app` : 今日のタスクカード、完了・共有導線
- `/history` : 月表示カレンダーと完了履歴
- `/weekly` : 週次ふりかえりの生成画面
- `/settings` : 通知時間（MVPではOFF）、テーマ切替、OAuth設定ガイド

## トラブルシュート

- **ログインできない**: SupabaseのEmail認証が有効か確認してください。
- **タスクが生成されない**: `schema.sql` を再実行してテーブルとRLSを確認してください。
- **OpenAIが動かない**: `OPENAI_API_KEY` が未設定の場合は自動でローカルテンプレにフォールバックします。

## セキュリティ/脆弱性チェックの改善案

MVP段階でも、以下の改善を推奨します。

### 1. 依存関係の脆弱性検査を固定化
- `npm audit --production` をリリース前に必ず実施
- CI/CD に `npm audit --production` を組み込み、失敗時はリリースを止める

### 2. RLS検証の自動化
- SupabaseのRLSをローカル/プレビューで自動検証するSQLテストを追加
- `auth.uid()` と `user_id` が一致しない操作が拒否されることを確認

### 3. シークレット管理の強化
- `OPENAI_API_KEY` は `.env.local` だけに置く
- `NEXT_PUBLIC_` で露出するキーは絶対に使わない
- 本番環境ではSecrets Manager（Vercel/Infra）に移行

### 4. 監査ログ/追跡性
- Supabaseのログ監査機能を有効化
- 共有カード生成APIへのアクセスログを保存（回数制限にも利用可能）

## 開発メモ

- LLMのモデルは `OPENAI_MODEL` で差し替え可能です。
- 共有カードは `/api/share-card/today` でPNGを返します。
