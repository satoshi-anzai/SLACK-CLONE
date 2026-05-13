import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acme Workspace | Slack Clone",
  description: "A Slack-like chat frontend built with Next.js + Tailwind",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
