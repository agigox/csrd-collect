import AppSideNav from "@/components/AppSideNav";
import Providers from "@/components/Providers";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppSideNav>
      <Providers>{children}</Providers>
    </AppSideNav>
  );
}
