"use client";

import { useSearchParams } from "next/navigation";
import Forms from "@/features/forms/Forms";
import FormEditor from "@/features/form-editor";

export default function AdminPage() {
  const searchParams = useSearchParams();
  const formId = searchParams.get("id");

  if (formId) {
    return <FormEditor />;
  }

  return <Forms />;
}
