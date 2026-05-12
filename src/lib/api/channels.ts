import { mockChannels, mockDMs } from "@/lib/mock/channels";
import { mockMessages } from "@/lib/mock/messages";
import type { Channel } from "@/lib/types";

function withUnread(c: Channel): Channel {
  return { ...c, unreadCount: (mockMessages[c.id] ?? []).length };
}

export async function fetchChannels(): Promise<Channel[]> {
  return mockChannels.map(withUnread);
}

export async function fetchDMs(): Promise<Channel[]> {
  return mockDMs.map(withUnread);
}

export async function fetchChannel(id: string): Promise<Channel | undefined> {
  const all = [...mockChannels, ...mockDMs];
  const c = all.find((x) => x.id === id);
  return c ? withUnread(c) : undefined;
}
