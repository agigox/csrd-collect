import { FormsList } from "@/components/admin/FormsList";
import HeaderForms from "@/components/admin/FormsHeader";

export default function AdminPage() {
  return (
    <div className="px-12 py-5">
      <HeaderForms />
      <FormsList />
    </div>
  );
}
