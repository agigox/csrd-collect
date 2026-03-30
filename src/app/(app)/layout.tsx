import { Suspense } from "react";
import AppSideNav from "@/components/AppSideNav";
import Providers from "@/components/Providers";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <AppSideNav>
        <Providers>{children}</Providers>
      </AppSideNav>
    </Suspense>
  );
}
