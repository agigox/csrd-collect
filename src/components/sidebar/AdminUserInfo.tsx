import { Avatar, AvatarFallback } from "@/lib/ui/avatar";
import { Separator } from "@/lib/ui/separator";

const ADMIN_NAME = "Julien Neuville";

const AdminUserInfo = () => {
  const initials = ADMIN_NAME.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <div className="p-4 flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback className="bg-sidebar-hover text-sidebar-text text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-base font-semibold truncate">{ADMIN_NAME}</span>
      </div>
      <div className="px-2">
        <Separator className="bg-sidebar-border" />
      </div>
    </>
  );
};

export default AdminUserInfo;
