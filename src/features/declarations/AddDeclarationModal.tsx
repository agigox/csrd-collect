"use client";

import { useState } from "react";
import { Modal, Button } from "@rte-ds/react";
import Icon from "@/lib/Icons";
import FormSelectionDialog from "./FormSelectionModal";
import type { FormTemplate } from "@/models/FormTemplate";
import { DynamicForm } from "@/features/form-builder/DynamicForm";

interface AddDeclarationModalProps {
  triggerButton?: boolean;
}

const AddDeclarationModal = ({
  triggerButton = true,
}: AddDeclarationModalProps) => {
  const [selectionDialogOpen, setSelectionDialogOpen] = useState(false);
  const [declarationDialogOpen, setDeclarationDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleOpenSelection = () => {
    setSelectionDialogOpen(true);
  };

  const handleFormSelect = (form: FormTemplate) => {
    setSelectedForm(form);
    setFormValues({});
    setFormErrors({});
    setDeclarationDialogOpen(true);
  };

  const handleCloseDeclaration = () => {
    setDeclarationDialogOpen(false);
    setSelectedForm(null);
    setFormValues({});
    setFormErrors({});
  };

  return (
    <>
      {triggerButton && (
        <button
          onClick={handleOpenSelection}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary text-white hover:opacity-90"
        >
          <span>Déclarer</span>
          <Icon name="campaign" />
        </button>
      )}

      {/* Modal de sélection du type de formulaire */}
      <FormSelectionDialog
        open={selectionDialogOpen}
        onOpenChange={setSelectionDialogOpen}
        onFormSelect={handleFormSelect}
      />

      {/* Modal de déclaration avec le formulaire sélectionné */}
      <Modal
        id="declaration-form"
        isOpen={declarationDialogOpen}
        onClose={handleCloseDeclaration}
        closeOnOverlayClick={false}
        title="Nouvelle déclaration"
        description={selectedForm?.name || "Formulaire"}
        size="m"
        primaryButton={
          <Button
            variant="primary"
            label="Soumettre"
            onClick={() => {
              console.log("Soumettre:", formValues);
              handleCloseDeclaration();
            }}
          />
        }
        secondaryButton={
          <Button
            variant="secondary"
            label="Annuler"
            onClick={handleCloseDeclaration}
          />
        }
      >
        {selectedForm && (
          <div className="flex-1 overflow-y-auto py-4">
            <DynamicForm
              schema={selectedForm.schema.fields}
              values={formValues}
              onChange={setFormValues}
              errors={formErrors}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default AddDeclarationModal;
