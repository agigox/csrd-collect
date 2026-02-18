"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Reorder } from "motion/react";

import { Popover, PopoverContent, PopoverTrigger } from "@/lib/ui/popover";
import { useFormsStore } from "@/stores/formsStore";

import type {
  FieldConfig,
  FieldType,
  RadioFieldConfig,
  CheckboxFieldConfig,
} from "@/models/FieldTypes";
import { typeLabels, typeIcons } from "@/lib/constants/field";
import { Button, Icon } from "@rte-ds/react";
import { SortableFieldCard } from "@/features/field-configurator/SortableFieldCard";
import {
  createDefaultFieldConfig,
  getAllDescendantIds,
  getChildFieldIds,
  generateBranchingColor,
  regroupChildrenAfterReorder,
  getFieldDepth,
  getFieldIdentifier,
  detachChildFromSchema,
  detachParentFromSchema,
} from "@/lib/utils/branching";

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
  const { activeFieldNames, primaryActiveFieldName, setActiveFieldName } =
    useFormsStore();

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
    const newField = createDefaultFieldConfig(type, generateFieldName);

    if (insertAtIndex !== undefined) {
      const newSchema = [...schema];
      newSchema.splice(insertAtIndex, 0, newField);
      onChange(newSchema);
    } else {
      onChange([...schema, newField]);
    }
    setActiveFieldName(newField.name, schema);
    setPopoverOpen(false);
    setInsertPopoverOpen(null);
  };

  const handleUpdateField = (index: number, config: FieldConfig) => {
    const oldConfig = schema[index];
    let newSchema = [...schema];
    newSchema[index] = config;

    // Sync branching children when branching map changes on radio/checkbox
    if (
      (config.type === "radio" || config.type === "checkbox") &&
      (oldConfig.type === "radio" || oldConfig.type === "checkbox")
    ) {
      const oldBranching =
        (oldConfig as RadioFieldConfig | CheckboxFieldConfig).branching ?? {};
      const newBranching =
        (config as RadioFieldConfig | CheckboxFieldConfig).branching ?? {};
      const oldBranchingColors =
        (oldConfig as RadioFieldConfig | CheckboxFieldConfig).branchingColors ??
        {};
      const newBranchingColors = { ...oldBranchingColors };

      // Collect all old and new field type lists per option
      for (const optionValue of new Set([
        ...Object.keys(oldBranching),
        ...Object.keys(newBranching),
      ])) {
        const oldTypes = oldBranching[optionValue] ?? [];
        const newTypes = newBranching[optionValue] ?? [];

        // Find types that were added
        const addedTypes = newTypes.filter((t) => !oldTypes.includes(t));
        // Find types that were removed (by index to handle duplicates)
        const removedTypes = oldTypes.filter((t) => !newTypes.includes(t));

        // Generate color for this option if not yet assigned
        if (newTypes.length > 0 && !newBranchingColors[optionValue]) {
          newBranchingColors[optionValue] = generateBranchingColor(
            Object.values(newBranchingColors),
          );
        }
        if (newTypes.length === 0) {
          delete newBranchingColors[optionValue];
        }

        const color = newBranchingColors[optionValue];

        // Remove children for removed entries (can be field IDs or type names)
        for (const removedEntry of removedTypes) {
          const childToRemove = newSchema.find(
            (f) =>
              f.parentFieldId === config.id &&
              f.parentOptionValue === optionValue &&
              (f.id === removedEntry || f.type === removedEntry),
          );
          if (childToRemove) {
            const descendantIds = getAllDescendantIds(
              childToRemove.id,
              newSchema,
            );
            const idsToRemove = new Set([childToRemove.id, ...descendantIds]);
            newSchema = newSchema.filter((f) => !idsToRemove.has(f.id));
          }
        }

        // Add children for added types
        for (const addedType of addedTypes) {
          const childField = createDefaultFieldConfig(
            addedType as FieldType,
            generateFieldName,
          );
          childField.parentFieldId = config.id;
          childField.parentOptionValue = optionValue;
          childField.branchingColor = color;

          // Insert right after the parent (or after last sibling)
          const parentIdx = newSchema.findIndex((f) => f.id === config.id);
          const siblings = newSchema.filter(
            (f) =>
              f.parentFieldId === config.id &&
              f.parentOptionValue === optionValue,
          );
          const lastSiblingIdx =
            siblings.length > 0
              ? Math.max(...siblings.map((s) => newSchema.indexOf(s)))
              : parentIdx;
          newSchema.splice(lastSiblingIdx + 1, 0, childField);

          // Update the branching map to use field IDs instead of types
          const branchingConfig = newSchema[
            newSchema.findIndex((f) => f.id === config.id)
          ] as RadioFieldConfig | CheckboxFieldConfig;
          const currentBranching = { ...(branchingConfig.branching ?? {}) };
          const currentOptionFields = currentBranching[optionValue] ?? [];
          // Replace the type entry with the actual field ID
          const typeIdx = currentOptionFields.indexOf(addedType);
          if (typeIdx >= 0) {
            currentOptionFields[typeIdx] = childField.id;
          } else {
            currentOptionFields.push(childField.id);
          }
          currentBranching[optionValue] = currentOptionFields;
          (
            newSchema[newSchema.findIndex((f) => f.id === config.id)] as
              | RadioFieldConfig
              | CheckboxFieldConfig
          ).branching = currentBranching;
        }
      }

      // Update branchingColors on the parent
      const parentIdx = newSchema.findIndex((f) => f.id === config.id);
      if (parentIdx >= 0) {
        (
          newSchema[parentIdx] as RadioFieldConfig | CheckboxFieldConfig
        ).branchingColors = newBranchingColors;
      }
    }

    onChange(newSchema);

    // Recalculate active fields so new children are auto-opened with their parent
    if (primaryActiveFieldName) {
      setActiveFieldName(primaryActiveFieldName, newSchema);
    }
  };

  const handleRemoveField = (index: number) => {
    const field = schema[index];
    let newSchema = [...schema];

    // If field has children, remove them all
    const descendantIds = getAllDescendantIds(field.id, schema);
    if (descendantIds.length > 0) {
      const idsToRemove = new Set([field.id, ...descendantIds]);
      newSchema = newSchema.filter((f) => !idsToRemove.has(f.id));
    } else {
      newSchema = newSchema.filter((_, i) => i !== index);
    }

    // If field is a child, clean up parent's branching
    if (field.parentFieldId) {
      const parentIdx = newSchema.findIndex(
        (f) => f.id === field.parentFieldId,
      );
      if (parentIdx >= 0) {
        const parent = newSchema[parentIdx] as
          | RadioFieldConfig
          | CheckboxFieldConfig;
        if (parent.branching && field.parentOptionValue) {
          const newBranching = { ...parent.branching };
          const optionFields = newBranching[field.parentOptionValue] ?? [];
          newBranching[field.parentOptionValue] = optionFields.filter(
            (id) => id !== field.id,
          );
          if (newBranching[field.parentOptionValue].length === 0) {
            delete newBranching[field.parentOptionValue];
            const newBranchingColors = { ...(parent.branchingColors ?? {}) };
            delete newBranchingColors[field.parentOptionValue];
            newSchema[parentIdx] = {
              ...parent,
              branching: newBranching,
              branchingColors: newBranchingColors,
            };
          } else {
            newSchema[parentIdx] = { ...parent, branching: newBranching };
          }
        }
      }
    }

    onChange(newSchema);
  };

  const handleDuplicateField = (index: number) => {
    const fieldToDuplicate = schema[index];
    const childIds = getChildFieldIds(fieldToDuplicate.id, schema);

    // Simple duplicate (no children)
    if (childIds.length === 0) {
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
      setActiveFieldName(duplicatedField.name, newSchema);
      return;
    }

    // Duplicate parent + all descendants with remapped IDs
    const allDescendantIds = getAllDescendantIds(fieldToDuplicate.id, schema);
    const fieldsToClone = [
      fieldToDuplicate,
      ...schema.filter((f) => allDescendantIds.includes(f.id)),
    ];

    const idMap = new Map<string, string>();
    const clonedFields: FieldConfig[] = [];
    const generatedNames = new Set<string>();

    for (const field of fieldsToClone) {
      // Generate unique name considering both existing schema and already-generated names
      let newName = generateFieldName(field.type);
      while (generatedNames.has(newName)) {
        // If name was just generated in this loop, try next one
        const match = newName.match(/^(.+)_(\d+)$/);
        if (match) {
          const [, type, num] = match;
          newName = `${type}_${parseInt(num) + 1}`;
        } else {
          newName = `${newName}_1`;
        }
      }
      generatedNames.add(newName);

      idMap.set(field.id, newName);
      clonedFields.push({
        ...field,
        id: newName,
        name: newName,
        isDuplicate: true,
      });
    }

    // Remap references
    for (const cloned of clonedFields) {
      if (cloned.parentFieldId && idMap.has(cloned.parentFieldId)) {
        cloned.parentFieldId = idMap.get(cloned.parentFieldId)!;
      }
      if (
        (cloned.type === "radio" || cloned.type === "checkbox") &&
        (cloned as RadioFieldConfig | CheckboxFieldConfig).branching
      ) {
        const branchingConfig = cloned as
          | RadioFieldConfig
          | CheckboxFieldConfig;
        const newBranching: Record<string, string[]> = {};
        for (const [optVal, fieldIds] of Object.entries(
          branchingConfig.branching!,
        )) {
          newBranching[optVal] = fieldIds.map((id) => idMap.get(id) ?? id);
        }
        branchingConfig.branching = newBranching;
      }
    }

    // Find insertion point (after the last descendant of the original)
    const lastOriginalIdx = Math.max(
      index,
      ...allDescendantIds.map((id) => schema.findIndex((f) => f.id === id)),
    );
    const newSchema = [...schema];
    newSchema.splice(lastOriginalIdx + 1, 0, ...clonedFields);
    onChange(newSchema);
    setActiveFieldName(clonedFields[0].name, newSchema);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const field = schema[index];

    // Don't move child fields independently
    if (field.parentFieldId) return;

    const descendantIds = getAllDescendantIds(field.id, schema);
    const groupSize = 1 + descendantIds.length;

    // Find the field above the group
    const fieldAbove = schema[index - 1];
    if (fieldAbove.parentFieldId) return; // Can't swap into another group

    const newSchema = [...schema];
    // Move the group up by 1
    const group = newSchema.splice(index, groupSize);
    newSchema.splice(index - 1, 0, ...group);
    onChange(newSchema);
  };

  const handleMoveDown = (index: number) => {
    const field = schema[index];

    // Don't move child fields independently
    if (field.parentFieldId) return;

    const descendantIds = getAllDescendantIds(field.id, schema);
    const groupSize = 1 + descendantIds.length;
    const groupEnd = index + groupSize;

    if (groupEnd >= schema.length) return;

    // Find the field below the group
    const fieldBelow = schema[groupEnd];
    if (fieldBelow.parentFieldId) return;

    const belowDescendants = getAllDescendantIds(fieldBelow.id, schema);
    const belowGroupSize = 1 + belowDescendants.length;

    const newSchema = [...schema];
    const group = newSchema.splice(index, groupSize);
    newSchema.splice(index + belowGroupSize, 0, ...group);
    onChange(newSchema);
  };

  const handleReorder = (reordered: FieldConfig[]) => {
    onChange(regroupChildrenAfterReorder(reordered));
  };

  const handleBranchingCleanup = (fieldId: string) => {
    const descendantIds = getAllDescendantIds(fieldId, schema);
    if (descendantIds.length === 0) return;
    const idsToRemove = new Set(descendantIds);
    const newSchema = schema.filter((f) => !idsToRemove.has(f.id));
    onChange(newSchema);
  };

  const handleDetachField = (fieldId: string) => {
    const field = schema.find((f) => f.id === fieldId);
    if (!field) return;

    const isChild = !!field.parentFieldId;
    let newSchema: FieldConfig[];

    if (isChild) {
      newSchema = detachChildFromSchema(fieldId, schema);
    } else {
      newSchema = detachParentFromSchema(fieldId, schema);
    }

    onChange(newSchema);
    setActiveFieldName(field.name, newSchema);
  };

  const renderInsertButton = (
    activeIndex: number,
    position: "before" | "after",
  ) => {
    const insertIndex = position === "before" ? activeIndex : activeIndex + 1;

    return (
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
  };

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

  // Compute branching number for child fields (= option index in parent)
  const getBranchingNumber = (field: FieldConfig): number => {
    if (!field.parentFieldId || !field.parentOptionValue) return 0;
    const parent = schema.find((f) => f.id === field.parentFieldId);
    if (!parent || (parent.type !== "radio" && parent.type !== "checkbox"))
      return 0;
    const parentConfig = parent as RadioFieldConfig | CheckboxFieldConfig;
    const options = parentConfig.options ?? [];
    const optionIndex = options.findIndex(
      (o) => o.value === field.parentOptionValue,
    );
    return optionIndex + 1;
  };

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
          onReorder={handleReorder}
          className="flex flex-col gap-4"
        >
          {(() => {
            // Compute group boundaries once before iterating
            const primaryField = primaryActiveFieldName
              ? schema.find((f) => f.name === primaryActiveFieldName)
              : null;
            const primaryParentId =
              primaryField?.parentFieldId ?? primaryField?.id;
            const primaryParentIndex = primaryParentId
              ? schema.findIndex((f) => f.id === primaryParentId)
              : -1;
            const descendants = primaryParentId
              ? getAllDescendantIds(primaryParentId, schema)
              : [];
            // Last field in group: parent + all descendants
            const groupLastIndex =
              primaryParentIndex >= 0
                ? primaryParentIndex + descendants.length
                : -1;

            return schema.map((fieldConfig, index) => {
              const isActive = activeFieldNames.includes(fieldConfig.name);
              const isChildField = !!fieldConfig.parentFieldId;
              const depth = getFieldDepth(fieldConfig.id, schema);
              const fieldIdentifier = getFieldIdentifier(fieldConfig.id, schema);

              // When no field is active, show insert buttons on first/last fields
              const noActiveField = !primaryField;
              // "before" button: on the parent card, or first field when none active
              const showInsertBefore = noActiveField
                ? index === 0
                : !isChildField && fieldConfig.id === primaryParentId;
              // "after" button: on the last field of the group, or last field when none active
              const showInsertAfter = noActiveField
                ? index === schema.length - 1
                : index === groupLastIndex;

              return (
                <SortableFieldCard
                  key={fieldConfig.id}
                  fieldConfig={fieldConfig}
                  index={index}
                  totalFields={schema.length}
                  isOpen={isActive}
                  onOpen={() => setActiveFieldName(fieldConfig.name, schema)}
                  onUpdate={(config) => handleUpdateField(index, config)}
                  onRemove={() => handleRemoveField(index)}
                  onDuplicate={() => handleDuplicateField(index)}
                  onMoveUp={() => handleMoveUp(index)}
                  onMoveDown={() => handleMoveDown(index)}
                  schema={schema}
                  onBranchingCleanup={() =>
                    handleBranchingCleanup(fieldConfig.id)
                  }
                  isChildField={isChildField}
                  branchingColor={fieldConfig.branchingColor}
                  branchingNumber={getBranchingNumber(fieldConfig)}
                  fieldIdentifier={fieldIdentifier}
                  depth={depth}
                  onDetach={() => handleDetachField(fieldConfig.id)}
                  insertBefore={showInsertBefore ? renderInsertButton(index, "before") : undefined}
                  insertAfter={showInsertAfter ? renderInsertButton(index, "after") : undefined}
                />
              );
            });
          })()}
        </Reorder.Group>
      </div>
    </>
  );
};

export default FormBuilder;
