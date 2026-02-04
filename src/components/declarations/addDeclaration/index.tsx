"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/lib/ui/dialog";
import { Button } from "@/lib/ui/button";
import Icon from "@/lib/Icons";
import FormSelectionDialog from "../FormSelectionDialog";
import { type FormDefinition } from "@/stores";
import { DynamicForm } from "@/lib/form-fields/DynamicForm";

interface AddDeclarationProps {
  triggerButton?: boolean;
}

const AddDeclaration = ({ triggerButton = true }: AddDeclarationProps) => {
  const [selectionDialogOpen, setSelectionDialogOpen] = useState(false);
  const [declarationDialogOpen, setDeclarationDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormDefinition | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
    <>
      {triggerButton && (
        <Button onClick={handleOpenSelection}>
          <span>Déclarer</span>
          <Icon name="campaign" />
        </Button>
      )}

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
        <DialogContent className="!fixed !top-0 !right-0 !left-auto !h-screen !w-[547px] !max-w-none !translate-x-0 !translate-y-0 !rounded-none !border-l !border-y-0 !border-r-0 data-[state=open]:!animate-slide-in-from-right data-[state=closed]:!animate-slide-out-to-right">
          <DialogHeader>
            <DialogTitle>Nouvelle déclaration</DialogTitle>
            <DialogDescription>
              {selectedForm?.title || "Formulaire"}
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
    </>
  );
};

export default AddDeclaration;
