"use client";

import { Separator } from "@/lib/ui/separator";
import Icon from "@/lib/Icons";
import Header from "./Header";
import UserInfo from "./UserInfo";
import AdminUserInfo from "./AdminUserInfo";
import { Navigation } from "./Navigation";
import NavItem from "./NavItem";
import { useSidebarStore, useAuthStore } from "@/stores";
import { usePathname } from "next/navigation";
import { LogOutIcon } from "lucide-react";

interface SidebarProps {
  variant?: "admin" | "member";
}

export function Sidebar({ variant }: SidebarProps) {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const effectiveVariant = variant ?? (isAdmin ? "admin" : "member");
  const showAdminUI = effectiveVariant === "admin";

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-background-brand-navigation-default pt-2 text-sidebar-text flex flex-col transition-all duration-250 z-50 overflow-hidden ${
        isCollapsed ? "w-15" : "w-55"
      }`}
    >
      <Header />
      <div className="px-2">
        <Separator className="bg-sidebar-border" />
      </div>

      {!isCollapsed && (showAdminUI ? <AdminUserInfo /> : <UserInfo />)}

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
          <button
            onClick={logout}
            className={`flex items-center gap-2 p-2 w-full border-none cursor-pointer text-sm text-left text-sidebar-text transition-all duration-150 hover:bg-sidebar-hover bg-transparent ${
              isCollapsed ? "justify-center" : "justify-start"
            }`}
            title={isCollapsed ? "Déconnexion" : undefined}
          >
            <LogOutIcon className="size-4 shrink-0" />
            {!isCollapsed && <span>Déconnexion</span>}
          </button>
          <NavItem
            icon={
              <Icon
                name="collapse"
                className={`transition-transform duration-250 ${
                  isCollapsed ? "rotate-180" : ""
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
