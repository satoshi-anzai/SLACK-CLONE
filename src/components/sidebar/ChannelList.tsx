"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Hash, Lock, Plus } from "lucide-react";
import type { Channel } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ChannelList({
  title,
  items,
  canAdd = false,
}: {
  title: string;
  items: Channel[];
  canAdd?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="mb-2">
      <div className="flex items-center justify-between px-2 py-1 text-[13px] font-medium text-white/70">
        <button
          className="flex items-center gap-1 rounded px-1 py-0.5 hover:bg-slack-sidebar-hover"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
          <span>{title}</span>
        </button>
        {canAdd && (
          <button
            className="rounded p-1 text-white/60 hover:bg-slack-sidebar-hover hover:text-white"
            aria-label={`Add ${title}`}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && (
        <ul>
          {items.map((c) => {
            const href = `/${c.id}`;
            const active = pathname === href;
            const unread = (c.unreadCount ?? 0) > 0;
            return (
              <li key={c.id}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-[3px] text-[15px]",
                    active
                      ? "bg-slack-aubergine-active text-white"
                      : "hover:bg-slack-sidebar-hover",
                    !active && unread && "font-bold text-white",
                    !active && !unread && "text-slack-sidebar-text",
                  )}
                >
                  {c.kind === "channel" ? (
                    c.isPrivate ? (
                      <Lock className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <Hash className="h-3.5 w-3.5 shrink-0" />
                    )
                  ) : (
                    <span
                      className="inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-400"
                      aria-hidden
                    />
                  )}
                  <span className="flex-1 truncate">{c.name}</span>
                  {unread && !active && (
                    <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                      {c.unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
