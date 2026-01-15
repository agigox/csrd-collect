"use client";

import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
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
import { DynamicForm } from "@/lib/form-fields";
import Icon from "@/lib/Icons";
import { ScrollableContainer } from "@/lib/utils/ScrollableContainer";
import ModificationHistory from "./ModificationHistory";
import { useDeclarationsStore, type Declaration } from "@/stores";

const Declarations = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const updateDeclaration = useDeclarationsStore(
    (state) => state.updateDeclaration
  );
  const { forms, fetchForms } = useFormsStore();
  const [selectionDialogOpen, setSelectionDialogOpen] = useState(false);
  const [declarationDialogOpen, setDeclarationDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormDefinition | null>(null);
  const [selectedDeclaration, setSelectedDeclaration] =
    useState<Declaration | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showHistory, setShowHistory] = useState(true);

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
    setDeclarationDialogOpen(true);
  };

  const handleCloseDeclaration = (open: boolean) => {
    setDeclarationDialogOpen(open);
    if (!open) {
      setSelectedForm(null);
      setSelectedDeclaration(null);
      setFormValues({});
      setFormErrors({});
    }
  };

  // Handler for editing an existing declaration
  const handleEditDeclaration = (declaration: Declaration) => {
    setSelectedDeclaration(declaration);
    // Load the form associated with this declaration
    const declarationForm = forms.find((f) => f.id === declaration.formId);
    if (declarationForm) {
      setSelectedForm(declarationForm);
      // Pre-fill form values from the declaration
      setFormValues(declaration.formValues || {});
    }
    setFormErrors({});
    setDeclarationDialogOpen(true);
  };

  // Handler for submitting the form
  const handleSubmit = async () => {
    if (selectedDeclaration) {
      // Update existing declaration
      await updateDeclaration(selectedDeclaration.id, formValues);
    } else {
      // TODO: Create new declaration
      console.log("Créer nouvelle déclaration:", formValues);
    }
    handleCloseDeclaration(false);
  };

  return (
    <div className="p-8 flex gap-8">
      <div className="flex-1">
        <DeclarationsList
          onDeclarer={handleOpenSelection}
          onEditDeclaration={handleEditDeclaration}
        />
      </div>
      <div className="flex-1">
        <Dashboard onDeclarer={handleOpenSelection} />
      </div>

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
      >
        <DialogContent className="fixed! top-0! right-0! left-auto! h-screen! w-198! max-w-none! translate-x-0! translate-y-0! rounded-none! border-l! border-y-0! border-r-0! data-[state=open]:animate-slide-in-from-right! data-[state=closed]:animate-slide-out-to-right! flex! flex-col! min-h-0!">
          <DialogHeader>
            <div className="flex items-center gap-2 justify-between">
              <DialogTitle>
                <div className="flex flex-col">
                  <div>
                    {selectedDeclaration
                      ? "Modifier la déclaration"
                      : "Nouvelle déclaration"}
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
                    schema={selectedForm.schema}
                    values={formValues}
                    onChange={setFormValues}
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
