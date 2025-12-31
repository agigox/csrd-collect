import { Divider } from "@/lib/Divider";
import UserInfoItem from "./UserInfoItem";

const UserInfo = () => {
  return (
    <>
      <div className="p-4 text-sm">
        <UserInfoItem label="Direction :" value="Maintenance" />
        <UserInfoItem label="Centre :" value="Aura" />
        <UserInfoItem label="GMR :" value="lorem" />
        <UserInfoItem label="Equipe :" value="Emasi" />
      </div>
      <div className="px-2">
        <Divider className="bg-sidebar-border" />
      </div>
    </>
  );
};
export default UserInfo;
