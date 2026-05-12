import { Hash, Lock, Star, Users } from "lucide-react";
import type { Channel } from "@/lib/types";

export function ChannelHeader({ channel }: { channel: Channel }) {
  const Icon =
    channel.kind === "dm" ? null : channel.isPrivate ? Lock : Hash;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 px-5">
      <div className="flex items-center gap-2">
        <h1 className="flex items-center gap-1.5 text-[18px] font-bold">
          {Icon && <Icon className="h-[18px] w-[18px]" />}
          {channel.name}
        </h1>
        <button
          className="rounded p-1 text-gray-500 hover:bg-gray-100"
          aria-label="Star"
        >
          <Star className="h-4 w-4" />
        </button>
        {channel.topic && (
          <span className="ml-3 truncate text-sm text-gray-500">
            {channel.topic}
          </span>
        )}
      </div>
      <button className="flex items-center gap-1 rounded border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-50">
        <Users className="h-4 w-4" />
        <span>members</span>
      </button>
    </header>
  );
}
