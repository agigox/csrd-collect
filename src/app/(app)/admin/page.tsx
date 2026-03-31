"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Forms from "@/features/forms/Forms";
import FormEditor from "@/features/form-editor";

function AdminContent() {
  const searchParams = useSearchParams();
  const formId = searchParams.get("id");

  if (formId) {
    return <FormEditor />;
  }

  return <Forms />;
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <AdminContent />
    </Suspense>
  );
}
