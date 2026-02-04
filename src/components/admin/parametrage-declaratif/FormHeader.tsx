"use client";

import { LabelField } from "@/lib/form-fields/field-configurator/common/LabelField";
import { useFormEditorStore } from "@/stores/formEditorStore";
import { Button, IconButton } from "@rte-ds/react";

interface FormHeaderProps {
  isEditMode: boolean;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

export function FormHeader({
  isEditMode,
  onSave,
  onDelete,
  onCancel,
}: FormHeaderProps) {
  const { formName, setFormName, isSaving } = useFormEditorStore();

  return (
    <div className="flex items-end justify-between gap-2.5 w-full h-14 mb-4">
      <LabelField
        value={formName}
        onChange={setFormName}
        placeholder="Titre du formulaire"
        label="Titre du formulaire"
        displayClassName="heading-m bg-background-hover"
        className="w-full"
      />
      <div className="flex gap-2.5 shrink-0 items-center">
        <Button
          icon="save"
          iconPosition="left"
          iconAppearance="filled"
          label={isSaving ? "Sauvegarde..." : "Enregistrer"}
          onClick={onSave}
          variant="primary"
        />

        {isEditMode && (
          <IconButton
            appearance="outlined"
            aria-label="Supprimer le formulaire"
            name="delete"
            onClick={onDelete}
            size="m"
            variant="danger"
          />
        )}

        <IconButton
          appearance="outlined"
          aria-label="Annuler"
          name="close"
          onClick={onCancel}
          size="m"
          variant="secondary"
        />
      </div>
    </div>
  );
}
