"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Grid, useBreakpoint } from "@rte-ds/react";
import { FormsList } from "./FormsList";
import { FormDetailPanel } from "./FormDetailPanel";
import CreateFormModal from "./CreateFormModal";
import { useFormsStore } from "@/stores";
import { useCategoryCodesStore } from "@/stores/categoryCodesStore";
import { useFormEditorStore } from "@/stores/formEditorStore";
import type { FormTemplate } from "@/models/FormTemplate";

export default function AdminPageContent() {
  const router = useRouter();
  const { forms, loading, fetchForms, publishForm } = useFormsStore();
  const { categoryCodes, fetchCategoryCodes } = useCategoryCodesStore();
  const { setFormName, setFormDescription, setFormCategoryCode, setFormVisibilityLevel } =
    useFormEditorStore();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { isBelow } = useBreakpoint();
  const isMobile = isBelow("s");

  // Derive selectedForm from forms array - automatically stays in sync
  const selectedForm = useMemo(
    () =>
      selectedFormId
        ? (forms.find((f) => f.id === selectedFormId) ?? null)
        : null,
    [forms, selectedFormId],
  );

  useEffect(() => {
    fetchForms();
    fetchCategoryCodes();
  }, [fetchForms, fetchCategoryCodes]);

  // Filter forms by search query (case-insensitive on form.name)
  const filteredForms = useMemo(() => {
    if (!searchQuery.trim()) return forms;
    const query = searchQuery.toLowerCase().trim();
    return forms.filter((f) => f.name.toLowerCase().includes(query));
  }, [forms, searchQuery]);

  // Group filtered forms by categoryCode
  const groupedForms = useMemo(() => {
    const groups: Record<string, FormTemplate[]> = {};
    for (const form of filteredForms) {
      const key = form.categoryCode || "other";
      if (!groups[key]) groups[key] = [];
      groups[key].push(form);
    }
    return groups;
  }, [filteredForms]);

  const handleSelectForm = useCallback((form: FormTemplate) => {
    setSelectedFormId(form.id);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedFormId(null);
  }, []);

  const handlePublish = useCallback(
    async (formId: string) => {
      await publishForm(formId);
    },
    [publishForm],
  );

  const handleCreateValidate = useCallback(
    (data: { name: string; categoryCode: string; description: string; visibilityLevel: string }) => {
      setFormName(data.name);
      setFormCategoryCode(data.categoryCode);
      setFormDescription(data.description);
      setFormVisibilityLevel(data.visibilityLevel);
      setIsCreateModalOpen(false);
      router.push("/admin/new");
    },
    [setFormName, setFormCategoryCode, setFormDescription, setFormVisibilityLevel, router],
  );

  if (loading) {
    return (
      <div className="text-center py-8">Chargement des formulaires...</div>
    );
  }

  return (
    <div className="max-w-480 mx-auto h-full">
      <Grid gridType="fluid">
        {!(isMobile && selectedForm) && (
          <Grid.Col xxs={2} xs={6} s={3} m={5}>
            <FormsList
              forms={filteredForms}
              groupedForms={groupedForms}
              categoryCodes={categoryCodes}
              selectedFormId={selectedForm?.id ?? null}
              onSelectForm={handleSelectForm}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onCreateForm={() => setIsCreateModalOpen(true)}
            />
          </Grid.Col>
        )}
        <Grid.Col xxs={2} xs={6} s={3} m={7}>
          <FormDetailPanel
            form={selectedForm}
            open={!!selectedForm}
            onClose={handleClosePanel}
            onPublish={handlePublish}
          />
        </Grid.Col>
      </Grid>
      <CreateFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onValidate={handleCreateValidate}
      />
    </div>
  );
}
