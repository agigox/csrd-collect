import { useSidebar } from "@/context/SidebarContext";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}
const NavItem = ({ icon, label, active = false }: NavItemProps) => {
  const { sidebarCollapsed, toggleSidebar } = useSidebar();
  const handlClickNavItem = () => {
    console.log(label);
    if (label === "Réduire le menu") {
      // Toggle sidebar collapse state
      toggleSidebar();
    }
    // Handle navigation item click
  };
  return (
    <button
      onClick={handlClickNavItem}
      className={`flex items-center gap-2 p-2 w-full border-none cursor-pointer text-sm text-left text-sidebar-text transition-all duration-150 hover:bg-sidebar-hover ${
        active ? "bg-sidebar-hover" : "bg-transparent"
      } ${sidebarCollapsed ? "justify-center" : "justify-start"}`}
      title={sidebarCollapsed ? label : undefined}
    >
      <span className="flex items-center shrink-0">{icon}</span>
      {!sidebarCollapsed && <span>{label}</span>}
    </button>
  );
};
export default NavItem;
