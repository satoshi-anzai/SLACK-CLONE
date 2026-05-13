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
  /** DM のメンバー (両端 user.id)。channel kind では使用しない */
  dmMembers?: UserId[];
}

export interface Message {
  id: MessageId;
  channelId: ChannelId;
  authorId: UserId;
  body: string;
  createdAt: string;
  parentMessageId?: MessageId | null;
  /** fetchMessages では join 結果として埋め込まれる。Realtime 受信直後など作者未解決の場合は undefined */
  author?: User;
  /** 親メッセージへの返信件数 (fetchMessages のみ算出) */
  replyCount?: number;
}
