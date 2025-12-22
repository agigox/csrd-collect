import { Divider } from "@/lib/Divider";

const UserInfo = () => {
  return (
    <>
      <div className="p-4 text-sm">
        <div className="flex gap-4 mb-1">
          <span className="text-sidebar-muted">Direction :</span>
          <span className="text-white">Maintenance</span>
        </div>
        <div className="flex gap-4 mb-1">
          <span className="text-sidebar-muted">Centre :</span>
          <span className="text-white">Aura</span>
        </div>
        <div className="flex gap-4 mb-1">
          <span className="text-sidebar-muted">GMR :</span>
          <span className="text-white">lorem</span>
        </div>
        <div className="flex gap-4">
          <span className="text-sidebar-muted">Equipe :</span>
          <span className="text-white">Emasi</span>
        </div>
      </div>
      <Divider />
    </>
  );
};
export default UserInfo;
