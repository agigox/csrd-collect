"use client";

import { Divider } from "@/lib/Divider";
import Icon from "@/lib/Icons";
import Header from "./Header";
import UserInfo from "./UserInfo";
import { Navigation } from "./Navigation";
import NavItem from "./NavItem";
import { useSidebar } from "@/context/SidebarContext";

export function Sidebar() {
  const { sidebarCollapsed } = useSidebar();
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-sidebar-bg pt-2 text-sidebar-text flex flex-col transition-all duration-250 z-50 overflow-hidden ${
        sidebarCollapsed ? "w-[60px]" : "w-[220px]"
      }`}
    >
      <Header />
      <div className="px-2">
        <Divider />
      </div>

      {/* User info */}
      {!sidebarCollapsed && <UserInfo />}

      {/* Navigation */}
      <div className="flex-1 flex flex-col justify-between">
        <Navigation />

        {/* Footer */}

        <div className="flex flex-col gap-1">
          <div className="px-2">
            <Divider />
          </div>
          <NavItem icon={<Icon name="settings" />} label="Paramètres" />
          <NavItem
            icon={
              <Icon
                name="collapse"
                className={`transition-transform duration-250 ${
                  sidebarCollapsed ? "rotate-180" : ""
                }`}
              />
            }
            label="Réduire le menu"
          />
        </div>
      </div>
    </aside>
  );
}
