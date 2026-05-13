"use client";

import { useEffect, useState } from "react";
import { Hash, Lock } from "lucide-react";
import { MessageItem } from "@/components/message/MessageItem";
import { createClient } from "@/lib/supabase/browser";
import { fetchMessageById } from "@/lib/api/messages.client";
import type { Channel, Message } from "@/lib/types";
import { formatDateLabel } from "@/lib/utils";

const GROUP_THRESHOLD_MS = 5 * 60 * 1000;

function dateKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function ChannelStartBanner({ channel }: { channel: Channel }) {
  const Icon = channel.kind === "dm" ? null : channel.isPrivate ? Lock : Hash;
  const prefix = channel.kind === "channel" ? "#" : "";
  return (
    <div className="px-5 pb-2 pt-6">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded bg-slack-aubergine text-white">
        {Icon ? <Icon className="h-6 w-6" /> : <span className="text-xl font-bold">@</span>}
      </div>
      <h2 className="text-2xl font-extrabold text-gray-900">
        {prefix}
        {channel.name}
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        ここがチャンネル <span className="font-semibold">{prefix}{channel.name}</span> の始まりです。
        {channel.topic && <> このチャンネルは「{channel.topic}」のためのものです。</>}
      </p>
    </div>
  );
}

export function MessageList({
  channel,
  initialMessages,
}: {
  channel: Channel;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // チャンネル切替時に初期データへリセット
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Realtime: このチャンネルの新規メッセージ (top-level のみ) を購読
  useEffect(() => {
    const supabase = createClient();
    const sub = supabase
      .channel(`messages:${channel.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${channel.id}`,
        },
        async (payload) => {
          const id = (payload.new as { id: string }).id;
          const full = await fetchMessageById(id);
          if (!full || full.parentMessageId) return; // スレッド返信は除外
          setMessages((prev) =>
            prev.find((m) => m.id === full.id) ? prev : [...prev, full],
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, [channel.id]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col overflow-y-auto">
        <ChannelStartBanner channel={channel} />
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
          まだメッセージはありません。最初の一言をどうぞ。
        </div>
      </div>
    );
  }

  const rows: Array<
    | { type: "date"; key: string; label: string }
    | { type: "msg"; key: string; message: Message; showHeader: boolean }
  > = [];

  let lastDate: string | null = null;
  let lastAuthor: string | null = null;
  let lastTime = 0;

  messages.forEach((m) => {
    const dk = dateKey(m.createdAt);
    if (dk !== lastDate) {
      rows.push({
        type: "date",
        key: `d-${dk}`,
        label: formatDateLabel(m.createdAt),
      });
      lastDate = dk;
      lastAuthor = null;
      lastTime = 0;
    }
    const t = new Date(m.createdAt).getTime();
    const sameAuthor = m.authorId === lastAuthor;
    const closeInTime = t - lastTime < GROUP_THRESHOLD_MS;
    const showHeader = !(sameAuthor && closeInTime);

    rows.push({ type: "msg", key: m.id, message: m, showHeader });

    lastAuthor = m.authorId;
    lastTime = t;
  });

  return (
    <div className="flex h-full flex-col-reverse overflow-y-auto">
      <div>
        <ChannelStartBanner channel={channel} />
        {rows.map((row) => {
          if (row.type === "date") {
            return (
              <div
                key={row.key}
                className="relative my-3 flex items-center justify-center"
              >
                <div className="absolute inset-x-5 top-1/2 h-px bg-gray-200" />
                <span className="relative rounded-full border border-gray-200 bg-white px-3 py-0.5 text-xs font-bold text-gray-700">
                  {row.label}
                </span>
              </div>
            );
          }
          return (
            <MessageItem
              key={row.key}
              message={row.message}
              showHeader={row.showHeader}
            />
          );
        })}
      </div>
    </div>
  );
}
