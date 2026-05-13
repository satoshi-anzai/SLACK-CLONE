"use client";

import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("(app) error boundary:", error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <h2 className="text-xl font-bold text-gray-900">
        画面を読み込めませんでした
      </h2>
      <p className="max-w-md text-sm text-gray-600">
        サーバー側でエラーが発生しました。スキーマ未適用、Supabase 接続不可、
        または RLS ポリシー違反の可能性があります。dev サーバーのコンソールに
        詳細が出力されています。
      </p>
      {error.message && (
        <pre className="max-w-xl overflow-auto rounded bg-gray-100 px-3 py-2 text-left text-xs text-gray-700">
          {error.message}
        </pre>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-2 rounded bg-slack-blue px-4 py-2 text-sm font-semibold text-white hover:bg-slack-blue-hover"
      >
        再試行
      </button>
    </div>
  );
}
