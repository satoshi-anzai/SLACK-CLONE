import { createClient } from "@/lib/supabase/server";
import {
  MESSAGE_SELECT,
  toMessage,
  type MessageRow,
} from "@/lib/api/messages.shared";
import { logSupabaseError } from "@/lib/api/_log";
import type { Message } from "@/lib/types";

export async function fetchMessages(channelId: string): Promise<Message[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select(MESSAGE_SELECT)
    .eq("channel_id", channelId)
    .is("parent_message_id", null)
    .order("created_at", { ascending: true });
  if (error) {
    logSupabaseError("fetchMessages error:", error);
    return [];
  }
  return (data as unknown as MessageRow[]).map(toMessage);
}

export async function fetchMessage(id: string): Promise<Message | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select(MESSAGE_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) {
    logSupabaseError("fetchMessage error:", error);
    return undefined;
  }
  return data ? toMessage(data as unknown as MessageRow) : undefined;
}

export async function fetchThreadReplies(
  parentMessageId: string,
): Promise<Message[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select(MESSAGE_SELECT)
    .eq("parent_message_id", parentMessageId)
    .order("created_at", { ascending: true });
  if (error) {
    logSupabaseError("fetchThreadReplies error:", error);
    return [];
  }
  return (data as unknown as MessageRow[]).map(toMessage);
}
