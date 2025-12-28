import { FormsList } from "@/components/admin/FormsList";
import HeaderForms from "@/components/admin/FormsHeader";

export default function AdminPage() {
  return (
    <div className="p-6">
      <HeaderForms />
      <FormsList />
    </div>
  );
}
