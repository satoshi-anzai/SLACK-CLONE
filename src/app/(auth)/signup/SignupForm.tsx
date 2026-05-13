"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/browser";

export function SignupForm() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Studio で email confirmation が ON の場合、session は null になる
    if (!data.session) {
      setError(
        "メール確認が必要な設定です。Studio の Authentication → Providers で email confirmation を OFF にしてください",
      );
      setLoading(false);
      return;
    }

    router.push("/c_general");
    router.refresh();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="displayName"
          className="mb-1 block text-sm font-semibold text-gray-700"
        >
          表示名
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          autoComplete="name"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Taro Yamada"
          className="w-full rounded border border-gray-300 px-3 py-2 text-[15px] outline-none focus:border-slack-blue"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-semibold text-gray-700"
        >
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded border border-gray-300 px-3 py-2 text-[15px] outline-none focus:border-slack-blue"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-semibold text-gray-700"
        >
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="6 文字以上"
          className="w-full rounded border border-gray-300 px-3 py-2 text-[15px] outline-none focus:border-slack-blue"
        />
      </div>

      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-slack-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-slack-blue-hover disabled:opacity-60"
      >
        {loading ? "作成中…" : "アカウント作成"}
      </button>
    </form>
  );
}
