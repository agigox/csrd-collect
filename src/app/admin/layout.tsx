"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { useSidebarStore, useFormsStore } from "@/stores";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const fetchForms = useFormsStore((state) => state.fetchForms);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar variant="admin" />
      <main
        className={`flex-1 h-screen overflow-x-hidden overflow-y-auto transition-all duration-250 bg-content-bg ${
          isCollapsed ? "ml-[60px]" : "ml-[220px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
