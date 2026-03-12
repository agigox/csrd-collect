"use client";

import { Searchbar, Button } from "@rte-ds/react";
import { FormCard } from "./FormCard";
import { AccordionSection } from "./AccordionSection";
import { getFormStatus } from "./statusConfig";
import { EmptyCard } from "@/lib/ui/EmptyCard";
import PageTitle from "@/lib/ui/page-title";
import type { FormTemplate } from "@/models/FormTemplate";
import type { CategoryCode } from "@/models/CategoryCode";

interface FormsListProps {
  forms: FormTemplate[];
  groupedForms: Record<string, FormTemplate[]>;
  categoryCodes: CategoryCode[];
  selectedFormId: string | null;
  onSelectForm: (form: FormTemplate) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateForm: () => void;
}

export const FormsList = ({
  forms,
  groupedForms,
  categoryCodes,
  selectedFormId,
  onSelectForm,
  searchQuery,
  onSearchChange,
  onCreateForm,
}: FormsListProps) => {
  const getCategoryLabel = (code: string) => {
    if (code === "other") return "Non catégorisé";
    const cat = categoryCodes.find((c) => c.value === code);
    return cat?.label ?? code;
  };

  // Only show categories that have matching forms, in API order
  const activeCategories = categoryCodes
    .filter((c) => groupedForms[c.value]?.length > 0)
    .map((c) => c.value);
  if (groupedForms["other"]?.length > 0) activeCategories.push("other");

  const hasResults = forms.length > 0;

  return (
    <div className="flex flex-col gap-5 py-2.5 pl-4 h-full overflow-y-auto">
      <PageTitle title="Admin. des déclarations" />
      <div className="text-center">
        <Button
          icon="add-box"
          iconPosition="right"
          label="Créer un formulaire"
          size="m"
          variant="primary"
          onClick={onCreateForm}
        />
      </div>
      <Searchbar
        appearance="secondary"
        value={searchQuery}
        onChange={(input) => onSearchChange(input ?? "")}
        onClear={() => onSearchChange("")}
        label="Rechercher"
        showResetButton={!!searchQuery}
        style={{ width: "100%" }}
      />
      {!hasResults ? (
        <EmptyCard message="Aucun formulaire trouvé" />
      ) : (
        <div className="flex flex-col gap-2">
          {activeCategories.map((catCode, index) => (
            <AccordionSection
              key={catCode}
              title={getCategoryLabel(catCode)}
              defaultOpen={index === 0}
              data-testid={`accordion-${catCode}`}
            >
              {groupedForms[catCode].map((form) => (
                <FormCard
                  key={form.id}
                  title={form.name}
                  status={getFormStatus(form)}
                  selected={selectedFormId === form.id}
                  onClick={() => onSelectForm(form)}
                />
              ))}
            </AccordionSection>
          ))}
        </div>
      )}
    </div>
  );
};
