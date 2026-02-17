"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SideNav, useBreakpoint } from "@rte-ds/react";

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
  const [mounted, setMounted] = useState(false);
  const { width } = useBreakpoint();

  useEffect(() => {
    setMounted(true);
  }, []);

  const headerConfig = isAdmin ? adminHeaderConfig : memberHeaderConfig;

  // Avoid hydration mismatch: SideNav uses window.innerWidth to choose
  // between mobile/desktop layout, which differs from SSR (width=0 → mobile)
  if (!mounted) {
    return <div>{children}</div>;
  }

  return (
    <SideNav
      headerConfig={headerConfig}
      {...(isAdmin && { items: adminMenuItems })}
      collapsible
      size="s"
      collapsed={width <= 1050}
    >
      {children}
    </SideNav>
  );
}
