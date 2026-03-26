"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useFormsStore, useCategoryCodesStore } from "@/stores";
import { useFormEditorStore } from "@/stores/formEditorStore";
import { Button, IconButton, Modal, Toast, useBreakpoint } from "@rte-ds/react";

import { FormHeader } from "./FormHeader";
import { SchemaBuilder } from "./SchemaBuilder";
import { FormPreview } from "./FormPreview";
import { ScrollableContainer } from "@/lib/utils/ScrollableContainer";
import { I18nErrorKey } from "@/lib/utils/i18nErrors";
import { ErrorState } from "@/lib/ui/error-state";

export default function FormCreation() {
  const router = useRouter();
  const pathname = usePathname();

  const { forms, loading, saveForm, createForm, deleteForm, fetchForms } =
    useFormsStore();

  const { fetchCategoryCodes } = useCategoryCodesStore();

  const {
    formName,
    formDescription,
    formCategoryCode,
    formVisibilityLevel,
    schema,
    showPreview,
    pendingNavigation,
    setShowPreview,
    setIsSaving,
    initializeFromForm,
    setPendingNavigation,
    reset: resetFormEditor,
  } = useFormEditorStore();

  const { breakpoint, width } = useBreakpoint();

  const searchParams = useSearchParams();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // Derive form ID from URL
  const formId = useMemo(() => {
    if (pathname === "/admin/new") return null;
    return searchParams.get("id");
  }, [pathname, searchParams]);

  // Get current form from forms array based on URL
  const currentForm = useMemo(() => {
    if (!formId) return null;
    return forms.find((f) => f.id === formId) || null;
  }, [formId, forms]);

  useEffect(() => {
    fetchForms();
    fetchCategoryCodes();
  }, [fetchForms, fetchCategoryCodes]);

  // Only initialize from an existing form (edit mode).
  // For new forms (/admin/new), the store is pre-populated by the CreateFormModal.
  useEffect(() => {
    if (currentForm) {
      initializeFromForm(currentForm);
    }
  }, [currentForm, initializeFromForm]);

  const isEditMode = currentForm !== null;

  // Show leave confirm when sidebar navigation is intercepted
  useEffect(() => {
    if (pendingNavigation) {
      setShowLeaveConfirm(true);
    }
  }, [pendingNavigation]);

  const handleSave = async () => {
    setSaveError(null);

    if (!formName.trim()) {
      setSaveError("Veuillez entrer un titre pour la donnée déclarée");
      return;
    }

    setIsSaving(true);

    try {
      if (currentForm) {
        await saveForm({
          ...currentForm,
          name: formName,
          description: formDescription,
          categoryCode: formCategoryCode,
          visibilityLevel: formVisibilityLevel || currentForm.visibilityLevel,
          schema: { fields: schema },
        });
      } else {
        await createForm({
          name: formName,
          description: formDescription,
          categoryCode: formCategoryCode,
          visibilityLevel: formVisibilityLevel || undefined,
          schema: { fields: schema },
        });
      }
      setShowSuccessToast(true);
      setTimeout(() => router.push("/admin"), 1500);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      setSaveError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la sauvegarde du formulaire",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (currentForm && confirm("Supprimer ce formulaire ?")) {
      deleteForm(currentForm.id);
      resetFormEditor();
      router.push("/admin");
    }
  };

  // Check if the form has unsaved content
  const hasUnsavedContent = schema.length > 0 || formName.trim() !== "";

  const handleBack = () => {
    if (hasUnsavedContent && !isEditMode) {
      setShowLeaveConfirm(true);
    } else {
      resetFormEditor();
      router.push("/admin");
    }
  };

  const handleLeaveDiscard = () => {
    const destination = pendingNavigation || "/admin";
    setShowLeaveConfirm(false);
    resetFormEditor();
    router.push(destination);
  };

  const handleLeaveSave = async () => {
    const destination = pendingNavigation || "/admin";
    setShowLeaveConfirm(false);
    setPendingNavigation(null);
    await handleSave();
    // handleSave already navigates to /admin on success,
    // but if the destination differs, override it
    if (destination !== "/admin") {
      setTimeout(() => router.push(destination), 1500);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      <div className={`flex-1 relative ${showPreview ? "pr-92" : ""}`}>
        <Button
          label="Retour"
          icon="arrow-left"
          iconPosition="left"
          onClick={handleBack}
          variant="transparent"
          className="h-6 top-2.25 left-2 absolute"
        />

        <ScrollableContainer
          className={`py-5 mx-auto ${breakpoint === "l" ? "w-200" : "w-150.5"}`}
          height="100%"
        >
          <FormHeader
            isEditMode={isEditMode}
            onSave={handleSave}
            onDelete={handleDelete}
          />

          {saveError && (
            <ErrorState
              message={I18nErrorKey[saveError] || saveError}
              className="mb-4"
            />
          )}

          <div className="flex flex-col gap-6 px-1 pb-1">
            <SchemaBuilder />
          </div>
        </ScrollableContainer>
      </div>
      {showPreview ? (
        <FormPreview />
      ) : width <= 1190 ? (
        <IconButton
          appearance="filled"
          aria-label="Prévisualiser"
          name="visibility-show"
          onClick={() => setShowPreview(true)}
          size="m"
          variant="secondary"
          className="right-8 top-11 relative"
        />
      ) : (
        <Button
          icon="visibility-show"
          iconPosition="left"
          iconAppearance="filled"
          label="Prévisualiser"
          onClick={() => setShowPreview(true)}
          variant="secondary"
          className="right-8 top-11 absolute"
        />
      )}

      <Modal
        id="leave-form-confirm"
        isOpen={showLeaveConfirm}
        onClose={() => { setShowLeaveConfirm(false); setPendingNavigation(null); }}
        title="Enregistrer le formulaire"
        size="s"
        primaryButton={
          <Button
            variant="primary"
            label="Enregistrer"
            onClick={handleLeaveSave}
          />
        }
        secondaryButton={
          <Button
            variant="danger"
            label="Supprimer"
            onClick={handleLeaveDiscard}
          />
        }
      >
        <p>Voulez-vous conserver ce formulaire ?</p>
      </Modal>

      <Toast
        message="Formulaire sauvegardé avec succès"
        type="success"
        isOpen={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        closable
        autoDismiss
        duration="medium"
        placement="top-right"
      />
    </div>
  );
}
