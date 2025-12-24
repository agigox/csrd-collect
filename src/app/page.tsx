"use client";

import { Sidebar } from "@/components/sidebar";
import Declarations from "@/components/declarations";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

function MainContent() {
  const { sidebarCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main
        className={`flex-1 h-screen overflow-x-hidden overflow-y-auto transition-all duration-250 bg-content-bg ${
          sidebarCollapsed ? "ml-[60px]" : "ml-[220px]"
        }`}
      >
        <Declarations />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <SidebarProvider>
      <MainContent />
    </SidebarProvider>
  );
}
