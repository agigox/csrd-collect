"use client";

import { Button } from "@rte-ds/react";
import { FormCard } from "./FormCard";
import { getFormStatus } from "./statusConfig";
import { FormsListView } from "@/components/FormsListView";
import PageTitle from "@/lib/ui/page-title";
import type { FormTemplate } from "@/models/FormTemplate";
import type { CategoryCode } from "@/models/CategoryCode";

interface FormsListProps {
  forms: FormTemplate[];
  categoryCodes: CategoryCode[];
  selectedFormId: string | null;
  onSelectForm: (form: FormTemplate) => void;
  onCreateForm: () => void;
}

export const FormsList = ({
  forms,
  categoryCodes,
  selectedFormId,
  onSelectForm,
  onCreateForm,
}: FormsListProps) => {
  return (
    <div className="flex flex-col gap-5 my-5 ml-8 mr-4 h-full overflow-hidden">
      <PageTitle title="Administration des déclarations" />
      <div className="text-center">
        <Button
          icon="add-box"
          iconPosition="right"
          label="Créer une déclaration"
          size="m"
          variant="primary"
          onClick={onCreateForm}
        />
      </div>
      <FormsListView
        forms={forms}
        categoryCodes={categoryCodes}
        className="flex-1 min-h-0 overflow-y-auto mb-8"
        renderItem={(form) => (
          <FormCard
            key={form.id}
            title={form.name}
            status={getFormStatus(form)}
            selected={selectedFormId === form.id}
            onClick={() => onSelectForm(form)}
          />
        )}
      />
    </div>
  );
};
