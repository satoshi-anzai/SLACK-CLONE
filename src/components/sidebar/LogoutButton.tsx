"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { User } from "@/lib/types";

export function LogoutButton({ currentUser }: { currentUser?: User }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2 border-t border-white/10 px-3 py-2">
      {currentUser ? (
        <>
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-bold text-white"
            style={{ backgroundColor: currentUser.avatarColor }}
            aria-hidden
          >
            {currentUser.displayName[0]}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[13px] font-semibold text-white">
              {currentUser.displayName}
            </span>
            <span className="truncate text-[11px] text-slack-sidebar-text">
              ログイン中
            </span>
          </div>
        </>
      ) : (
        <div className="flex-1 truncate text-[13px] text-slack-sidebar-text">
          未ログイン
        </div>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        title="ログアウト"
        className="rounded p-1.5 text-slack-sidebar-text hover:bg-white/10 hover:text-white disabled:opacity-60"
        aria-label="ログアウト"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
