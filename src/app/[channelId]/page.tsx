import { notFound } from "next/navigation";
import { ChannelHeader } from "@/components/message/ChannelHeader";
import { MessageList } from "@/components/message/MessageList";
import { MessageComposer } from "@/components/message/MessageComposer";
import { fetchChannel } from "@/lib/api/channels";

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const { channelId } = await params;
  const channel = await fetchChannel(channelId);
  if (!channel) notFound();

  return (
    <div className="flex h-full flex-col">
      <ChannelHeader channel={channel} />
      <div className="flex-1 overflow-hidden">
        <MessageList channelId={channelId} />
      </div>
      <MessageComposer channelName={channel.name} />
    </div>
  );
}
