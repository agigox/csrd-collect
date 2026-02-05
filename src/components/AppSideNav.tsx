"use client";

import { usePathname } from "next/navigation";
import { SideNav } from "@rte-ds/react";

interface AppSideNavProps {
  children: React.ReactNode;
}

const adminMenuItems = [
  {
    id: "admin-equipe",
    icon: "tune",
    label: "Administration d'équipe",
    link: "/admin",
  },
  {
    id: "admin-parametrage",
    icon: "download",
    label: "Paramètrage déclaratif",
    link: "/admin/parametrage-declaratif",
  },
  {
    id: "admin-donnees",
    icon: "download",
    label: "Gestion des données",
    link: "/admin/gestion-donnees",
  },
];

const memberHeaderConfig = {
  icon: "home",
  identifier: "CC",
  link: "/",
  title: "CSRD Collecte",
  version: "V1.0.0",
};

const adminHeaderConfig = {
  icon: "settings",
  identifier: "AD",
  link: "/admin",
  title: "Administration",
  version: "V1.0.0",
};

export default function AppSideNav({ children }: AppSideNavProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const headerConfig = isAdmin ? adminHeaderConfig : memberHeaderConfig;

  return (
    <SideNav
      headerConfig={headerConfig}
      {...(isAdmin && { items: adminMenuItems })}
      collapsible
      size="s"
    >
      {children}
    </SideNav>
  );
}
