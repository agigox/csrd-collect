import { Divider } from "@/lib/Divider";

const Header = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <div className="flex flex-col gap-1 items-start pt-5 px-2 pb-0 h-30 justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center font-bold text-sm shrink-0">
          NA
        </div>
        {!collapsed && (
          <div className="overflow-hidden flex flex-col">
            <div className="font-semibold text-sm whitespace-nowrap">
              Le collecteur
            </div>
            <div className="text-xs text-sidebar-muted text-right">V1.1.3</div>
          </div>
        )}
      </div>
      <Divider />
    </div>
  );
};
export default Header;
