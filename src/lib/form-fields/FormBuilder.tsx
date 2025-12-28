"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/lib/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/components/ui/popover";
import Icon, { IconName } from "@/lib/Icons";
import { FieldConfigurator } from "./FieldConfigurator";
import type { FieldConfig, FieldType } from "./types";

interface FormBuilderProps {
  schema: FieldConfig[];
  onChange: (schema: FieldConfig[]) => void;
  floatingButton?: boolean;
}

interface FieldTypeOption {
  type: FieldType;
  label: string;
  icon: IconName;
}

const fieldTypeOptions: FieldTypeOption[] = [
  { type: "text", label: "Champ simple", icon: "textField" },
  { type: "number", label: "Nombre", icon: "textField" },
  { type: "unit", label: "Quantité avec unité", icon: "textField" },
  { type: "select", label: "Liste déroulante", icon: "list" },
  { type: "switch", label: "Interrupteur", icon: "textField" },
];

export const FormBuilder = ({ schema, onChange, floatingButton = false }: FormBuilderProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateFieldName = (type: FieldType) => {
    const existingNames = schema.map((f) => f.name);
    let counter = 1;
    let name = `${type}_${counter}`;
    while (existingNames.includes(name)) {
      counter++;
      name = `${type}_${counter}`;
    }
    return name;
  };

  const handleAddField = (type: FieldType) => {
    const fieldName = generateFieldName(type);
    let newField: FieldConfig;

    if (type === "select") {
      newField = {
        name: fieldName,
        type: "select",
        label: "Nouveau champ",
        placeholder: "Sélectionner...",
        options: [{ value: "option1", label: "Option 1" }],
      };
    } else if (type === "number") {
      newField = {
        name: fieldName,
        type: "number",
        label: "Nouveau champ",
      };
    } else if (type === "unit") {
      newField = {
        name: fieldName,
        type: "unit",
        label: "Nouveau champ",
        unit: "L",
      };
    } else if (type === "switch") {
      newField = {
        name: fieldName,
        type: "switch",
        label: "Nouveau champ",
      };
    } else {
      newField = {
        name: fieldName,
        type: "text",
        label: "Nouveau champ",
        placeholder: "",
      };
    }

    onChange([...schema, newField]);
    setPopoverOpen(false);
  };

  const handleUpdateField = (index: number, config: FieldConfig) => {
    const newSchema = [...schema];
    newSchema[index] = config;
    onChange(newSchema);
  };

  const handleRemoveField = (index: number) => {
    onChange(schema.filter((_, i) => i !== index));
  };

  const addButtonContent = (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button className="w-full relative z-[101]">
          <Icon name="plus" />
          Ajouter un champ
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0 z-[101]"
        side="top"
        align="center"
        sideOffset={8}
      >
        <div className="flex flex-col">
          {fieldTypeOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => handleAddField(option.type)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-muted transition-colors border-b border-border last:border-b-0"
            >
              <Icon name={option.icon} size={18} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <>
      {/* Overlay sombre via Portal */}
      {mounted &&
        popoverOpen &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/40 z-[100] transition-opacity"
            onClick={() => setPopoverOpen(false)}
            aria-hidden="true"
          />,
          document.body
        )}

      <div className="flex flex-col gap-6">
        {schema.length === 0 ? (
          <div className="text-center py-8 text-content-muted border border-dashed border-border-default rounded-lg">
            Aucun champ. Utilisez le bouton ci-dessous pour ajouter des champs.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {schema.map((fieldConfig, index) => (
              <FieldConfigurator
                key={`${fieldConfig.name}-${index}`}
                config={fieldConfig}
                onChange={(config) => handleUpdateField(index, config)}
                onRemove={() => handleRemoveField(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bouton flottant ou normal */}
      {floatingButton ? (
        <div className="absolute bottom-[10px] left-0 right-0 px-6 bg-background">
          {addButtonContent}
        </div>
      ) : (
        <div className="mt-6">{addButtonContent}</div>
      )}
    </>
  );
};

export default FormBuilder;
