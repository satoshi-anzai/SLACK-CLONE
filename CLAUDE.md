# CLAUDE.md

このリポジトリで作業する Claude Code 向けのガイドです。

## プロジェクト概要

Slack 風のチャットアプリ (学習・プロトタイプ用)。
フロントの UI はモックで一通り完成済み。これから **Supabase でバックエンドをつなげていく** フェーズ。

## 技術スタック

- **Framework**: Next.js (App Router) + React 19
- **言語**: TypeScript (strict)
- **スタイリング**: Tailwind CSS
- **アイコン**: lucide-react
- **状態管理**: `useState` / Context のみ。必要になったら zustand
- **バックエンド**: Supabase (Auth / DB / Realtime)
  - クライアント: `@supabase/supabase-js` + `@supabase/ssr`
  - 開発環境: Supabase CLI + Docker でローカル起動 (`supabase start`)
  - スキーマ管理: **ダッシュボードで手動**。Claude は SQL を提示するだけで適用はしない

## 現フェーズのスコープ

含む:
- フロント UI (実装済)
- ログイン / サインアップ画面 (UI 実装済)
- Supabase Auth による認証
- channels / messages / users の DB 永続化
- メッセージ送信
- Realtime 購読 (チャンネル + スレッド)
- **スレッド返信** (右ペイン、`messages.parent_message_id` で親子関係。MessageItem hover の💬で開く)
- DM (既存チャンネルと同じ仕組み。`channels.kind = 'dm'` で扱う)

含まない (依頼があるまで実装しない):
- DM 新規作成 / マルチパーティ DM、メンション、リアクション、ファイル添付、検索、通知

## ディレクトリ構成

```
src/
  app/
    layout.tsx
    globals.css
    (app)/                    // チャット UI (AppShell 適用)
      layout.tsx
      page.tsx                // /c_general に redirect
      not-found.tsx
      [channelId]/page.tsx
    (auth)/                   // ログイン/サインアップ (単独レイアウト)
      layout.tsx
      login/                  // page.tsx + LoginForm + QuickLoginButtons
      signup/page.tsx
  components/
    layout/                   // AppShell, Sidebar の開閉, ヘッダー
    sidebar/                  // Sidebar, ChannelList, LogoutButton
    message/                  // ChannelHeader, MessageList, MessageItem, MessageComposer
  lib/
    types/                    // Channel / Message / User
    utils.ts
    supabase/                 // (新設予定) browser.ts / server.ts の client factory
    api/                      // fetchChannels など。Supabase クエリへ段階的に差し替え
    mock/                     // ★削除しない。シードのソースとして残す

scripts/
  seed.ts                     // (新設予定) mock を Supabase に流し込む
```

## 環境変数 (`.env.local`)

- `NEXT_PUBLIC_SUPABASE_URL` — ローカルは `http://localhost:54321`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — `supabase status` で確認
- `SUPABASE_SERVICE_ROLE_KEY` — **サーバー専用**。`NEXT_PUBLIC_` を絶対に付けない
- `SUPABASE_ACCESS_TOKEN` — Supabase CLI 用 (既存)

## 開発コマンド

```bash
npm run dev        # 開発サーバー (http://localhost:3000)
npm run build
npm run lint
npm run typecheck

supabase start     # ローカル Supabase 起動
supabase status    # URL / キー確認
supabase stop
supabase db reset  # ローカル DB リセット
```

ローカル Studio: `http://localhost:54323`

> npm を使用 (`pnpm` 未インストール)。手動構成済 (ディレクトリ名 `claudeMD` のため `create-next-app` 不可)

## コーディング規約

- **TypeScript**: `any` 禁止。`unknown` + 型ガード
- **コンポーネント**: 関数 + named export、1 ファイル 1 主要コンポーネント
- **Server / Client**: デフォルト Server Component。インタラクションだけ `"use client"`
- **import**: `@/` エイリアス
- **コミット**: Conventional Commits

### Supabase
- **データ取得は API 層 (`src/lib/api/`) に集約**。コンポーネントから `supabase.from(...)` を直接呼ばない
- **client factory の使い分け**:
  - Server Component / Route Handler → `lib/supabase/server.ts`
  - Client Component → `lib/supabase/browser.ts`
  - service role が必要な処理 → サーバー側で都度生成。ブラウザに渡らないよう注意
- **RLS は必ず有効化**。クライアントは anon key で動かす
- **`{ data, error }` の error を握り潰さない**

## Slack ライク UI のデザインメモ

- 配色: Slack Aubergine (`#3F0E40`) + アクセント `#1164A3` (Tailwind theme で `slack-*` 定義済)
- フォント: Lato / system-ui
- サイドバー 260px 固定、md 未満ではドロワー

## Claude への指示

- **モック → Supabase の差し替えは段階的に**。`src/lib/api/*` のシグネチャを保ち、内部実装だけ替える。UI 側は触らずに済むように
- **モックは削除しない** (シード用に残す)
- **未実装機能を勝手に作らない**。スコープ外は依頼があるまで触らない
- **スキーマ変更**: SQL を提示するだけで Claude 自身は適用しない。「Studio の SQL Editor で実行してください」と依頼する
- **新テーブル提案時は RLS ポリシーもセットで**
- **service role key を Client Component や `NEXT_PUBLIC_*` に渡さない**
- UI 変更後は `npm run dev` でブラウザ確認、Supabase 変更後は `npm run typecheck`
