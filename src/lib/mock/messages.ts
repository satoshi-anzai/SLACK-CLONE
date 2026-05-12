import type { Message } from "@/lib/types";

const today = new Date();
function iso(hoursAgo: number, minute = 0) {
  const d = new Date(today);
  d.setHours(today.getHours() - hoursAgo, minute, 0, 0);
  return d.toISOString();
}

export const mockMessages: Record<string, Message[]> = {
  c_general: [
    {
      id: "m1",
      channelId: "c_general",
      authorId: "u_taro",
      body: "おはようございます！今日もよろしくお願いします :coffee:",
      createdAt: iso(5, 12),
    },
    {
      id: "m2",
      channelId: "c_general",
      authorId: "u_hanako",
      body: "おはようございます。今日の全社ミーティングは 14:00 からです。",
      createdAt: iso(4, 30),
    },
    {
      id: "m3",
      channelId: "c_general",
      authorId: "u_anzai",
      body: "了解です。アジェンダ共有ありがとうございます！",
      createdAt: iso(4, 35),
    },
    {
      id: "m4",
      channelId: "c_general",
      authorId: "u_mei",
      body: "資料はこのチャンネルに後ほど貼ります。",
      createdAt: iso(2, 5),
    },
  ],
  c_random: [
    {
      id: "m10",
      channelId: "c_random",
      authorId: "u_alex",
      body: "近所のラーメン屋、ついにオープンしました🍜",
      createdAt: iso(8, 0),
    },
    {
      id: "m11",
      channelId: "c_random",
      authorId: "u_taro",
      body: "行きたい！今度ランチ行きましょう。",
      createdAt: iso(7, 50),
    },
    {
      id: "m12",
      channelId: "c_random",
      authorId: "u_hanako",
      body: "私も〜！金曜どうですか？",
      createdAt: iso(6, 10),
    },
  ],
  c_engineering: [
    {
      id: "m20",
      channelId: "c_engineering",
      authorId: "u_anzai",
      body: "Next.js 15 のキャッシュ周りの挙動についてメモ書きを共有しました。",
      createdAt: iso(10, 0),
    },
    {
      id: "m21",
      channelId: "c_engineering",
      authorId: "u_mei",
      body: "ありがとうございます。RSC からの fetch がデフォルトで no-store になった件、影響範囲を整理したいです。",
      createdAt: iso(9, 40),
    },
    {
      id: "m22",
      channelId: "c_engineering",
      authorId: "u_alex",
      body: "別スレッドで議論しましょうか。",
      createdAt: iso(9, 35),
    },
  ],
  c_design: [
    {
      id: "m30",
      channelId: "c_design",
      authorId: "u_hanako",
      body: "新しいログイン画面のモックを Figma にアップしました。",
      createdAt: iso(26, 0),
    },
    {
      id: "m31",
      channelId: "c_design",
      authorId: "u_taro",
      body: "見ました。CTA の色だけ少し気になりました。後でコメント残します。",
      createdAt: iso(25, 30),
    },
  ],
  c_frontend: [
    {
      id: "m40",
      channelId: "c_frontend",
      authorId: "u_anzai",
      body: "Slack 風 UI を Next.js + Tailwind で作っています。",
      createdAt: iso(1, 5),
    },
    {
      id: "m41",
      channelId: "c_frontend",
      authorId: "u_mei",
      body: "おお、進捗気になります！",
      createdAt: iso(0, 20),
    },
  ],
  "c_proj-launch": [
    {
      id: "m50",
      channelId: "c_proj-launch",
      authorId: "u_alex",
      body: "ローンチは来月の第二週で確定しました。",
      createdAt: iso(28, 0),
    },
  ],
};
