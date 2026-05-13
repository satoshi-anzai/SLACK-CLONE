"use client";

import { Bold, Italic, Paperclip, Smile, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { sendMessage } from "@/lib/api/messages.client";

export function MessageComposer({
  channelId,
  channelName,
  parentMessageId,
  placeholder,
  compact = false,
}: {
  channelId: string;
  channelName?: string;
  parentMessageId?: string;
  placeholder?: string;
  compact?: boolean;
}) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSend = value.trim().length > 0 && !sending;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSend) return;

    setSending(true);
    setError(null);
    const { error: sendError } = await sendMessage({
      channelId,
      body: value.trim(),
      parentMessageId,
    });
    setSending(false);

    if (sendError) {
      setError(sendError);
      return;
    }
    setValue("");
  };

  const ph =
    placeholder ??
    (parentMessageId
      ? "スレッドに返信"
      : channelName
        ? `Message #${channelName}`
        : "Message");

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? "px-3 py-2" : "border-t border-gray-200 px-5 py-3"}
    >
      <div className="rounded-md border border-gray-300 focus-within:border-gray-500">
        <div className="flex items-center gap-1 border-b border-gray-200 px-2 py-1 text-gray-500">
          <button type="button" className="rounded p-1 hover:bg-gray-100" disabled>
            <Bold className="h-4 w-4" />
          </button>
          <button type="button" className="rounded p-1 hover:bg-gray-100" disabled>
            <Italic className="h-4 w-4" />
          </button>
        </div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-3 py-2 text-[15px] outline-none placeholder:text-gray-400"
          placeholder={ph}
          disabled={sending}
        />
        <div className="flex items-center justify-between border-t border-gray-200 px-2 py-1 text-gray-500">
          <div className="flex items-center gap-1">
            <button type="button" className="rounded p-1 hover:bg-gray-100" disabled>
              <Paperclip className="h-4 w-4" />
            </button>
            <button type="button" className="rounded p-1 hover:bg-gray-100" disabled>
              <Smile className="h-4 w-4" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!canSend}
            className="rounded p-1 text-white disabled:bg-gray-200 disabled:text-gray-400 enabled:bg-slack-green enabled:hover:bg-slack-green/90"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-[11px] text-red-600">送信エラー: {error}</p>
      )}
    </form>
  );
}
