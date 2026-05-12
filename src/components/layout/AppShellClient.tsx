"use client";

import type { ReactNode } from "react";
import { SidebarProvider, useSidebar } from "@/components/layout/SidebarContext";
import { cn } from "@/lib/utils";

interface AppShellClientProps {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
}

function AppShellInner({ header, sidebar, children }: AppShellClientProps) {
  const { open, close } = useSidebar();

  return (
    <div className="flex h-screen w-screen flex-col bg-slack-aubergine text-white">
      {header}
      <div className="relative flex flex-1 overflow-hidden">
        {open && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={close}
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
          />
        )}
        <aside
          className={cn(
            "z-40 h-full w-[260px] shrink-0 transform bg-slack-aubergine transition-transform duration-200 ease-out",
            "fixed inset-y-0 left-0 md:static md:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          )}
          aria-hidden={!open ? undefined : false}
        >
          {sidebar}
        </aside>
        <main className="flex-1 overflow-hidden rounded-tl-md bg-white text-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AppShellClient(props: AppShellClientProps) {
  return (
    <SidebarProvider>
      <AppShellInner {...props} />
    </SidebarProvider>
  );
}
