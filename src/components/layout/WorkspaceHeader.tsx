import { Search, Clock, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { SidebarToggleButton } from "@/components/layout/SidebarToggleButton";
import { fetchCurrentUser } from "@/lib/api/users";

export async function WorkspaceHeader() {
  const me = await fetchCurrentUser();
  const initial = me?.displayName?.[0] ?? "?";

  return (
    <header className="flex h-11 shrink-0 items-center gap-2 px-2 text-sm sm:px-4">
      <div className="md:hidden">
        <SidebarToggleButton />
      </div>
      <div className="hidden flex-1 items-center gap-1 text-white/60 md:flex">
        <button
          type="button"
          className="rounded p-1 hover:bg-white/10 disabled:opacity-50"
          aria-label="Back"
          disabled
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="rounded p-1 hover:bg-white/10 disabled:opacity-50"
          aria-label="Forward"
          disabled
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-1 items-center gap-2 rounded bg-white/10 px-3 py-1 text-white/90 hover:bg-white/15 md:w-[640px] md:max-w-[55%] md:flex-none">
        <Search className="h-4 w-4 shrink-0" />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/60"
          placeholder="Search Acme Workspace"
        />
      </div>
      <div className="hidden flex-1 items-center justify-end gap-2 text-white/80 md:flex">
        <button
          className="rounded p-1.5 text-white/40 disabled:cursor-not-allowed"
          aria-label="History"
          title="履歴 (未実装)"
          disabled
        >
          <Clock className="h-4 w-4" />
        </button>
        <button
          className="rounded p-1.5 text-white/40 disabled:cursor-not-allowed"
          aria-label="Help"
          title="ヘルプ (未実装)"
          disabled
        >
          <HelpCircle className="h-4 w-4" />
        </button>
        <div
          className="ml-1 flex h-7 w-7 items-center justify-center rounded text-xs font-bold text-white"
          style={{ backgroundColor: me?.avatarColor ?? "#999" }}
          title={me?.displayName ?? "未ログイン"}
        >
          {initial}
        </div>
      </div>
    </header>
  );
}
