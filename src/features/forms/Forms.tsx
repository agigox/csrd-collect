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
import LoadingState from "@/lib/ui/loading-state";

export default function Forms() {
  const router = useRouter();
  const { forms, loading, fetchForms, publishForm, unpublishForm } = useFormsStore();
  const { categoryCodes, fetchCategoryCodes } = useCategoryCodesStore();
  const {
    setFormName,
    setFormDescription,
    setFormCategoryCode,
    setFormVisibilityLevel,
  } = useFormEditorStore();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { isBelow } = useBreakpoint();
  const isMobile = isBelow("s");

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

  const handleUnpublish = useCallback(
    async (formId: string) => {
      await unpublishForm(formId);
    },
    [unpublishForm],
  );

  const handleCreateValidate = useCallback(
    (data: {
      name: string;
      categoryCode: string;
      description: string;
      visibilityLevel: string;
    }) => {
      setFormName(data.name);
      setFormCategoryCode(data.categoryCode);
      setFormDescription(data.description);
      setFormVisibilityLevel(data.visibilityLevel);
      setIsCreateModalOpen(false);
      router.push("/admin/new");
    },
    [
      setFormName,
      setFormCategoryCode,
      setFormDescription,
      setFormVisibilityLevel,
      router,
    ],
  );

  if (loading) {
    return <LoadingState message="Chargement des formulaires..." />;
  }

  return (
    <div className="max-w-480 mx-auto h-full">
      <Grid gridType="fluid" className="h-full">
        {!(isMobile && selectedForm) && (
          <Grid.Col xxs={2} xs={6} s={3} m={5} className="overflow-hidden">
            <FormsList
              forms={forms}
              categoryCodes={categoryCodes}
              selectedFormId={selectedForm?.id ?? null}
              onSelectForm={handleSelectForm}
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
            onUnpublish={handleUnpublish}
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
