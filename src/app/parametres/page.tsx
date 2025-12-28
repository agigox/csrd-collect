"use client";

import { Sidebar } from "@/components/sidebar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

function MainContent() {
  const { sidebarCollapsed } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main
        className={`flex-1 h-screen overflow-x-hidden overflow-y-auto transition-all duration-250 bg-content-bg ${
          sidebarCollapsed ? "ml-[60px]" : "ml-[220px]"
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-content-text">Paramètres</h1>
          <p className="mt-4 text-content-muted">
            Cette page est en cours de développement.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function ParametresPage() {
  return (
    <SidebarProvider>
      <MainContent />
    </SidebarProvider>
  );
}
