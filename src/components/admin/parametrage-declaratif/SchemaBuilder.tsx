"use client";

import { EmptyState } from "@/components/common";
import { FormBuilder } from "@/lib/form-creation/FormBuilder";
import { useFormEditorStore } from "@/stores/formEditorStore";

export function SchemaBuilder() {
  const { schema, setSchema } = useFormEditorStore();

  if (schema.length === 0) {
    return (
      <EmptyState
        text="Aucune donnée configurée. Utilisez le bouton ci-dessous pour ajouter
          une donnée à déclarer."
        action={<FormBuilder schema={schema} onChange={setSchema} buttonOnly />}
      />
    );
  }

  return <FormBuilder schema={schema} onChange={setSchema} />;
}
