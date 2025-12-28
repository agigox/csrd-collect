"use client";

import { Separator } from "@/lib/components/ui/separator";
import Icon from "@/lib/Icons";
import Header from "./Header";
import UserInfo from "./UserInfo";
import AdminUserInfo from "./AdminUserInfo";
import { Navigation } from "./Navigation";
import NavItem from "./NavItem";
import { useSidebar } from "@/context/SidebarContext";
import { useUser } from "@/context/UserContext";

interface SidebarProps {
  variant?: "admin" | "member";
}

export function Sidebar({ variant }: SidebarProps) {
  const { sidebarCollapsed } = useSidebar();
  const { isAdmin } = useUser();

  const effectiveVariant = variant ?? (isAdmin ? "admin" : "member");
  const showAdminUI = effectiveVariant === "admin";

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-sidebar-bg pt-2 text-sidebar-text flex flex-col transition-all duration-250 z-50 overflow-hidden ${
        sidebarCollapsed ? "w-[60px]" : "w-[220px]"
      }`}
    >
      <Header />
      <div className="px-2">
        <Separator className="bg-sidebar-border" />
      </div>

      {!sidebarCollapsed && (showAdminUI ? <AdminUserInfo /> : <UserInfo />)}

      <div className="flex-1 flex flex-col justify-between">
        <Navigation variant={effectiveVariant} />

        <div className="flex flex-col gap-1">
          <div className="px-2">
            <Separator className="bg-sidebar-border" />
          </div>
          <NavItem
            icon={<Icon name="settings" />}
            label="Paramètres"
            href={showAdminUI ? "/admin/parametres" : "/parametres"}
          />
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
