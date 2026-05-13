"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface ThreadContextValue {
  openMessageId: string | null;
  open: (messageId: string) => void;
  close: () => void;
}

const ThreadContext = createContext<ThreadContextValue | null>(null);

export function ThreadProvider({ children }: { children: ReactNode }) {
  const [openMessageId, setOpenMessageId] = useState<string | null>(null);
  const pathname = usePathname();

  const open = useCallback((messageId: string) => setOpenMessageId(messageId), []);
  const close = useCallback(() => setOpenMessageId(null), []);

  useEffect(() => {
    setOpenMessageId(null);
  }, [pathname]);

  return (
    <ThreadContext.Provider value={{ openMessageId, open, close }}>
      {children}
    </ThreadContext.Provider>
  );
}

export function useThread() {
  const ctx = useContext(ThreadContext);
  if (!ctx) throw new Error("useThread must be used within ThreadProvider");
  return ctx;
}
