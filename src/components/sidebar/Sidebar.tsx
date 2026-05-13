import { ChevronDown, Edit3 } from "lucide-react";
import { ChannelList } from "@/components/sidebar/ChannelList";
import { LogoutButton } from "@/components/sidebar/LogoutButton";
import { RealtimeChannelsRefresher } from "@/components/sidebar/RealtimeChannelsRefresher";
import { fetchChannels, fetchDMs } from "@/lib/api/channels";
import { fetchUsers, fetchCurrentUser } from "@/lib/api/users";

export async function Sidebar() {
  const [channels, dms, users, me] = await Promise.all([
    fetchChannels(),
    fetchDMs(),
    fetchUsers(),
    fetchCurrentUser(),
  ]);

  const usersById = Object.fromEntries(users.map((u) => [u.id, u]));

  // DM 行を「相手側ユーザー」情報付きに enrich (viewer 視点での表示名・アバター)
  const dmRows = dms.map((dm) => {
    const otherId = (dm.dmMembers ?? []).find((id) => id !== me?.id);
    const other = otherId ? usersById[otherId] : undefined;
    return {
      ...dm,
      name: other?.displayName ?? dm.name,
      user: other,
    };
  });

  return (
    <div className="flex h-full w-full flex-col bg-slack-aubergine text-slack-sidebar-text">
      <RealtimeChannelsRefresher />
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-1 text-white">
          <span className="text-[15px] font-bold">Acme Workspace</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
        <button
          className="rounded-full bg-white/30 p-1.5 text-white/70 disabled:cursor-not-allowed"
          aria-label="New message"
          title="新規メッセージ (未実装 — DM の + ボタンから作成してください)"
          disabled
        >
          <Edit3 className="h-3.5 w-3.5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 text-[15px]">
        <ChannelList title="Channels" items={channels} addType="channel" />
        <ChannelList title="Direct messages" items={dmRows} addType="dm" />
      </nav>

      <LogoutButton currentUser={me} />
    </div>
  );
}
