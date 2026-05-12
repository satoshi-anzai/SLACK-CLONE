export type UserId = string;
export type ChannelId = string;
export type MessageId = string;

export interface User {
  id: UserId;
  name: string;
  displayName: string;
  avatarColor: string;
  status: "active" | "away" | "offline";
}

export interface Channel {
  id: ChannelId;
  name: string;
  kind: "channel" | "dm";
  isPrivate?: boolean;
  topic?: string;
  unreadCount?: number;
}

export interface Message {
  id: MessageId;
  channelId: ChannelId;
  authorId: UserId;
  body: string;
  createdAt: string;
}
