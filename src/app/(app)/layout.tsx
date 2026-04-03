import { Suspense } from "react";
import AppSideNav from "@/components/AppSideNav";
import Providers from "@/components/Providers";
import LoadingState from "@/lib/ui/loading-state";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={<LoadingState message="Chargement de l'application..." />}
    >
      <AppSideNav>
        <Providers>{children}</Providers>
      </AppSideNav>
    </Suspense>
  );
}
