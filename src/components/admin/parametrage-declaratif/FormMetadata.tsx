"use client";

import { useCategoryCodesStore } from "@/stores";
import { useFormEditorStore } from "@/stores/formEditorStore";
import { useFormsStore } from "@/stores";
import { Card, Select, Textarea } from "@rte-ds/react";

export function FormMetadata() {
  const { currentForm } = useFormsStore();
  const { categoryCodes } = useCategoryCodesStore();
  const {
    formCategoryCode,
    setFormCategoryCode,
    formDescription,
    setFormDescription,
  } = useFormEditorStore();

  return (
    <Card style={{ background: "#233857", width: "100%" }}>
      <div
        className="flex w-full flex-col gap-3.5 px-4 pb-4 pt-2"
        data-theme="violet"
        data-mode="dark"
      >
        <Select
          key={`category-${currentForm?.id ?? "new"}-${formCategoryCode}`}
          id="select-category-id"
          assistiveAppearance="description"
          label="Catégorie"
          onChange={setFormCategoryCode}
          options={categoryCodes}
          showLabel
          width={280}
          value={formCategoryCode}
          showResetButton={true}
        />
        <Textarea
          label="Description"
          onChange={(e) => setFormDescription(e.target.value)}
          labelId="form-description-label-id"
          rows={1}
          value={formDescription}
          onKeyDown={(e) => e.stopPropagation()}
        />
      </div>
    </Card>
  );
}
