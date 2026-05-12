import { Search, Clock, HelpCircle } from "lucide-react";

export function WorkspaceHeader() {
  return (
    <header className="flex h-11 shrink-0 items-center justify-between px-4 text-sm">
      <div className="flex-1" />
      <div className="flex w-[640px] max-w-[55%] items-center gap-2 rounded bg-white/10 px-3 py-1 text-white/90 hover:bg-white/15">
        <Search className="h-4 w-4" />
        <input
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/60"
          placeholder="Search Acme Workspace"
        />
      </div>
      <div className="flex flex-1 items-center justify-end gap-3 text-white/80">
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
