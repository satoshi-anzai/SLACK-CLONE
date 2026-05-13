"use client";

import { X, Hash, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createChannel } from "@/lib/api/channels.client";

export function NewChannelModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    const { id, error: createError } = await createChannel({
      name,
      topic,
      isPrivate,
    });
    if (createError) {
      setError(createError);
      setSubmitting(false);
      return;
    }
    onClose();
    router.push(`/${id}`);
    router.refresh();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white text-gray-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h2 className="text-lg font-bold">チャンネルを作成</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label
              htmlFor="ch-name"
              className="mb-1 block text-sm font-semibold"
            >
              名前
            </label>
            <div className="flex items-center rounded border border-gray-300 focus-within:border-slack-blue">
              <span className="px-2 text-gray-400">
                {isPrivate ? <Lock className="h-4 w-4" /> : <Hash className="h-4 w-4" />}
              </span>
              <input
                id="ch-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: marketing"
                required
                maxLength={80}
                className="flex-1 border-l border-gray-300 px-2 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="ch-topic"
              className="mb-1 block text-sm font-semibold"
            >
              トピック (任意)
            </label>
            <input
              id="ch-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="このチャンネルは何について?"
              className="w-full rounded border border-gray-300 px-2 py-2 text-sm outline-none focus:border-slack-blue"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            <span>プライベートチャンネルにする</span>
          </label>

          {error && (
            <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!name.trim() || submitting}
              className="rounded bg-slack-blue px-4 py-2 text-sm font-semibold text-white hover:bg-slack-blue-hover disabled:opacity-60"
            >
              {submitting ? "作成中…" : "作成"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
