import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <h2 className="text-2xl font-bold">チャンネルが見つかりません</h2>
      <p className="text-gray-600">
        指定された ID のチャンネルは存在しません。
      </p>
      <Link
        href="/c_general"
        className="rounded bg-slack-blue px-4 py-2 text-white hover:bg-slack-blue-hover"
      >
        # general に戻る
      </Link>
    </div>
  );
}
