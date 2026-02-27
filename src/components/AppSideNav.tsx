"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SideNav, Switch, useBreakpoint } from "@rte-ds/react";
import { useAuthStore, selectIsAdmin } from "@/stores/authStore";

interface AppSideNavProps {
  children: React.ReactNode;
}

const headerConfig = {
  icon: "home",
  identifier: "CC",
  link: "/declarations",
  title: "CSRD collecte",
  version: "V1.1.3",
};

const adminMenuItems = [
  {
    id: "admin-declarations",
    icon: "tune",
    label: "Admin. déclarations",
    link: "/admin",
  },
  {
    id: "admin-equipe",
    icon: "group",
    label: "Admin. d'équipe",
    link: "/admin/gestion-donnees",
  },
];

export default function AppSideNav({ children }: AppSideNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const { width } = useBreakpoint();
  const user = useAuthStore((s) => s.user);
  const team = useAuthStore((s) => s.team);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isUserAdmin = useAuthStore(selectIsAdmin);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync adminMode with pathname
  useEffect(() => {
    setAdminMode(pathname.startsWith("/admin"));
  }, [pathname]);

  const handleToggleAdmin = () => {
    const newMode = !adminMode;
    setAdminMode(newMode);
    if (newMode) {
      router.push("/admin");
    } else {
      router.push("/declarations");
    }
  };

  const profileName =
    user?.firstName || user?.lastName
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : undefined;

  const teamData =
    !adminMode && team
      ? [
          { label: "Direction", value: team.direction },
          { label: "CM", value: team.centre },
          { label: "GMR", value: team.gmr },
          { label: "Équipe", value: team.team },
        ]
      : undefined;

  const activeItem = adminMode
    ? [...adminMenuItems]
        .sort((a, b) => b.link.length - a.link.length)
        .find((item) => pathname.startsWith(item.link))?.id
    : undefined;

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

  const adminToggle = isUserAdmin ? (
    <div data-testid="admin-toggle" className="flex w-full justify-center">
      <Switch
        label="Admin"
        checked={adminMode}
        onChange={handleToggleAdmin}
        labelStyle={{ color: "#E6EEF8" }}
      />
    </div>
  ) : undefined;

  // Avoid hydration mismatch: SideNav uses window.innerWidth to choose
  // between mobile/desktop layout, which differs from SSR (width=0 → mobile)
  if (!mounted) {
    return <div>{children}</div>;
  }

  return (
    <SideNav
      headerConfig={{
        ...headerConfig,
        version: "V1.1.3",
      }}
      {...(adminMode && { items: adminMenuItems })}
      activeItem={activeItem}
      footerItems={footerItems}
      showProfile={!!profileName}
      profile={profileName}
      middleItem={adminToggle}
      showTeamData={!!teamData}
      teamData={teamData}
      collapsible
      size="s"
      collapsed={width <= 1050}
    >
      {children}
    </SideNav>
  );
}
