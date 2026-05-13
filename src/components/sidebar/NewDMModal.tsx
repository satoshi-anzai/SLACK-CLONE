"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { createOrGetDM } from "@/lib/api/channels.client";
import type { User } from "@/lib/types";

interface UserRow {
  id: string;
  display_name: string;
  avatar_color: string;
  status: User["status"];
  name: string;
}

export function NewDMModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [meId, setMeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      setMeId(user?.id ?? null);

      const { data } = await supabase
        .from("users")
        .select("id, name, display_name, avatar_color, status")
        .order("display_name");
      if (cancelled) return;
      setUsers((data ?? []) as UserRow[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePick = async (otherId: string) => {
    setCreatingId(otherId);
    setError(null);
    const { id, error: dmError } = await createOrGetDM(otherId);
    if (dmError) {
      setError(dmError);
      setCreatingId(null);
      return;
    }
    onClose();
    router.push(`/${id}`);
    router.refresh();
  };

  const others = users.filter((u) => u.id !== meId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white text-gray-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h2 className="text-lg font-bold">DM を始める</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {loading && (
            <div className="px-3 py-4 text-sm text-gray-500">読み込み中…</div>
          )}
          {!loading && others.length === 0 && (
            <div className="px-3 py-4 text-sm text-gray-500">
              他のユーザーがいません。別アカウントで signup してください。
            </div>
          )}
          {others.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => handlePick(u.id)}
              disabled={creatingId !== null}
              className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-60"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-xs font-bold text-white"
                style={{ backgroundColor: u.avatar_color }}
                aria-hidden
              >
                {u.display_name[0]}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-semibold">{u.display_name}</span>
                <span className="truncate text-xs text-gray-500">
                  {u.name}
                </span>
              </div>
              {creatingId === u.id && (
                <span className="text-xs text-gray-500">開いています…</span>
              )}
            </button>
          ))}
        </div>

        {error && (
          <p className="mx-5 mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
