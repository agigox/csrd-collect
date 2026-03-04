"use client";

import type { FormTemplate } from "@/models/FormTemplate";
import { FormPreviewContent } from "@/features/form-editor/FormPreview";

interface PreviewTabProps {
  form: FormTemplate;
}

export function PreviewTab({ form }: PreviewTabProps) {
  return (
    <FormPreviewContent
      schema={form.schema.fields}
      emptyText="Ce formulaire ne contient aucun champ"
    />
  );
}
