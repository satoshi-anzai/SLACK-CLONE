import type { Message, User } from "@/lib/types";
import { formatTime } from "@/lib/utils";

export function MessageItem({
  message,
  author,
  showHeader,
}: {
  message: Message;
  author: User | undefined;
  showHeader: boolean;
}) {
  const initial = author?.displayName?.[0] ?? "?";
  return (
    <div className="group flex gap-3 px-5 py-1 hover:bg-gray-50">
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
      <div className="flex-1 min-w-0">
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
      </div>
    </div>
  );
}
