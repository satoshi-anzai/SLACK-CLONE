import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(iso: string) {
  const d = new Date(iso);
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function formatDateLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const diffDays = Math.floor(
    (startOfDay(today) - startOfDay(d)) / (24 * 60 * 60 * 1000),
  );
  if (diffDays === 0) return "本日";
  if (diffDays === 1) return "昨日";
  if (diffDays > 1 && diffDays < 7) {
    return d.toLocaleDateString("ja-JP", { weekday: "long" });
  }
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export function formatFullDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
