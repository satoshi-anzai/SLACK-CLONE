# CLAUDE.md

このリポジトリで作業する Claude Code 向けのガイドです。

## プロジェクト概要

Slack 風のチャットフロントエンドを構築する学習・プロトタイプ用プロジェクト。
現フェーズではバックエンドを持たず、モックデータで UI を完成させることを目的とする。

## 技術スタック

- **Framework**: Next.js (App Router) + React 19
- **言語**: TypeScript (strict)
- **スタイリング**: Tailwind CSS
- **UI コンポーネント**: shadcn/ui (Radix UI ベース)
- **アイコン**: lucide-react
- **状態管理**: 当面は React の `useState` / `useReducer` のみ。グローバル状態が必要になった時点で zustand を検討
- **データ**: `src/lib/mock/` 配下の TypeScript モジュールで提供するモックデータ。API 呼び出しは将来差し替えやすいよう `src/lib/api/` のフェッチ関数経由で読む

## 現フェーズのスコープ

含む:
- 左サイドバーのチャンネル一覧表示
- チャンネル選択時のメッセージタイムライン表示
- 基本レイアウト (Slack の 3 ペイン構造: サイドバー / メイン / 右ペインの枠)

含まない (将来):
- メッセージ送信、スレッド返信
- DM、メンション、絵文字リアクション
- ファイル添付、検索、通知
- 認証、リアルタイム通信

スコープ外の機能は **依頼があるまで実装しない**。先回りで雛形を増やさない。

## ディレクトリ構成 (実装済み)

```
src/
  app/
    layout.tsx              // ルートレイアウト (AppShell をここで適用)
    page.tsx                // "/" は /c_general に redirect
    [channelId]/page.tsx    // チャンネル本体ページ
    not-found.tsx           // 404
    globals.css             // Tailwind + 最小グローバル
  components/
    layout/
      AppShell.tsx          // 3 ペイン構造の枠
      WorkspaceHeader.tsx   // 上部の検索バー含むヘッダー
    sidebar/
      Sidebar.tsx           // ワークスペース名 + 一覧セクション
      ChannelList.tsx       // 折りたたみ可能なチャンネル/DM リスト (client)
    message/
      ChannelHeader.tsx     // # channel-name + topic
      MessageList.tsx       // 日付区切り + 連続発言のグルーピング
      MessageItem.tsx       // 1 メッセージ
      MessageComposer.tsx   // 入力欄 (現フェーズは disabled)
  lib/
    types/index.ts          // Channel / Message / User の型
    utils.ts                // cn, formatTime, formatDateLabel
    mock/                   // users.ts, channels.ts, messages.ts
    api/                    // fetchChannels, fetchMessages — モック return
```

## 開発コマンド

```bash
npm run dev        # 開発サーバー (http://localhost:3000)
npm run build      # 本番ビルド
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

> 本環境では `pnpm` が未インストールのため `npm` を採用 (`package.json` の `name` は `slack-clone-frontend`)。
> 初期セットアップは `create-next-app` ではなく手動構成済み (ディレクトリ名に大文字 `claudeMD` を含むため npm の name 制約を回避)。

## コーディング規約

- **TypeScript**: `any` 禁止。`unknown` + 型ガードを使う
- **コンポーネント**: 関数コンポーネント + named export。1 ファイル 1 主要コンポーネント
- **Server / Client**: デフォルトは Server Component。インタラクションがあるものだけ `"use client"`
- **スタイル**: Tailwind ユーティリティを直接書く。`className` の長文化は `clsx` / `cn` で整理
- **shadcn/ui**: 現フェーズでは未導入 (純 Tailwind + lucide-react で十分な範囲のため)。必要になった時点で `npx shadcn@latest add <component>` で追加し、`src/components/ui/` に置く
- **import パス**: `@/` エイリアスを使う (相対パス `../../` は避ける)
- **コミット**: Conventional Commits (`feat:`, `fix:`, `refactor:` …)

## Slack ライク UI のデザインメモ

- 配色は Slack の Aubergine テーマを基準 (サイドバー: 濃紫 `#3F0E40`, アクセント: `#1164A3`)。Tailwind の theme 拡張で `slack-aubergine` 等の名前で定義
- フォントは Slack 同様 Lato / system-ui スタックで十分
- サイドバー幅は固定 (260px 程度)、メインは可変、右ペインは折りたたみ可能
- メッセージ行は hover でアクションバー表示 (将来用)

## Claude への指示

- **モックの差し替えやすさを優先**。コンポーネントはデータ取得関数を props か Server Component の fetch で受け取り、UI から直接モックを import しない
- **未実装機能を勝手に作らない**。「リアクション」「スレッド」などスコープ外と書かれているものは、依頼があるまで触らない
- **新しいファイル/ライブラリの追加は最小限**。既存ファイルを編集できる場合は編集を優先
- **`src/components/ui/` の編集は避ける**。shadcn の再生成で消える前提
- UI 変更後は `npm run dev` でブラウザ確認するか、確認できない場合はその旨を明示する
