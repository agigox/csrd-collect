"use client";

import { Sidebar } from "@/components/sidebar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar variant="admin" />
      <main
        className={`flex-1 h-screen overflow-x-hidden overflow-y-auto transition-all duration-250 bg-content-bg ${
          sidebarCollapsed ? "ml-[60px]" : "ml-[220px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
}
