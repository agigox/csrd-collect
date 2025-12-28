"use client";

import { DeclarationsProvider } from "@/context/DeclarationsContext";
import { FormsProvider } from "@/context/FormsContext";
import { UserProvider } from "@/context/UserContext";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <UserProvider>
      <DeclarationsProvider>
        <FormsProvider>{children}</FormsProvider>
      </DeclarationsProvider>
    </UserProvider>
  );
}
