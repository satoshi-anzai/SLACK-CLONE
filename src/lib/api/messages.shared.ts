import type { Message, User } from "@/lib/types";

interface AuthorRow {
  id: string;
  name: string;
  display_name: string;
  avatar_color: string;
  status: User["status"];
}

export interface MessageRow {
  id: string;
  channel_id: string;
  author_id: string;
  body: string;
  created_at: string;
  parent_message_id: string | null;
  author?: AuthorRow | null;
  replies?: { count: number }[];
}

export const MESSAGE_SELECT = `
  id, channel_id, author_id, body, created_at, parent_message_id,
  author:users!author_id (id, name, display_name, avatar_color, status),
  replies:messages!parent_message_id (count)
`;

function toAuthor(row: AuthorRow | null | undefined): User | undefined {
  if (!row) return undefined;
  return {
    id: row.id,
    name: row.name,
    displayName: row.display_name,
    avatarColor: row.avatar_color,
    status: row.status,
  };
}

export function toMessage(row: MessageRow): Message {
  return {
    id: row.id,
    channelId: row.channel_id,
    authorId: row.author_id,
    body: row.body,
    createdAt: row.created_at,
    parentMessageId: row.parent_message_id,
    author: toAuthor(row.author),
    replyCount: row.replies?.[0]?.count ?? 0,
  };
}
