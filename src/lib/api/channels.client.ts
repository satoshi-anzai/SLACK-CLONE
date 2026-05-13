import { createClient } from "@/lib/supabase/browser";

function genId(prefix: "c" | "dm") {
  return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
}

export async function createChannel(args: {
  name: string;
  topic?: string;
  isPrivate?: boolean;
}): Promise<{ id?: string; error?: string }> {
  const supabase = createClient();
  const id = genId("c");
  const { error } = await supabase.from("channels").insert({
    id,
    name: args.name.trim(),
    kind: "channel",
    is_private: args.isPrivate ?? false,
    topic: args.topic?.trim() || null,
    dm_members: [],
  });
  if (error) return { error: error.message };
  return { id };
}

export async function createOrGetDM(
  otherUserId: string,
): Promise<{ id?: string; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "ログインが必要です" };
  if (user.id === otherUserId) return { error: "自分自身に DM はできません" };

  // 既存の per-pair DM を検索 (両方の id を含む dm 行)
  const { data: existing } = await supabase
    .from("channels")
    .select("id, dm_members")
    .eq("kind", "dm")
    .contains("dm_members", [user.id, otherUserId])
    .maybeSingle();
  if (existing) return { id: existing.id };

  // 相手の display_name を name に保存 (ただし表示時は viewer 視点で再計算するため最終的には参考値)
  const { data: other } = await supabase
    .from("users")
    .select("display_name")
    .eq("id", otherUserId)
    .maybeSingle();

  const id = genId("dm");
  const { error } = await supabase.from("channels").insert({
    id,
    name: other?.display_name ?? "DM",
    kind: "dm",
    is_private: false,
    topic: null,
    dm_members: [user.id, otherUserId],
  });
  if (error) return { error: error.message };
  return { id };
}
