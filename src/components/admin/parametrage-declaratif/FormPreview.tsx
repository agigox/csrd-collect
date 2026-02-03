"use client";

import { DynamicForm } from "@/lib/form-fields";
import { ScrollableContainer } from "@/lib/utils/ScrollableContainer";
import { useFormEditorStore } from "@/stores/formEditorStore";
import { Icon } from "@rte-ds/react";

export function FormPreview() {
  const {
    schema,
    previewValues,
    setPreviewValues,
    previewErrors,
    setShowPreview,
  } = useFormEditorStore();

  return (
    <div className="w-81 shrink-0 flex flex-col gap-4 p-6 bg-white shadow-[0px_4px_8px_0px_rgba(0,0,0,0.14),0px_0px_2px_0px_rgba(0,0,0,0.12)]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-content-primary">
            Pré visualisation
          </h2>
          <button
            onClick={() => setShowPreview(false)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Fermer la prévisualisation"
          >
            <Icon name="close" size={20} color="var(--content-primary)" />
          </button>
        </div>
      </div>

      <ScrollableContainer className="flex-1 space-y-6">
        {schema.length === 0 ? (
          <div className="text-center py-8 text-content-muted">
            Ajoutez des champs pour voir l&apos;aperçu
          </div>
        ) : (
          <DynamicForm
            schema={schema}
            values={previewValues}
            onChange={setPreviewValues}
            errors={previewErrors}
          />
        )}
      </ScrollableContainer>
    </div>
  );
}
