"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  {
    type: "date",
    label: "Heure et Date",
    icon: "calendar",
    borderBottom: true,
  },
  { type: "text", label: "Champ libre", icon: "letter" },
  { type: "number", label: "Nombre", icon: "letter", borderBottom: true },
  { type: "radio", label: "Choix unique", icon: "checkCircle" },
  {
    type: "checkbox",
    label: "Choix multiple",
    icon: "checkbox",
    borderBottom: true,
  },
  {
    type: "select",
    label: "Liste déroulante",
    icon: "listAlt",
    borderBottom: true,
  },
  { type: "import", label: "Import de fichier", icon: "upload" },
  { type: "switch", label: "Switch", icon: "switch" },
];

// Sortable Field Card component
interface SortableFieldCardProps {
  id: string;
  fieldConfig: FieldConfig;
  index: number;
  totalFields: number;
  onUpdate: (config: FieldConfig) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const SortableFieldCard = ({
  id,
  fieldConfig,
  index,
  totalFields,
  onUpdate,
  onRemove,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: SortableFieldCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <Card ref={setNodeRef} style={style}>
      <CardContent>
        <FieldConfigurator
          config={fieldConfig}
          onChange={onUpdate}
          onRemove={onRemove}
          onDuplicate={onDuplicate}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          canMoveUp={index > 0}
          canMoveDown={index < totalFields - 1}
          dragHandleAttributes={attributes}
          dragHandleListeners={listeners}
        />
      </CardContent>
    </Card>
  );
};

export const FormBuilder = ({
  schema,
  onChange,
  floatingButton = false,
  buttonOnly = false,
  hideButton = false,
}: FormBuilderProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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
        selectionMode: "single",
      };
    } else if (type === "number") {
      newField = {
        name: fieldName,
        type: "number",
        label: "Nombre",
        placeholder: "",
      };
    } else if (type === "switch") {
      newField = {
        name: fieldName,
        type: "switch",
        label: "Switch",
      };
    } else if (type === "radio") {
      newField = {
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
        name: fieldName,
        type: "date",
        label: "Heure et Date",
        includeTime: false,
        defaultDateValue: "none",
      };
    } else if (type === "import") {
      newField = {
        name: fieldName,
        type: "import",
        label: "Import de fichier",
        acceptedFormats: [],
      };
    } else {
      newField = {
        name: fieldName,
        type: "text",
        label: "Autre",
        placeholder: "",
        defaultValue: "Lorem",
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
      isDuplicate: true,
    };
    const newSchema = [...schema];
    newSchema.splice(index + 1, 0, duplicatedField);
    onChange(newSchema);
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

  // Handle drag end for reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = schema.findIndex((f) => f.name === active.id);
      const newIndex = schema.findIndex((f) => f.name === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onChange(arrayMove(schema, oldIndex, newIndex));
      }
    }
  };

  // Get sortable item IDs
  const sortableIds = schema.map((f) => f.name);

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
        popoverOpen &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/40 z-100 transition-opacity"
            onClick={() => setPopoverOpen(false)}
            aria-hidden="true"
          />,
          document.body,
        )}

      <div className="flex flex-col gap-6">
        {schema.length === 0 ? (
          <div className="text-center py-8 text-content-muted border border-dashed border-border-default rounded-lg">
            Aucune donnée configurée. Utilisez le bouton ci-dessous pour ajouter
            une donnée à déclarer.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortableIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-8">
                {schema.map((fieldConfig, index) => (
                  <SortableFieldCard
                    key={fieldConfig.name}
                    id={fieldConfig.name}
                    fieldConfig={fieldConfig}
                    index={index}
                    totalFields={schema.length}
                    onUpdate={(config) => handleUpdateField(index, config)}
                    onRemove={() => handleRemoveField(index)}
                    onDuplicate={() => handleDuplicateField(index)}
                    onMoveUp={() => handleMoveUp(index)}
                    onMoveDown={() => handleMoveDown(index)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
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
