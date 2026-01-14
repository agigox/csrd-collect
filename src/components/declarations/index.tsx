"use client";

import { useState } from "react";
import Dashboard from "./Dashboard";
import DeclarationsList from "./declarationsList";
import FormSelectionDialog from "./FormSelectionDialog";
import { useAuthStore, type FormDefinition } from "@/stores";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/ui/dialog";
import { Button } from "@/lib/components/ui/button";
import { DynamicForm } from "@/lib/form-fields";

const Declarations = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [selectionDialogOpen, setSelectionDialogOpen] = useState(false);
  const [declarationDialogOpen, setDeclarationDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormDefinition | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
      setFormValues({});
      setFormErrors({});
    }
  };

  return (
    <div className="p-8 flex gap-8">
      <div className="flex-1">
        <DeclarationsList onDeclarer={handleOpenSelection} />
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
        <DialogContent className="fixed! top-0! right-0! !left-auto !h-screen !w-[547px] !max-w-none !translate-x-0 !translate-y-0 !rounded-none !border-l !border-y-0 !border-r-0 data-[state=open]:!animate-slide-in-from-right data-[state=closed]:!animate-slide-out-to-right">
          <DialogHeader>
            <DialogTitle>Nouvelle déclaration</DialogTitle>
            <DialogDescription>
              {selectedForm?.name || "Formulaire"}
            </DialogDescription>
          </DialogHeader>

          {selectedForm && (
            <div className="flex-1 overflow-y-auto py-4">
              <DynamicForm
                schema={selectedForm.schema}
                values={formValues}
                onChange={setFormValues}
                errors={formErrors}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => handleCloseDeclaration(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={() => {
                console.log("Soumettre:", formValues);
                handleCloseDeclaration(false);
              }}
            >
              Soumettre
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Declarations;
