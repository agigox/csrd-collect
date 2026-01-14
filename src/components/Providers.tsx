"use client";

import { AuthGuard } from "@/components/auth";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <AuthGuard>{children}</AuthGuard>;
}
