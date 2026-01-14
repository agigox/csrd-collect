"use client";

import { Sidebar } from "@/components/sidebar";
import { useSidebarStore } from "@/stores";

export default function ParametrageDeclaratifPage() {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main
        className={`flex-1 h-screen overflow-x-hidden overflow-y-auto transition-all duration-250 bg-content-bg ${
          isCollapsed ? "ml-[60px]" : "ml-[220px]"
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-content-text">
            Paramètrage déclaratif
          </h1>
          <p className="mt-4 text-content-muted">
            Cette page est en cours de développement.
          </p>
        </div>
      </main>
    </div>
  );
}
