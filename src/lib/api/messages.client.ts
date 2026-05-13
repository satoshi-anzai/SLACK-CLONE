import { createClient } from "@/lib/supabase/browser";
import {
  MESSAGE_SELECT,
  toMessage,
  type MessageRow,
} from "@/lib/api/messages.shared";
import type { Message } from "@/lib/types";

export interface SendMessageArgs {
  channelId: string;
  body: string;
  parentMessageId?: string | null;
}

export async function sendMessage(
  args: SendMessageArgs,
): Promise<{ error?: string }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "ログインが必要です" };

  const { error } = await supabase.from("messages").insert({
    channel_id: args.channelId,
    body: args.body,
    author_id: user.id,
    parent_message_id: args.parentMessageId ?? null,
  });
  if (error) return { error: error.message };
  return {};
}

export async function fetchMessageById(id: string): Promise<Message | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("messages")
    .select(MESSAGE_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return toMessage(data as unknown as MessageRow);
}

export async function fetchThreadRepliesClient(
  parentMessageId: string,
): Promise<Message[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("messages")
    .select(MESSAGE_SELECT)
    .eq("parent_message_id", parentMessageId)
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return (data as unknown as MessageRow[]).map(toMessage);
}
