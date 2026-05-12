import { mockMessages } from "@/lib/mock/messages";
import type { Message } from "@/lib/types";

export async function fetchMessages(channelId: string): Promise<Message[]> {
  return mockMessages[channelId] ?? [];
}
