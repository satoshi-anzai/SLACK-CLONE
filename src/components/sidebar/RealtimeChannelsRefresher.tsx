"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/browser";

/**
 * channels テーブル (新規作成 / 削除 / メンバー変更) を購読し、
 * 検知時に router.refresh() でサイドバーを再フェッチさせる。
 * これにより他ユーザーが新規チャンネル/DM を作ったときに自分の sidebar に反映される。
 */
export function RealtimeChannelsRefresher() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const sub = supabase
      .channel("sidebar-channels")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "channels" },
        () => {
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, [router]);

  return null;
}
