"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Reorder } from "motion/react";

import { Popover, PopoverContent, PopoverTrigger } from "@/lib/ui/popover";
import { useFormsStore } from "@/stores/formsStore";

import type { FieldConfig, FieldType } from "./types";
import { typeLabels, typeIcons } from "./field-configurator/types";
import { Button, Icon } from "@rte-ds/react";
import { SortableFieldCard } from "./SortableFieldCard";

interface FormBuilderProps {
  schema: FieldConfig[];
  onChange: (schema: FieldConfig[]) => void;
  buttonOnly?: boolean;
}

interface FieldTypeOption {
  type: FieldType;
  borderBottom?: boolean;
}

const fieldTypeOptions: FieldTypeOption[] = [
  { type: "date", borderBottom: true },
  { type: "text" },
  { type: "number", borderBottom: true },
  { type: "radio" },
  { type: "checkbox", borderBottom: true },
  { type: "select", borderBottom: true },
  { type: "import" },
  { type: "switch" },
];

export const FormBuilder = ({
  schema,
  onChange,
  buttonOnly = false,
}: FormBuilderProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [insertPopoverOpen, setInsertPopoverOpen] = useState<
    "before" | "after" | null
  >(null);
  const [mounted, setMounted] = useState(false);
  const { activeFieldName, setActiveFieldName } = useFormsStore();

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

  const handleAddField = (type: FieldType, insertAtIndex?: number) => {
    const fieldName = generateFieldName(type);
    let newField: FieldConfig;

    if (type === "select") {
      newField = {
        id: fieldName,
        name: fieldName,
        type: "select",
        label: "E2 - Pollution",
        options: [],
        selectionMode: "single",
      };
    } else if (type === "number") {
      newField = {
        id: fieldName,
        name: fieldName,
        type: "number",
        label: "Nombre",
        placeholder: "",
      };
    } else if (type === "switch") {
      newField = {
        id: fieldName,
        name: fieldName,
        type: "switch",
        label: "Switch",
      };
    } else if (type === "radio") {
      newField = {
        id: fieldName,
        name: fieldName,
        type: "radio",
        label: "Choix unique",
        options: [
          { value: "option_1", label: "Choix 1" },
          { value: "option_2", label: "Choix 2" },
          { value: "option_3", label: "Choix 3" },
        ],
      };
    } else if (type === "checkbox") {
      newField = {
        id: fieldName,
        name: fieldName,
        type: "checkbox",
        label: "Choix multiple",
        options: [
          { value: "option_1", label: "Choix 1" },
          { value: "option_2", label: "Choix 2" },
          { value: "option_3", label: "Choix 3" },
        ],
      };
    } else if (type === "date") {
      newField = {
        id: fieldName,
        name: fieldName,
        type: "date",
        label: "Heure et Date",
        includeTime: false,
        defaultDateValue: "none",
      };
    } else if (type === "import") {
      newField = {
        id: fieldName,
        name: fieldName,
        type: "import",
        label: "Import de fichier",
        acceptedFormats: [],
      };
    } else {
      newField = {
        id: fieldName,
        name: fieldName,
        type: "text",
        label: "Autre",
        placeholder: "",
        defaultValue: "Lorem",
      };
    }

    if (insertAtIndex !== undefined) {
      const newSchema = [...schema];
      newSchema.splice(insertAtIndex, 0, newField);
      onChange(newSchema);
    } else {
      onChange([...schema, newField]);
    }
    setActiveFieldName(newField.name);
    setPopoverOpen(false);
    setInsertPopoverOpen(null);
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
    const newName = generateFieldName(fieldToDuplicate.type);
    const duplicatedField = {
      ...fieldToDuplicate,
      id: newName,
      name: newName,
      isDuplicate: true,
    };
    const newSchema = [...schema];
    newSchema.splice(index + 1, 0, duplicatedField);
    onChange(newSchema);
    setActiveFieldName(duplicatedField.name);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newSchema = [...schema];
    [newSchema[index - 1], newSchema[index]] = [
      newSchema[index],
      newSchema[index - 1],
    ];
    onChange(newSchema);
  };

  const handleMoveDown = (index: number) => {
    if (index >= schema.length - 1) return;
    const newSchema = [...schema];
    [newSchema[index], newSchema[index + 1]] = [
      newSchema[index + 1],
      newSchema[index],
    ];
    onChange(newSchema);
  };

  const renderInsertButton = (
    insertIndex: number,
    position: "before" | "after",
  ) => (
    <Popover
      open={insertPopoverOpen === position}
      onOpenChange={(open) => setInsertPopoverOpen(open ? position : null)}
    >
      <PopoverTrigger asChild>
        <Button
          label="Champ"
          size="s"
          variant="secondary"
          icon="add"
          className="w-fit self-center"
        />
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
              onClick={() => handleAddField(option.type, insertIndex)}
              className={`flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-muted transition-colors ${
                option.borderBottom ? "border-b border-border" : ""
              }`}
            >
              <Icon name={typeIcons[option.type]} size={18} />
              <span>{typeLabels[option.type]}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );

  const addButtonContent = (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          label="Ajouter un champ"
          variant="secondary"
          iconPosition="left"
          icon="add"
        />
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
              <Icon name={typeIcons[option.type]} size={18} />
              <span>{typeLabels[option.type]}</span>
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
            document.body,
          )}
        {addButtonContent}
      </>
    );
  }

  return (
    <>
      {/* Overlay sombre via Portal */}
      {mounted &&
        (popoverOpen || insertPopoverOpen) &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/40 z-100 transition-opacity"
            onClick={() => {
              setPopoverOpen(false);
              setInsertPopoverOpen(null);
            }}
            aria-hidden="true"
          />,
          document.body,
        )}

      <div className="flex flex-col gap-6">
        <Reorder.Group
          axis="y"
          values={schema}
          onReorder={onChange}
          className="flex flex-col gap-4"
        >
          {schema.map((fieldConfig, index) => {
            const isActive = activeFieldName === fieldConfig.name;
            return (
              <div key={fieldConfig.name} className="flex flex-col gap-4">
                {isActive && renderInsertButton(index, "before")}
                <SortableFieldCard
                  fieldConfig={fieldConfig}
                  index={index}
                  totalFields={schema.length}
                  isOpen={isActive}
                  onOpen={() => setActiveFieldName(fieldConfig.name)}
                  onUpdate={(config) => handleUpdateField(index, config)}
                  onRemove={() => handleRemoveField(index)}
                  onDuplicate={() => handleDuplicateField(index)}
                  onMoveUp={() => handleMoveUp(index)}
                  onMoveDown={() => handleMoveDown(index)}
                />
                {isActive && renderInsertButton(index + 1, "after")}
              </div>
            );
          })}
        </Reorder.Group>
      </div>
    </>
  );
};

export default FormBuilder;
