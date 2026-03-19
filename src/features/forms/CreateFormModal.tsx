"use client";

import { useState } from "react";
import { Modal, Button, TextInput, Select, Textarea } from "@rte-ds/react";
import { useCategoryCodesStore } from "@/stores/categoryCodesStore";

interface CreateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate: (data: {
    name: string;
    categoryCode: string;
    description: string;
    visibilityLevel: string;
  }) => void;
}

const EDITABLE_BY_OPTIONS = [
  { value: "equipe", label: "Equipe" },
  { value: "gre", label: "GRE" },
  { value: "utilisateur", label: "Utilisateur" },
];

export default function CreateFormModal({
  isOpen,
  onClose,
  onValidate,
}: CreateFormModalProps) {
  const { categoryCodes } = useCategoryCodesStore();

  const [name, setName] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [description, setDescription] = useState("");
  const [visibilityLevel, setEditableBy] = useState("");
  const [nameError, setNameError] = useState(false);

  const resetForm = () => {
    setName("");
    setCategoryCode("");
    setDescription("");
    setEditableBy("");
    setNameError(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleValidate = () => {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    onValidate({ name: name.trim(), categoryCode, description, visibilityLevel });
    resetForm();
  };

  return (
    <Modal
      id="create-form"
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      title="Créer un formulaire"
      size="xs"
      primaryButton={
        <Button variant="primary" label="Valider" onClick={handleValidate} />
      }
    >
      <div className="flex flex-col gap-4 w-full">
        <p className="text-sm text-content-secondary">
          Avant de commencer, veuillez renseigner les informations suivantes :
        </p>
        <TextInput
          label="Titre du formulaire"
          value={name}
          onChange={(value) => {
            setName(value);
            if (nameError) setNameError(false);
          }}
          required
          showRightIcon={false}
          error={nameError}
          assistiveTextLabel={
            nameError ? "Le titre est obligatoire" : undefined
          }
          assistiveAppearance={nameError ? "error" : "description"}
          onKeyDown={(e) => e.stopPropagation()}
          width={392}
        />
        <Select
          id="create-form-category"
          label="Norme"
          value={categoryCode}
          onChange={setCategoryCode}
          options={categoryCodes}
          showResetButton
          onClear={() => setCategoryCode("")}
          width={280}
        />
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          onKeyDown={(e) => e.stopPropagation()}
        />
        <Select
          id="create-form-editable-by"
          label="Modifiable par"
          value={visibilityLevel}
          onChange={setEditableBy}
          options={EDITABLE_BY_OPTIONS}
          showResetButton
          onClear={() => setEditableBy("")}
          width={280}
        />
      </div>
    </Modal>
  );
}
