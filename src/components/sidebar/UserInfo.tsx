"use client";

import { Divider } from "@/lib/Divider";
import UserInfoItem from "./UserInfoItem";
import { useAuthStore } from "@/stores";

const UserInfo = () => {
  const { teamInfo } = useAuthStore();

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
      </div>
      <div className="px-2">
        <Divider className="bg-sidebar-border" />
      </div>
    </>
  );
};
export default UserInfo;
