import { DownloadIcon, FolderIcon } from "@/lib/Icons";
import NavItem from "./NavItem";

export const Navigation = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <nav className="flex-1 p-4 flex flex-col gap-1">
      <NavItem
        icon={<FolderIcon />}
        label="Déclarations"
        collapsed={collapsed}
      />
      <NavItem
        icon={<DownloadIcon />}
        label="Paramètrage déclaratif"
        collapsed={collapsed}
      />
    </nav>
  );
};
