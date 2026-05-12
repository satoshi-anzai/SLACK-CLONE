import { ChevronDown, Edit3 } from "lucide-react";
import { ChannelList } from "@/components/sidebar/ChannelList";
import { fetchChannels, fetchDMs } from "@/lib/api/channels";

export async function Sidebar() {
  const [channels, dms] = await Promise.all([fetchChannels(), fetchDMs()]);

  return (
    <div className="flex h-full w-full flex-col bg-slack-aubergine text-slack-sidebar-text">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <button className="flex items-center gap-1 text-white">
          <span className="text-[15px] font-bold">Acme Workspace</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        <button
          className="rounded-full bg-white p-1.5 text-slack-aubergine hover:bg-white/90"
          aria-label="New message"
        >
          <Edit3 className="h-3.5 w-3.5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 text-[15px]">
        <ChannelList title="Channels" items={channels} canAdd />
        <ChannelList title="Direct messages" items={dms} canAdd />
      </nav>
    </div>
  );
}
