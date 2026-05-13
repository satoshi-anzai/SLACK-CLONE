import { createClient } from "@/lib/supabase/server";
import { logSupabaseError } from "@/lib/api/_log";
import type { Channel } from "@/lib/types";

interface ChannelRow {
  id: string;
  name: string;
  kind: "channel" | "dm";
  is_private: boolean;
  topic: string | null;
  dm_members?: string[] | null;
}

function toChannel(row: ChannelRow): Channel {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind,
    isPrivate: row.is_private,
    topic: row.topic ?? undefined,
    dmMembers: row.dm_members ?? undefined,
  };
}

export async function fetchChannels(): Promise<Channel[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("channels")
    .select("id, name, kind, is_private, topic")
    .eq("kind", "channel")
    .order("name");
  if (error) {
    logSupabaseError("fetchChannels error:", error);
    return [];
  }
  return data.map(toChannel);
}

export async function fetchDMs(): Promise<Channel[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("channels")
    .select("id, name, kind, is_private, topic, dm_members")
    .eq("kind", "dm")
    .contains("dm_members", [user.id])
    .order("created_at", { ascending: true });
  if (error) {
    logSupabaseError("fetchDMs error:", error);
    return [];
  }
  return data.map(toChannel);
}

export async function fetchChannel(id: string): Promise<Channel | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("channels")
    .select("id, name, kind, is_private, topic, dm_members")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    logSupabaseError("fetchChannel error:", error);
    return undefined;
  }
  return data ? toChannel(data as ChannelRow) : undefined;
}
