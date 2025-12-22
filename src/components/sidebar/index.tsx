"use client";

import { Button } from "@/lib/Button";
import { Divider } from "@/lib/Divider";
import {
  DeclareIcon,
  FolderIcon,
  DownloadIcon,
  SettingsIcon,
  CollapseIcon,
} from "@/lib/Icons";
import Header from "./Header";
import UserInfo from "./UserInfo";
import { Navigation } from "./Navigation";
import NavItem from "./NavItem";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-sidebar-bg text-sidebar-text flex flex-col transition-all duration-250 z-50 overflow-hidden ${
        collapsed ? "w-[60px]" : "w-[220px]"
      }`}
    >
      <Header collapsed={collapsed} />

      {/* User info */}
      {!collapsed && <UserInfo />}

      {/* Declare button */}
      <div className="p-4">
        <Button fullWidth icon={<DeclareIcon />}>
          {!collapsed && "Déclarer"}
        </Button>
      </div>

      {/* Navigation */}
      <Navigation collapsed={collapsed} />

      {/* Footer */}
      <Divider />
      <div className="p-4 flex flex-col gap-1">
        <NavItem
          icon={<SettingsIcon />}
          label="Paramètres"
          collapsed={collapsed}
        />
        <NavItem
          icon={<CollapseIcon collapsed={collapsed} />}
          label="Réduire le menu"
          collapsed={collapsed}
          onClick={onToggle}
        />
      </div>
    </aside>
  );
}
