"use client";

import { useState, useMemo } from "react";
import { Searchbar, Chip } from "@rte-ds/react";
import { AccordionSection } from "@/features/forms/AccordionSection";
import { getFormStatus } from "@/features/forms/statusConfig";
import { EmptyCard } from "@/lib/ui/empty-card";
import type { FormTemplate } from "@/models/FormTemplate";
import type { CategoryCode } from "@/models/CategoryCode";

type StatusFilter = "all" | "published" | "draft";

interface FormsListViewProps {
  forms: FormTemplate[];
  categoryCodes: CategoryCode[];
  renderItem: (form: FormTemplate) => React.ReactNode;
  emptyMessage?: string;
  showStatusFilter?: boolean;
  searchPlaceholder?: string;
  className?: string;
  "data-testid"?: string;
}

export const FormsListView = ({
  forms,
  categoryCodes,
  renderItem,
  emptyMessage = "Aucun formulaire trouvé",
  showStatusFilter = false,
  searchPlaceholder = "Rechercher",
  className,
  "data-testid": testId,
}: FormsListViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredForms = useMemo(() => {
    let result = forms;

    // Search by name + code
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.code.toLowerCase().includes(query),
      );
    }

    // Status filter
    if (showStatusFilter && statusFilter !== "all") {
      result = result.filter((f) => {
        const status = getFormStatus(f);
        return status === statusFilter;
      });
    }

    return result;
  }, [forms, searchQuery, showStatusFilter, statusFilter]);

  const groupedForms = useMemo(() => {
    const groups: Record<string, FormTemplate[]> = {};
    for (const form of filteredForms) {
      const key = form.categoryCode || "other";
      if (!groups[key]) groups[key] = [];
      groups[key].push(form);
    }
    return groups;
  }, [filteredForms]);

  const activeCategories = useMemo(() => {
    const cats = categoryCodes
      .filter((c) => groupedForms[c.value]?.length > 0)
      .map((c) => c.value);
    if (groupedForms["other"]?.length > 0) cats.push("other");
    return cats;
  }, [categoryCodes, groupedForms]);

  const getCategoryLabel = (code: string) => {
    if (code === "other") return "Non catégorisé";
    const cat = categoryCodes.find((c) => c.value === code);
    return cat?.label ?? code;
  };

  const hasResults = filteredForms.length > 0;

  return (
    <div
      className={`flex flex-col p-px ${className ?? ""}`}
      data-testid={testId}
    >
      <div className="shrink-0">
        <Searchbar
          appearance="secondary"
          value={searchQuery}
          onChange={(input) => setSearchQuery(input ?? "")}
          onClear={() => setSearchQuery("")}
          label={searchPlaceholder}
          showResetButton={!!searchQuery}
          fullWidth
        />

        {showStatusFilter && (
          <div className="flex items-center gap-2 mt-3">
            <Chip
              id="filter-all"
              label="Tous"
              selected={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
              clickable
            />
            <Chip
              id="filter-published"
              label="Publié"
              selected={statusFilter === "published"}
              onClick={() => setStatusFilter("published")}
              clickable
            />
            <Chip
              id="filter-draft"
              label="Brouillon"
              selected={statusFilter === "draft"}
              onClick={() => setStatusFilter("draft")}
              clickable
            />
          </div>
        )}
      </div>

      <div className="mt-3 flex-1 min-h-0 overflow-y-auto">
        {!hasResults ? (
          <EmptyCard message={emptyMessage} />
        ) : (
          <div className="flex flex-col gap-2">
            {activeCategories.map((catCode, index) => (
              <AccordionSection
                key={catCode}
                title={getCategoryLabel(catCode)}
                defaultOpen={index === 0}
                forceOpen={!!searchQuery}
                data-testid={`accordion-${catCode}`}
              >
                {groupedForms[catCode].map((form) => renderItem(form))}
              </AccordionSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
