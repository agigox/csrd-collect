"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import Declarations from "@/components/declarations";

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
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
