"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SideNav, useBreakpoint } from "@rte-ds/react";
import { useAuthStore } from "@/stores";

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
  const router = useRouter();
  const isAdmin = pathname.startsWith("/admin");
  const [mounted, setMounted] = useState(false);
  const { width } = useBreakpoint();
  const user = useAuthStore((s) => s.user);
  const teamInfo = useAuthStore((s) => s.teamInfo);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const headerConfig = isAdmin ? adminHeaderConfig : memberHeaderConfig;

  const activeItem = isAdmin
    ? [...adminMenuItems]
        .sort((a, b) => b.link.length - a.link.length)
        .find((item) => pathname.startsWith(item.link))?.id
    : undefined;

  // Build subtitle for sidebar header
  let subtitle: string | undefined;
  if (isAdmin && user) {
    subtitle = [user.prenom, user.nom].filter(Boolean).join(" ") || undefined;
  } else if (!isAdmin && teamInfo) {
    subtitle = [teamInfo.direction, teamInfo.centre, teamInfo.gmr, teamInfo.equipe]
      .filter(Boolean)
      .join(" · ");
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const footerItems = isAuthenticated
    ? [
        {
          id: "logout",
          label: "Déconnexion",
          icon: "logout",
          onClick: handleLogout,
        },
      ]
    : undefined;

  // Avoid hydration mismatch: SideNav uses window.innerWidth to choose
  // between mobile/desktop layout, which differs from SSR (width=0 → mobile)
  if (!mounted) {
    return <div>{children}</div>;
  }

  return (
    <SideNav
      headerConfig={{
        ...headerConfig,
        ...(subtitle ? { version: subtitle } : {}),
      }}
      {...(isAdmin && { items: adminMenuItems })}
      activeItem={activeItem}
      footerItems={footerItems}
      collapsible
      size="s"
      collapsed={width <= 1050}
    >
      {children}
    </SideNav>
  );
}
