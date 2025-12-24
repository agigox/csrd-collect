import Icon from "@/lib/Icons";
import NavItem from "./NavItem";
import { Button } from "@/lib/components/ui/button";
import { useSidebar } from "@/context/SidebarContext";

export const Navigation = () => {
  const { sidebarCollapsed } = useSidebar();
  return (
    <div className="flex flex-col gap-10 py-4">
      {/* Declare button */}
      <div className={!sidebarCollapsed ? "mx-2" : ""}>
        <Button className="w-full">
          {!sidebarCollapsed && "Déclarer"}
          <Icon name="campaign" />
        </Button>
      </div>
      <nav className="flex flex-col gap-2">
        <NavItem icon={<Icon name="folder" />} label="Déclarations" />
        <NavItem
          icon={<Icon name="download" />}
          label="Paramètrage déclaratif"
        />
        <NavItem icon={<Icon name="leading" />} label="Item 1" />
        <NavItem icon={<Icon name="tune" />} label="Item 2" />
      </nav>
    </div>
  );
};
