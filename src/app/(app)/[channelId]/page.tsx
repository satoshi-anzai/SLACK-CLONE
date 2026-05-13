import { notFound } from "next/navigation";
import { ChannelHeader } from "@/components/message/ChannelHeader";
import { MessageList } from "@/components/message/MessageList";
import { MessageComposer } from "@/components/message/MessageComposer";
import { fetchChannel } from "@/lib/api/channels";
import { fetchMessages } from "@/lib/api/messages";

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const { channelId } = await params;
  const channel = await fetchChannel(channelId);
  if (!channel) notFound();

  const initialMessages = await fetchMessages(channelId);

  return (
    <div className="flex h-full flex-col">
      <ChannelHeader channel={channel} />
      <div className="flex-1 overflow-hidden">
        <MessageList channel={channel} initialMessages={initialMessages} />
      </div>
      <MessageComposer channelId={channel.id} channelName={channel.name} />
    </div>
  );
}
