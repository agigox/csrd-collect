"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
}

const NavItem = ({ icon, label, href }: NavItemProps) => {
  const { sidebarCollapsed, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const isActive = href ? pathname === href : false;

  const handleClick = () => {
    if (label === "Réduire le menu") {
      toggleSidebar();
    }
  };

  const className = `flex items-center gap-2 p-2 w-full border-none cursor-pointer text-sm text-left text-sidebar-text transition-all duration-150 hover:bg-sidebar-hover ${
    isActive ? "bg-sidebar-hover" : "bg-transparent"
  } ${sidebarCollapsed ? "justify-center" : "justify-start"}`;

  const content = (
    <>
      <span className="flex items-center shrink-0">{icon}</span>
      {!sidebarCollapsed && <span>{label}</span>}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        title={sidebarCollapsed ? label : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={className}
      title={sidebarCollapsed ? label : undefined}
    >
      {content}
    </button>
  );
};

export default NavItem;
