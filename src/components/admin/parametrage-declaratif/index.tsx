"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormsStore, useCategoryCodesStore } from "@/stores";
import { useFormEditorStore } from "@/stores/formEditorStore";
import { ScrollableContainer } from "@/lib/utils/ScrollableContainer";
import { Button } from "@rte-ds/react";

import { FormHeader } from "./FormHeader";
import { FormMetadata } from "./FormMetadata";
import { SchemaBuilder } from "./SchemaBuilder";
import { FormPreview } from "./FormPreview";

export default function AdminParametrageDeclaratifPage() {
  const router = useRouter();
  const {
    loading,
    currentForm,
    setCurrentForm,
    saveForm,
    createForm,
    deleteForm,
    fetchForms,
  } = useFormsStore();

  const { fetchCategoryCodes } = useCategoryCodesStore();

  const {
    formName,
    formDescription,
    formCategoryCode,
    schema,
    showPreview,
    setShowPreview,
    setIsSaving,
    initializeFromForm,
  } = useFormEditorStore();

  useEffect(() => {
    fetchForms();
    fetchCategoryCodes();
  }, [fetchForms, fetchCategoryCodes]);

  useEffect(() => {
    initializeFromForm(currentForm);
  }, [currentForm, initializeFromForm]);

  const isEditMode = currentForm !== null;

  const handleSave = async () => {
    if (!formName.trim()) {
      alert("Veuillez entrer un titre pour la donnée déclarée");
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
          schema: { fields: schema },
        });
      } else {
        const newForm = await createForm({
          name: formName,
          description: formDescription,
          categoryCode: formCategoryCode,
          schema: { fields: schema },
        });
        setCurrentForm(newForm);
      }
      alert("Formulaire sauvegardé avec succès !");
      router.push("/admin");
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      alert("Erreur lors de la sauvegarde du formulaire");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (currentForm && confirm("Supprimer ce formulaire ?")) {
      deleteForm(currentForm.id);
      router.push("/admin");
    }
  };

  const handleCancel = () => {
    setCurrentForm(null);
    router.push("/admin");
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
      <div className="flex-1 relative">
        <Button
          label="Retour"
          icon="arrow-left"
          iconPosition="left"
          onClick={() => router.push("/admin")}
          variant="transparent"
          className="h-6 top-2.25 left-2 absolute"
        />

        {!showPreview && (
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
        <div className="pt-5 mx-auto h-full w-150.5">
          <FormHeader
            isEditMode={isEditMode}
            onSave={handleSave}
            onDelete={handleDelete}
            onCancel={handleCancel}
          />
          <ScrollableContainer>
            <div className="flex flex-col gap-6">
              <FormMetadata />
              <SchemaBuilder />
            </div>
          </ScrollableContainer>
        </div>
      </div>
      {showPreview && <FormPreview />}
    </div>
  );
}
