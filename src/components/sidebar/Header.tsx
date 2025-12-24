import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";

const Header = () => {
  const { sidebarCollapsed } = useSidebar();

  return (
    <div className="flex flex-col gap-1 items-start pt-5 px-4 pb-0 justify-between">
      <div className="flex items-center gap-2 h-[66px]">
        <Image
          src="/Logo.svg"
          alt="Logo"
          width={24}
          height={24}
          className="rounded-md shrink-0"
        />
        {!sidebarCollapsed && (
          <div className="overflow-hidden flex flex-col">
            <div className="font-semibold text-base whitespace-nowrap">
              Le collecteur
            </div>
          </div>
        )}
      </div>
      <div className="text-xs py-2 text-sidebar-muted w-full text-right">
        V1.1.3
      </div>
    </div>
  );
};
export default Header;
