"use client";

import { Menu, X } from "lucide-react";
import { useSidebar } from "@/components/layout/SidebarContext";

export function SidebarToggleButton() {
  const { open, toggle } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded p-1.5 text-white/80 hover:bg-white/10 md:hidden"
      aria-label={open ? "Close sidebar" : "Open sidebar"}
      aria-expanded={open}
    >
      {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}
