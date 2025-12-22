"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";

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
        <div className="p-8">
          <h1 className="text-3xl font-normal text-center">
            Le contenu doit etre ici avec un scrollbar
          </h1>

          {/* Long content for testing scroll */}
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} className="p-5 mt-4 bg-gray-100 rounded-lg">
              <h2 className="m-0 mb-2 text-lg font-semibold">
                Section {i + 1}
              </h2>
              <p className="m-0 text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
