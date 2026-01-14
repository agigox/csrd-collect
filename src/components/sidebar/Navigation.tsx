import Icon, { IconName } from "@/lib/Icons";
import NavItem from "./NavItem";
import { Button } from "@/lib/components/ui/button";
import { useSidebarStore } from "@/stores";

interface MenuItem {
  icon: IconName;
  label: string;
  href: string;
}

const memberMenuItems: MenuItem[] = [
  { icon: "folder", label: "Déclarations", href: "/" },
  { icon: "download", label: "Paramètrage déclaratif", href: "/parametrage-declaratif" },
];

const adminMenuItems: MenuItem[] = [
  { icon: "tune", label: "Administration d'équipe", href: "/admin" },
  { icon: "download", label: "Paramètrage déclaratif", href: "/admin/parametrage-declaratif" },
  { icon: "download", label: "Gestion des données", href: "/admin/gestion-donnees" },
];

interface NavigationProps {
  variant?: "admin" | "member";
}

export const Navigation = ({ variant = "member" }: NavigationProps) => {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const isAdmin = variant === "admin";
  const menuItems = isAdmin ? adminMenuItems : memberMenuItems;

  return (
    <div className="flex flex-col gap-10 py-4">
      {!isAdmin && (
        <div className={!isCollapsed ? "mx-2" : ""}>
          <Button className="w-full">
            {!isCollapsed && "Déclarer"}
            <Icon name="campaign" />
          </Button>
        </div>
      )}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavItem
            key={item.href}
            icon={<Icon name={item.icon} />}
            label={item.label}
            href={item.href}
          />
        ))}
      </nav>
    </div>
  );
};
