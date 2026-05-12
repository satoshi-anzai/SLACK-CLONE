import type { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { WorkspaceHeader } from "@/components/layout/WorkspaceHeader";
import { AppShellClient } from "@/components/layout/AppShellClient";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AppShellClient header={<WorkspaceHeader />} sidebar={<Sidebar />}>
      {children}
    </AppShellClient>
  );
}
