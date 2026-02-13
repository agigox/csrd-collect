"use client";

import { useState, useEffect, useCallback } from "react";
import DeclarationsList from "./declarationsList";
import FormSelectionDialog from "./FormSelectionDialog";
import { useAuthStore, useFormsStore, type FormDefinition } from "@/stores";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/lib/ui/dialog";
import { Button } from "@/lib/ui/button";
import { DynamicForm } from "@/features/form-builder/DynamicForm";
import Icon from "@/lib/Icons";
import { ScrollableContainer } from "@/lib/utils/ScrollableContainer";
import ModificationHistory from "./ModificationHistory";
import { useDeclarationsStore, type Declaration } from "@/stores";

const Declarations = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const {
    updateDeclaration,
    addTempDeclaration,
    updateTempDeclaration,
    removeTempDeclaration,
    confirmTempDeclaration,
  } = useDeclarationsStore();
  const { forms, fetchForms } = useFormsStore();
  const [selectionDialogOpen, setSelectionDialogOpen] = useState(false);
  const [declarationDialogOpen, setDeclarationDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormDefinition | null>(null);
  const [selectedDeclaration, setSelectedDeclaration] =
    useState<Declaration | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showHistory, setShowHistory] = useState(true);
  const [tempDeclarationId, setTempDeclarationId] = useState<string | null>(
    null,
  );

  // Load forms when component mounts
  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  // Don't render declarations if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleOpenSelection = () => {
    setSelectionDialogOpen(true);
  };

  const handleFormSelect = (form: FormDefinition) => {
    setSelectedForm(form);
    setFormValues({});
    setFormErrors({});

    // Create temporary declaration
    const tempId = `temp_${Date.now()}`;
    const now = new Date().toISOString();

    const tempDeclaration: Declaration = {
      id: tempId,
      formTemplateId: form.id,
      reference: `DECL-TEMP-${Date.now()}`,
      location: "",
      authorId: "current-user",
      authorName: "Utilisateur actuel",
      teamId: "current-team",
      title: form.name || "Nouvelle déclaration",
      description: form.description || "",
      status: "draft",
      formData: {},
      submitedBy: "",
      reviewedBy: "",
      reviewComment: "",
      createdAt: now,
      updatedAt: now,
      submittedAt: "",
      reviewedAt: "",
      isActive: true,
      isNew: true,
    };

    addTempDeclaration(tempDeclaration);
    setTempDeclarationId(tempId);
    setSelectedDeclaration(tempDeclaration);
    setDeclarationDialogOpen(true);
  };

  const handleCloseDeclaration = (open: boolean) => {
    setDeclarationDialogOpen(open);
    if (!open) {
      // If closing with a temp declaration, remove it
      if (tempDeclarationId) {
        removeTempDeclaration(tempDeclarationId);
        setTempDeclarationId(null);
      }
      setSelectedForm(null);
      setSelectedDeclaration(null);
      setFormValues({});
      setFormErrors({});
    }
  };

  // Handler for editing an existing declaration
  const handleEditDeclaration = (declaration: Declaration) => {
    // If switching from a temp declaration to another, remove the temp
    if (tempDeclarationId && declaration.id !== tempDeclarationId) {
      removeTempDeclaration(tempDeclarationId);
      setTempDeclarationId(null);
    }

    // If this is the temp declaration, keep track of it
    if (declaration.isNew) {
      setTempDeclarationId(declaration.id);
    } else {
      setTempDeclarationId(null);
    }

    setSelectedDeclaration(declaration);
    // Load the form associated with this declaration
    const declarationForm = forms.find((f) => f.id === declaration.formTemplateId);
    if (declarationForm) {
      setSelectedForm(declarationForm);
      // Pre-fill form values from the declaration
      setFormValues(declaration.formData || {});
    }
    setFormErrors({});
    // Only open if not already open
    if (!declarationDialogOpen) {
      setDeclarationDialogOpen(true);
    }
  };

  // Handler for form value changes - sync with temp declaration
  const handleFormValuesChange = useCallback(
    (newValues: Record<string, unknown>) => {
      setFormValues(newValues);

      // Sync with temp declaration in real-time
      if (tempDeclarationId) {
        // Extract title from form values if available
        const titleField = Object.entries(newValues).find(
          ([key]) =>
            key.toLowerCase().includes("titre") ||
            key.toLowerCase().includes("title"),
        );
        const title = titleField ? String(titleField[1] || "") : undefined;

        updateTempDeclaration(tempDeclarationId, {
          formData: newValues,
          updatedAt: new Date().toISOString(),
          ...(title && { title }),
        });
      }
    },
    [tempDeclarationId, updateTempDeclaration],
  );

  // Handler for submitting the form
  const handleSubmit = async () => {
    if (selectedDeclaration) {
      if (tempDeclarationId && selectedDeclaration.id === tempDeclarationId) {
        // Confirm temp declaration (create new)
        await confirmTempDeclaration(tempDeclarationId);
        setTempDeclarationId(null);
      } else {
        // Update existing declaration
        await updateDeclaration(selectedDeclaration.id, formValues);
      }
    }
    // Close without removing temp (it's been confirmed or it's an existing declaration)
    setDeclarationDialogOpen(false);
    setSelectedForm(null);
    setSelectedDeclaration(null);
    setFormValues({});
    setFormErrors({});
    setTempDeclarationId(null);
  };

  return (
    <div className="flex justify-start px-8">
      <DeclarationsList
        onDeclarer={handleOpenSelection}
        onEditDeclaration={handleEditDeclaration}
        selectedDeclarationId={selectedDeclaration?.id}
      />

      {/* Modal de sélection du type de formulaire */}
      <FormSelectionDialog
        open={selectionDialogOpen}
        onOpenChange={setSelectionDialogOpen}
        onFormSelect={handleFormSelect}
      />

      {/* Modal de déclaration avec le formulaire sélectionné */}
      <Dialog
        open={declarationDialogOpen}
        onOpenChange={handleCloseDeclaration}
        modal={false}
      >
        <DialogContent
          hideOverlay
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          className="fixed! top-0! right-0! left-auto! h-screen! w-198! max-w-none! translate-x-0! translate-y-0! rounded-none! border-l! border-y-0! border-r-0! flex! flex-col! min-h-0!"
        >
          <DialogHeader>
            <div className="flex items-center gap-2 justify-between">
              <DialogTitle>
                <div className="flex flex-col">
                  <div>
                    {selectedDeclaration?.isNew
                      ? "Nouvelle déclaration"
                      : "Modifier la déclaration"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ID {selectedDeclaration?.id || selectedForm?.id || ""}
                  </div>
                </div>
              </DialogTitle>
              {selectedDeclaration && !showHistory && (
                <Icon
                  name="listAlt"
                  size={24}
                  className="cursor-pointer hover:opacity-70"
                  onClick={() => setShowHistory(true)}
                />
              )}
            </div>
          </DialogHeader>

          <div className="h-px w-full bg-border" />

          {(selectedForm || selectedDeclaration) && (
            <div className="flex flex-1 min-h-0">
              {selectedForm && (
                <ScrollableContainer className="flex-1 pt-4 pr-4" height="100%">
                  <DynamicForm
                    schema={selectedForm.schema.fields}
                    values={formValues}
                    onChange={handleFormValuesChange}
                    errors={formErrors}
                  />
                </ScrollableContainer>
              )}
              {!selectedForm && selectedDeclaration && (
                <div className="flex-1 p-4 text-center text-muted-foreground">
                  <p className="mb-2 font-semibold">
                    {selectedDeclaration.title}
                  </p>
                  <p>{selectedDeclaration.description}</p>
                </div>
              )}
              {selectedDeclaration && showHistory && (
                <ModificationHistory
                  entries={selectedDeclaration.history || []}
                  onClose={() => setShowHistory(false)}
                />
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => handleCloseDeclaration(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleSubmit}>Soumettre</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Declarations;
