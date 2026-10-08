"use client";

import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";
import { Toast } from "primereact/toast";

type ToastKind = "success" | "error";

interface ToastApi {
  showToast: (kind: ToastKind, message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const TOAST_LIFE_MS = 4000;

// One PrimeReact Toast for the whole app; any component calls useAppToast().showToast(...)
export function ToastProvider({ children }: { children: ReactNode }) {
  const toastRef = useRef<Toast>(null);

  const showToast = useCallback((kind: ToastKind, message: string) => {
    toastRef.current?.show({
      severity: kind,
      summary: kind === "success" ? "Done" : "Error",
      detail: message,
      life: TOAST_LIFE_MS,
    });
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast ref={toastRef} position="top-right" className="app-toast" />
    </ToastContext.Provider>
  );
}

export function useAppToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useAppToast must be used inside <ToastProvider>");
  return context;
}
