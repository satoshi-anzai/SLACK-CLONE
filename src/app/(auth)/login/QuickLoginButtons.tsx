"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { ensureTestUser } from "./actions";

interface TestUser {
  email: string;
  password: string;
  displayName: string;
  avatarColor: string;
}

// 開発用の固定テストユーザー
// ensureTestUser (server action + admin API) で初回に email_confirm=true で作成 → メール送信なし
const TEST_USERS: TestUser[] = [
  { email: "anzai@acme.app",  password: "password123", displayName: "安西 智史",     avatarColor: "#E01E5A" },
  { email: "taro@acme.app",   password: "password123", displayName: "Taro Yamada",   avatarColor: "#2BAC76" },
  { email: "hanako@acme.app", password: "password123", displayName: "Hanako Suzuki", avatarColor: "#ECB22E" },
  { email: "alex@acme.app",   password: "password123", displayName: "Alex Kim",      avatarColor: "#1164A3" },
];

export function QuickLoginButtons() {
  const router = useRouter();
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async (user: TestUser) => {
    setLoadingEmail(user.email);
    setError(null);

    // 1. Admin API でユーザーを確実に作成 (なければ作る)
    const ensure = await ensureTestUser({
      email: user.email,
      password: user.password,
      displayName: user.displayName,
    });
    if (!ensure.ok) {
      setError(ensure.error);
      setLoadingEmail(null);
      return;
    }

    // 2. クライアント側でログイン (auth cookie をブラウザにセット)
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    });
    if (signInError) {
      setError(`signIn 失敗: ${signInError.message}`);
      setLoadingEmail(null);
      return;
    }

    router.push("/c_general");
    router.refresh();
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-3 text-[11px] uppercase tracking-wider text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        <span>テスト用クイックログイン</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {TEST_USERS.map((user) => {
          const isLoading = loadingEmail === user.email;
          return (
            <button
              key={user.email}
              type="button"
              onClick={() => handleClick(user)}
              disabled={loadingEmail !== null}
              className="flex items-center gap-2 rounded border border-gray-200 px-3 py-2 text-left text-sm text-gray-800 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-60"
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-bold text-white"
                style={{ backgroundColor: user.avatarColor }}
                aria-hidden
              >
                {user.displayName.charAt(0)}
              </span>
              <span className="truncate">
                {isLoading ? "ログイン中…" : user.displayName}
              </span>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="mt-2 rounded bg-red-50 px-2 py-1 text-xs text-red-700">
          {error}
        </p>
      )}
      <p className="mt-2 text-[11px] text-gray-400">
        パスワード共通 <code className="font-mono">password123</code>。初回クリックで Admin API が確実に作成 (メール送信なし)。
      </p>
    </div>
  );
}
