"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ToastProvider } from "@/components/common/ToastProvider";

// App-wide client providers: API cache (TanStack Query), toast messages and the confirm dialog.
export default function Providers({ children }: { children: ReactNode }) {
  // One QueryClient per browser tab (useState keeps it across re-renders)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {children}
        <ConfirmDialog className="app-confirm-dialog" />
      </ToastProvider>
    </QueryClientProvider>
  );
}
