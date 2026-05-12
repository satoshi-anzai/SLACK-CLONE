import type { Channel } from "@/lib/types";

export const mockChannels: Channel[] = [
  {
    id: "c_general",
    name: "general",
    kind: "channel",
    topic: "Company-wide announcements and work-based matters",
  },
  {
    id: "c_random",
    name: "random",
    kind: "channel",
    topic: "Non-work banter and water cooler conversation",
  },
  {
    id: "c_engineering",
    name: "engineering",
    kind: "channel",
    topic: "Engineering team discussions",
  },
  {
    id: "c_design",
    name: "design",
    kind: "channel",
    topic: "Design reviews & feedback",
  },
  {
    id: "c_frontend",
    name: "frontend",
    kind: "channel",
    topic: "Frontend tech & UI",
  },
  {
    id: "c_proj-launch",
    name: "proj-launch",
    kind: "channel",
    isPrivate: true,
    topic: "Private launch coordination",
  },
];

export const mockDMs: Channel[] = [
  { id: "dm_taro", name: "Taro Yamada", kind: "dm" },
  { id: "dm_hanako", name: "Hanako Suzuki", kind: "dm" },
  { id: "dm_alex", name: "Alex Kim", kind: "dm" },
];
