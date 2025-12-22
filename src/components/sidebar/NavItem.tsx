interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active?: boolean;
  onClick?: () => void;
}
const NavItem = ({
  icon,
  label,
  collapsed,
  active = false,
  onClick,
}: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-2 w-full border-none rounded cursor-pointer text-sm text-left text-sidebar-text transition-all duration-150 hover:bg-sidebar-hover ${
        active ? "bg-sidebar-hover" : "bg-transparent"
      } ${collapsed ? "justify-center" : "justify-start"}`}
      title={collapsed ? label : undefined}
    >
      <span className="flex items-center shrink-0">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </button>
  );
};
export default NavItem;
