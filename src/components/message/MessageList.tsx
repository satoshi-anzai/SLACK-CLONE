import { MessageItem } from "@/components/message/MessageItem";
import { fetchMessages } from "@/lib/api/messages";
import { getUser } from "@/lib/mock/users";
import { formatDateLabel } from "@/lib/utils";

const GROUP_THRESHOLD_MS = 5 * 60 * 1000;

function dateKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export async function MessageList({ channelId }: { channelId: string }) {
  const messages = await fetchMessages(channelId);

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500">
        まだメッセージはありません。
      </div>
    );
  }

  const rows: Array<
    | { type: "date"; key: string; label: string }
    | { type: "msg"; key: string; messageIndex: number; showHeader: boolean }
  > = [];

  let lastDate: string | null = null;
  let lastAuthor: string | null = null;
  let lastTime = 0;

  messages.forEach((m, i) => {
    const dk = dateKey(m.createdAt);
    if (dk !== lastDate) {
      rows.push({
        type: "date",
        key: `d-${dk}`,
        label: formatDateLabel(m.createdAt),
      });
      lastDate = dk;
      lastAuthor = null;
      lastTime = 0;
    }
    const t = new Date(m.createdAt).getTime();
    const sameAuthor = m.authorId === lastAuthor;
    const closeInTime = t - lastTime < GROUP_THRESHOLD_MS;
    const showHeader = !(sameAuthor && closeInTime);

    rows.push({
      type: "msg",
      key: m.id,
      messageIndex: i,
      showHeader,
    });

    lastAuthor = m.authorId;
    lastTime = t;
  });

  return (
    <div className="flex h-full flex-col-reverse overflow-y-auto">
      <div className="py-4">
        {rows.map((row) => {
          if (row.type === "date") {
            return (
              <div
                key={row.key}
                className="relative my-3 flex items-center justify-center"
              >
                <div className="absolute inset-x-5 top-1/2 h-px bg-gray-200" />
                <span className="relative rounded-full border border-gray-200 bg-white px-3 py-0.5 text-xs font-bold text-gray-700">
                  {row.label}
                </span>
              </div>
            );
          }
          const m = messages[row.messageIndex];
          return (
            <MessageItem
              key={row.key}
              message={m}
              author={getUser(m.authorId)}
              showHeader={row.showHeader}
            />
          );
        })}
      </div>
    </div>
  );
}
