"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/lib/ui/button";
import { Card, CardContent } from "@/lib/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/ui/popover";
import Icon, { IconName } from "@/lib/Icons";
import { FieldConfigurator } from "./FieldConfigurator";
import type { FieldConfig, FieldType } from "./types";

interface FormBuilderProps {
  schema: FieldConfig[];
  onChange: (schema: FieldConfig[]) => void;
  floatingButton?: boolean;
  buttonOnly?: boolean;
  hideButton?: boolean;
}

interface FieldTypeOption {
  type: FieldType;
  label: string;
  icon: IconName;
  borderBottom?: boolean;
}

const fieldTypeOptions: FieldTypeOption[] = [
  { type: "date", label: "Heure et Date", icon: "calendar", borderBottom: true },
  { type: "text", label: "Champ libre", icon: "letter" },
  { type: "number", label: "Nombre", icon: "letter" },
  { type: "unit", label: "Quantité avec unité", icon: "letter", borderBottom: true },
  { type: "radio", label: "Choix unique", icon: "checkCircle" },
  { type: "checkbox", label: "Choix multiple", icon: "checkbox", borderBottom: true },
  { type: "select", label: "Liste déroulante", icon: "listAlt", borderBottom: true },
  { type: "import", label: "Import de fichier", icon: "upload" },
  { type: "switch", label: "Switch", icon: "switch" },
  
];

export const FormBuilder = ({
  schema,
  onChange,
  floatingButton = false,
  buttonOnly = false,
  hideButton = false,
}: FormBuilderProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
        label: "E2 - Pollution",
        options: [],
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
    } else if (type === "radio") {
      newField = {
        name: fieldName,
        type: "radio",
        label: "Nouveau champ",
        options: [
          { value: "option_1", label: "Choix 1" },
          { value: "option_2", label: "Choix 2" },
          { value: "option_3", label: "Choix 3" },
        ],
      };
    } else if (type === "checkbox") {
      newField = {
        name: fieldName,
        type: "checkbox",
        label: "Nouveau champ",
        options: [],
        defaultIndices: [],
      };
    } else if (type === "date") {
      newField = {
        name: fieldName,
        type: "date",
        label: "Date",
        includeTime: false,
        defaultDateValue: "none",
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

  const handleDuplicateField = (index: number) => {
    const fieldToDuplicate = schema[index];
    const duplicatedField = {
      ...fieldToDuplicate,
      name: generateFieldName(fieldToDuplicate.type),
    };
    const newSchema = [...schema];
    newSchema.splice(index + 1, 0, duplicatedField);
    onChange(newSchema);
  };

  const addButtonContent = (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button className="w-full relative z-101">
          <Icon name="plus" />
          Ajouter un champ
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0 z-101"
        side="top"
        align="center"
        sideOffset={8}
      >
        <div className="flex flex-col">
          {fieldTypeOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => handleAddField(option.type)}
              className={`flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-muted transition-colors ${
                option.borderBottom ? "border-b border-border" : ""
              }`}
            >
              <Icon name={option.icon} size={18} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );

  // Mode buttonOnly : afficher uniquement le bouton
  if (buttonOnly) {
    return (
      <>
        {mounted &&
          popoverOpen &&
          createPortal(
            <div
              className="fixed inset-0 bg-black/40 z-100 transition-opacity"
              onClick={() => setPopoverOpen(false)}
              aria-hidden="true"
            />,
            document.body
          )}
        {addButtonContent}
      </>
    );
  }

  return (
    <>
      {/* Overlay sombre via Portal */}
      {mounted &&
        popoverOpen &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/40 z-100 transition-opacity"
            onClick={() => setPopoverOpen(false)}
            aria-hidden="true"
          />,
          document.body
        )}

      <div className="flex flex-col gap-6">
        {schema.length === 0 ? (
          <div className="text-center py-8 text-content-muted border border-dashed border-border-default rounded-lg">
            Aucune donnée configurée. Utilisez le bouton ci-dessous pour ajouter
            une donnée à déclarer.
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {schema.map((fieldConfig, index) => (
              <Card key={`${fieldConfig.name}-${index}`}>
                <CardContent>
                  <FieldConfigurator
                    config={fieldConfig}
                    onChange={(config) => handleUpdateField(index, config)}
                    onRemove={() => handleRemoveField(index)}
                    onDuplicate={() => handleDuplicateField(index)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bouton flottant ou normal */}
      {!hideButton &&
        (floatingButton ? (
          <div className="absolute bottom-2.5 left-0 right-0 px-6 bg-background">
            {addButtonContent}
          </div>
        ) : (
          <div className="mt-6">{addButtonContent}</div>
        ))}
    </>
  );
};

export default FormBuilder;
