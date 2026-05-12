import { Search, Clock, HelpCircle } from "lucide-react";
import { SidebarToggleButton } from "@/components/layout/SidebarToggleButton";

export function WorkspaceHeader() {
  return (
    <header className="flex h-11 shrink-0 items-center gap-2 px-2 text-sm sm:px-4">
      <div className="md:hidden">
        <SidebarToggleButton />
      </div>
      <div className="hidden flex-1 md:block" />
      <div className="flex flex-1 items-center gap-2 rounded bg-white/10 px-3 py-1 text-white/90 hover:bg-white/15 md:w-[640px] md:max-w-[55%] md:flex-none">
        <Search className="h-4 w-4 shrink-0" />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/60"
          placeholder="Search Acme Workspace"
        />
      </div>
      <div className="hidden flex-1 items-center justify-end gap-3 text-white/80 md:flex">
        <button
          className="rounded p-1.5 hover:bg-white/10"
          aria-label="History"
        >
          <Clock className="h-4 w-4" />
        </button>
        <button className="rounded p-1.5 hover:bg-white/10" aria-label="Help">
          <HelpCircle className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
