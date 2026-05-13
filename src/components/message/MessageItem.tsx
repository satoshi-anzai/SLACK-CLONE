"use client";

import { MessageSquare } from "lucide-react";
import type { Message } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import { useThread } from "@/components/message/ThreadContext";

export function MessageItem({
  message,
  showHeader,
  hideThreadAffordance = false,
}: {
  message: Message;
  showHeader: boolean;
  /** スレッドペイン内では返信ボタンや件数表示は不要 */
  hideThreadAffordance?: boolean;
}) {
  const { open } = useThread();
  const author = message.author;
  const initial = author?.displayName?.[0] ?? "?";
  const replyCount = message.replyCount ?? 0;

  return (
    <div className="group relative flex gap-3 px-5 py-1 hover:bg-gray-50">
      {!hideThreadAffordance && (
        <div className="absolute -top-3 right-5 z-10 hidden rounded border border-gray-200 bg-white shadow-sm group-hover:flex">
          <button
            type="button"
            onClick={() => open(message.id)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
            aria-label="Reply in thread"
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="w-9 shrink-0">
        {showHeader ? (
          <div
            className="flex h-9 w-9 items-center justify-center rounded text-sm font-bold text-white"
            style={{ backgroundColor: author?.avatarColor ?? "#999" }}
          >
            {initial}
          </div>
        ) : (
          <div className="hidden h-full items-center justify-center text-[10px] text-gray-400 group-hover:flex">
            {formatTime(message.createdAt)}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        {showHeader && (
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-bold text-gray-900">
              {author?.displayName ?? "Unknown"}
            </span>
            <span className="text-xs text-gray-500">
              {formatTime(message.createdAt)}
            </span>
          </div>
        )}
        <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-gray-900">
          {message.body}
        </p>
        {!hideThreadAffordance && replyCount > 0 && (
          <button
            type="button"
            onClick={() => open(message.id)}
            className="mt-1 flex items-center gap-1.5 rounded border border-transparent px-1.5 py-0.5 text-xs font-semibold text-slack-blue hover:border-gray-300 hover:bg-white"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {replyCount} 件の返信
          </button>
        )}
      </div>
    </div>
  );
}
