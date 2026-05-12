import { Bold, Italic, Paperclip, Smile, Send } from "lucide-react";

export function MessageComposer({ channelName }: { channelName: string }) {
  return (
    <div className="border-t border-gray-200 px-5 py-3">
      <div className="rounded-md border border-gray-300 focus-within:border-gray-500">
        <div className="flex items-center gap-1 border-b border-gray-200 px-2 py-1 text-gray-500">
          <button className="rounded p-1 hover:bg-gray-100" disabled>
            <Bold className="h-4 w-4" />
          </button>
          <button className="rounded p-1 hover:bg-gray-100" disabled>
            <Italic className="h-4 w-4" />
          </button>
        </div>
        <input
          className="w-full px-3 py-2 text-[15px] outline-none placeholder:text-gray-400"
          placeholder={`Message #${channelName}`}
          disabled
        />
        <div className="flex items-center justify-between border-t border-gray-200 px-2 py-1 text-gray-500">
          <div className="flex items-center gap-1">
            <button className="rounded p-1 hover:bg-gray-100" disabled>
              <Paperclip className="h-4 w-4" />
            </button>
            <button className="rounded p-1 hover:bg-gray-100" disabled>
              <Smile className="h-4 w-4" />
            </button>
          </div>
          <button
            className="rounded bg-gray-200 p-1 text-gray-400"
            disabled
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="mt-1 text-[11px] text-gray-400">
        メッセージ送信はまだ未実装です (現フェーズは表示のみ)
      </p>
    </div>
  );
}
