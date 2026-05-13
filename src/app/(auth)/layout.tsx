import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slack-aubergine">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-10">
        <div className="mb-8 text-center text-white">
          <div className="text-3xl font-extrabold tracking-tight">Acme</div>
          <div className="mt-1 text-sm text-slack-sidebar-text">
            Slack-like Workspace
          </div>
        </div>
        <div className="w-full rounded-lg bg-white p-8 shadow-xl">{children}</div>
      </div>
    </div>
  );
}
