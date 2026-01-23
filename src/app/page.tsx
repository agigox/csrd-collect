"use client";

import { Sidebar } from "@/components/sidebar";
import Declarations from "@/components/declarations";
import { useSidebarStore } from "@/stores";

export default function Home() {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main
        className={`flex-1 h-screen overflow-x-hidden overflow-y-auto transition-all duration-250 bg-content-bg ${
          isCollapsed ? "ml-15" : "ml-55"
        }`}
      >
        <Declarations />
      </main>
    </div>
  );
}
