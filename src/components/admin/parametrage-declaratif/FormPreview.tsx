"use client";

import { useMemo } from "react";
import { EmptyState } from "@/components/common";
import { DynamicForm } from "@/lib/form-creation/DynamicForm";
import { useFormEditorStore } from "@/stores/formEditorStore";
import { Divider, Icon } from "@rte-ds/react";

export function FormPreview() {
  const { formId, formName, schema, setShowPreview } = useFormEditorStore();

  // Derive preview values from schema's defaultValue
  const previewValues = useMemo(() => {
    return schema.reduce(
      (acc, field) => {
        if (field.defaultValue !== undefined) {
          acc[field.name] = field.defaultValue;
        }
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }, [schema]);

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
        <div className="flex flex-col">
          {formName && (
            <div className={`heading-s ${!formId ? "pb-6" : ""}`}>
              {formName}
            </div>
          )}
          {formId && (
            <div className="text-xs text-muted-foreground uppercase pb-6">
              ID {formId}
            </div>
          )}
        </div>
        {schema.length === 0 ? (
          <EmptyState text="Ajoutez des champs pour voir l'aperçu" />
        ) : (
          <DynamicForm schema={schema} values={previewValues} readOnly />
        )}
      </div>
    </div>
  );
}
