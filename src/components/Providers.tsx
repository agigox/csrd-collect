"use client";

import { DeclarationsProvider } from "@/context/DeclarationsContext";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <DeclarationsProvider>{children}</DeclarationsProvider>;
}
