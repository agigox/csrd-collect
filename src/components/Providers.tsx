"use client";

import { AuthGuard } from "@/components/auth";
import { ToastQueueProvider } from "@rte-ds/react";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ToastQueueProvider>
      <AuthGuard>{children}</AuthGuard>
    </ToastQueueProvider>
  );
}
