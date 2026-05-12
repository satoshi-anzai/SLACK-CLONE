import type { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { WorkspaceHeader } from "@/components/layout/WorkspaceHeader";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-col bg-slack-aubergine text-white">
      <WorkspaceHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden rounded-tl-md bg-white text-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
