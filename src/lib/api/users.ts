import { createClient } from "@/lib/supabase/server";
import { logSupabaseError } from "@/lib/api/_log";
import type { User } from "@/lib/types";

interface UserRow {
  id: string;
  name: string;
  display_name: string;
  avatar_color: string;
  status: User["status"];
}

function toUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    displayName: row.display_name,
    avatarColor: row.avatar_color,
    status: row.status,
  };
}

export async function fetchUsers(): Promise<User[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, name, display_name, avatar_color, status")
    .order("display_name");
  if (error) {
    logSupabaseError("fetchUsers error:", error);
    return [];
  }
  return data.map(toUser);
}

export async function fetchCurrentUser(): Promise<User | undefined> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return undefined;

  const { data, error } = await supabase
    .from("users")
    .select("id, name, display_name, avatar_color, status")
    .eq("id", authUser.id)
    .maybeSingle();
  if (error) {
    logSupabaseError("fetchCurrentUser error:", error);
    return undefined;
  }
  return data ? toUser(data as UserRow) : undefined;
}
