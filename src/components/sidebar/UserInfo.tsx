"use client";

import { Divider } from "@/lib/Divider";
import UserInfoItem from "./UserInfoItem";
import { useAuthStore } from "@/stores";
import { LogOutIcon } from "lucide-react";

const UserInfo = () => {
  const { teamInfo, logout } = useAuthStore();

  if (!teamInfo) {
    return null;
  }

  return (
    <>
      <div className="p-4 text-sm">
        <UserInfoItem label="Direction :" value={teamInfo.direction} />
        <UserInfoItem label="Centre :" value={teamInfo.centre} />
        <UserInfoItem label="GMR :" value={teamInfo.gmr} />
        <UserInfoItem label="Equipe :" value={teamInfo.equipe} />
        <button
          onClick={logout}
          className="mt-3 flex items-center gap-2 text-sidebar-muted hover:text-sidebar-text transition-colors"
        >
          <LogOutIcon className="size-4" />
          <span>Déconnexion</span>
        </button>
      </div>
      <div className="px-2">
        <Divider className="bg-sidebar-border" />
      </div>
    </>
  );
};
export default UserInfo;
