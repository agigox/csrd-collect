"use client";

import { EmptyState } from "@/components/common";
import { DynamicForm } from "@/lib/form-fields/DynamicForm";
import { ScrollableContainer } from "@/lib/utils/ScrollableContainer";
import { useFormEditorStore } from "@/stores/formEditorStore";
import { Divider, Icon } from "@rte-ds/react";

export function FormPreview() {
  const {
    formId,
    formName,
    schema,
    previewValues,
    setPreviewValues,
    previewErrors,
    setShowPreview,
  } = useFormEditorStore();

  return (
    <div className="w-81 shrink-0 flex flex-col gap-4 p-6 bg-white shadow-[0px_4px_8px_0px_rgba(0,0,0,0.14),0px_0px_2px_0px_rgba(0,0,0,0.12)]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between h-6">
          <div className="heading-xs text-background-neutral-bold-default">
            Pré visualisation
          </div>
          <button
            onClick={() => setShowPreview(false)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Fermer la prévisualisation"
          >
            <Icon name="close" size={20} color="var(--content-primary)" />
          </button>
        </div>
        <Divider
          appearance="default"
          orientation="horizontal"
          thickness="medium"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col h-15.5">
          {formName && <div className="heading-s">{formName}</div>}
          {formId && (
            <div className="text-xs text-muted-foreground uppercase">
              ID {formId}
            </div>
          )}
        </div>
        <ScrollableContainer className="flex-1 space-y-6">
          {schema.length === 0 ? (
            <EmptyState text="Ajoutez des champs pour voir l'aperçu" />
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
    </div>
  );
}
