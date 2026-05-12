import type { User } from "@/lib/types";

export const mockUsers: User[] = [
  {
    id: "u_anzai",
    name: "anzai",
    displayName: "安西 智史",
    avatarColor: "#E01E5A",
    status: "active",
  },
  {
    id: "u_taro",
    name: "taro",
    displayName: "Taro Yamada",
    avatarColor: "#2BAC76",
    status: "active",
  },
  {
    id: "u_hanako",
    name: "hanako",
    displayName: "Hanako Suzuki",
    avatarColor: "#ECB22E",
    status: "away",
  },
  {
    id: "u_alex",
    name: "alex",
    displayName: "Alex Kim",
    avatarColor: "#1164A3",
    status: "offline",
  },
  {
    id: "u_mei",
    name: "mei",
    displayName: "Mei Tanaka",
    avatarColor: "#4A154B",
    status: "active",
  },
];

export const currentUserId = "u_anzai";

export function getUser(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id);
}
