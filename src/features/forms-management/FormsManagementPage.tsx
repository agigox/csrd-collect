"use client";

import { FormsList } from "./FormsList";
import PageTitle from "@/lib/ui/page-title";

export default function AdminPageContent() {
  return (
    <div className="px-8 py-2.5 gap-2 h-full border-2 border-red-500">
      <PageTitle title="Administration des formulaires de déclaration" />
      <FormsList />
    </div>
  );
}
