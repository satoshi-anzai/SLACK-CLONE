"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { MessageItem } from "@/components/message/MessageItem";
import { MessageComposer } from "@/components/message/MessageComposer";
import { useThread } from "@/components/message/ThreadContext";
import { createClient } from "@/lib/supabase/browser";
import {
  fetchMessageById,
  fetchThreadRepliesClient,
} from "@/lib/api/messages.client";
import type { Message } from "@/lib/types";

export function ThreadPane() {
  const { openMessageId, close } = useThread();
  const [parent, setParent] = useState<Message | null>(null);
  const [replies, setReplies] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // 親メッセージと返信を読み込み
  useEffect(() => {
    if (!openMessageId) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchMessageById(openMessageId),
      fetchThreadRepliesClient(openMessageId),
    ]).then(([p, r]) => {
      if (cancelled) return;
      setParent(p);
      setReplies(r);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [openMessageId]);

  // Realtime: この親への返信を購読
  useEffect(() => {
    if (!openMessageId) return;
    const supabase = createClient();
    const sub = supabase
      .channel(`thread:${openMessageId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `parent_message_id=eq.${openMessageId}`,
        },
        async (payload) => {
          const id = (payload.new as { id: string }).id;
          const full = await fetchMessageById(id);
          if (!full) return;
          setReplies((prev) =>
            prev.find((m) => m.id === full.id) ? prev : [...prev, full],
          );
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(sub);
    };
  }, [openMessageId]);

  if (!openMessageId) return null;

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 px-4">
        <div>
          <h2 className="text-[15px] font-bold">スレッド</h2>
        </div>
        <button
          type="button"
          onClick={close}
          className="rounded p-1 text-gray-500 hover:bg-gray-100"
          aria-label="Close thread"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="px-5 py-3 text-sm text-gray-500">読み込み中…</div>
        )}
        {parent && (
          <>
            <div className="border-b border-gray-200 pb-2">
              <MessageItem message={parent} showHeader hideThreadAffordance />
            </div>
            {replies.length > 0 && (
              <div className="flex items-center gap-3 px-5 py-2 text-xs text-gray-500">
                <span>{replies.length} 件の返信</span>
                <span className="h-px flex-1 bg-gray-200" />
              </div>
            )}
            {replies.map((r) => (
              <MessageItem
                key={r.id}
                message={r}
                showHeader
                hideThreadAffordance
              />
            ))}
            {replies.length === 0 && !loading && (
              <div className="px-5 py-6 text-center text-sm text-gray-500">
                まだ返信はありません。最初の返信をどうぞ。
              </div>
            )}
          </>
        )}
        {!loading && !parent && (
          <div className="px-5 py-6 text-sm text-gray-500">
            メッセージが見つかりませんでした。
          </div>
        )}
      </div>

      {parent && (
        <div className="shrink-0 border-t border-gray-200">
          <MessageComposer
            channelId={parent.channelId}
            parentMessageId={parent.id}
            placeholder="スレッドに返信"
            compact
          />
        </div>
      )}
    </div>
  );
}
