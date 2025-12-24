interface UserInfoItemProps {
  label: string;
  value: string;
}

const UserInfoItem = ({ label, value }: UserInfoItemProps) => {
  return (
    <div className="flex mb-1">
      <span className="text-sidebar-muted font-light w-[76px]">{label}</span>
      <span className="text-white font-normal">{value}</span>
    </div>
  );
};

export default UserInfoItem;
