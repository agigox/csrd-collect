import Dashboard from "./Dashboard";
import DeclarationsList from "./DeclarationsList";

const Declarations = () => {
  return (
    <div className="p-8 flex gap-8">
      <div className="flex-1">
        <DeclarationsList />
      </div>
      <div className="flex-1">
        <Dashboard />
      </div>
    </div>
  );
};
export default Declarations;
