"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { IconButton, Select, TextInput } from "@rte-ds/react";
import type { FieldType } from "@/models/FieldTypes";
import { typeLabels, typeIcons } from "@/lib/constants/field";
import { BranchingTag } from "./BranchingTag";

export interface CollapsedActions {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

interface LabelFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  label?: string;
  displayClassName?: string;
  fieldType?: FieldType;
  onFieldTypeChange?: (type: FieldType) => void;
  collapsedActions?: CollapsedActions;
  onOpen?: () => void;
  isChildField?: boolean;
  branchingColor?: string;
  branchingNumber?: number;
  fieldIdentifier?: string;
}

// Field types available in the type selector
const selectableTypes: FieldType[] = [
  "date",
  "text",
  "number",
  "radio",
  "checkbox",
  "select",
  "import",
  "switch",
];

export const LabelField = ({
  value,
  onChange,
  className,
  placeholder = "",
  label = "Entête",
  displayClassName,
  fieldType,
  onFieldTypeChange,
  collapsedActions,
  onOpen,
  isChildField,
  branchingColor,
  branchingNumber,
  fieldIdentifier,
}: LabelFieldProps) => {
  // State for form title click-to-edit (only used when no fieldIdentifier)
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const formattedIdentifier = fieldIdentifier
    ? fieldIdentifier.includes(".")
      ? fieldIdentifier
      : `${fieldIdentifier}.`
    : "";

  const typeSelector = fieldType && (
    <Select
      id=""
      label=""
      value={fieldType}
      onChange={
        onFieldTypeChange
          ? (val) => onFieldTypeChange(val as FieldType)
          : undefined
      }
      options={selectableTypes.map((t) => ({
        label: typeLabels[t],
        value: t,
        icon: typeIcons[t],
      }))}
      showLabel={false}
      disabled={!onFieldTypeChange}
      width={168}
    />
  );

  // Field card expanded state: show TextInput directly (has fieldIdentifier)
  if (!collapsedActions && fieldIdentifier) {
    return (
      <div className={cn("flex items-end gap-2", className)}>
        <div className="flex flex-col flex-1">
          {isChildField && branchingColor && branchingNumber !== undefined && (
            <BranchingTag
              branchingColor={branchingColor}
              branchingNumber={branchingNumber}
              fieldIdentifier={fieldIdentifier}
            />
          )}
          <TextInput
            aria-required
            assistiveAppearance="description"
            autoComplete="off"
            id="text-input-default"
            label={label}
            labelPosition="top"
            maxLength={150}
            onRightIconClick={() => {}}
            placeholder={`${formattedIdentifier} ${placeholder}`}
            value={value}
            onChange={onChange}
            onKeyDown={(e: React.KeyboardEvent) => e.stopPropagation()}
            width={"100%"}
          />
        </div>
        {typeSelector}
      </div>
    );
  }

  // Form title: click-to-edit behavior
  if (!collapsedActions && !fieldIdentifier) {
    return (
      <div className={cn("flex items-center gap-2 w-full", className)}>
        <div className="flex flex-col flex-1">
          {isEditing ? (
            <TextInput
              ref={inputRef}
              aria-required
              assistiveAppearance="description"
              autoComplete="off"
              id="text-input-default"
              label={label}
              labelPosition="top"
              maxLength={150}
              onRightIconClick={() => {}}
              placeholder={placeholder}
              value={editValue}
              onChange={(val) => {
                setEditValue(val);
                onChange(val);
              }}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e: React.KeyboardEvent) => {
                e.stopPropagation();
                if (e.key === "Enter" || e.key === "Escape") setIsEditing(false);
              }}
              width={"100%"}
            />
          ) : (
            <div
              className={cn(
                "heading-s flex items-center rounded-lg pl-2 h-8 cursor-pointer transition-colors",
                "bg-background-hover",
                displayClassName,
              )}
              onClick={() => setIsEditing(true)}
            >
              <span className="text-content-primary">{value || placeholder}</span>
            </div>
          )}
        </div>
        {typeSelector}
      </div>
    );
  }

  // Collapsed state: read-only display with actions
  if (!collapsedActions) return null;
  return (
    <div className={cn("flex items-center gap-2 w-full", className)}>
      <div className="flex flex-col flex-1">
        {isChildField && branchingColor && branchingNumber !== undefined && (
          <BranchingTag
            branchingColor={branchingColor}
            branchingNumber={branchingNumber}
            fieldIdentifier={fieldIdentifier}
          />
        )}
        <div
          className={cn(
            "heading-s flex items-center gap-1 rounded-lg pl-2 h-8 cursor-pointer transition-colors",
            displayClassName,
          )}
          onClick={onOpen}
        >
          {fieldIdentifier && (
            <span className="shrink-0 text-[#9c9c9c] pr-2">
              {formattedIdentifier}
            </span>
          )}
          <span className="text-content-primary">{value || placeholder}</span>
        </div>
      </div>
      {typeSelector}
      <div className="flex items-center gap-1 shrink-0">
        {collapsedActions.onMoveUp && collapsedActions.onMoveDown && (
          <>
            <IconButton
              appearance="outlined"
              aria-label="Monter"
              name="arrow-up"
              onClick={collapsedActions.onMoveUp}
              size="m"
              variant="transparent"
              disabled={!collapsedActions.canMoveUp}
            />
            <IconButton
              appearance="outlined"
              aria-label="Descendre"
              name="arrow-down"
              onClick={collapsedActions.onMoveDown}
              size="m"
              variant="transparent"
              disabled={!collapsedActions.canMoveDown}
            />
          </>
        )}
        <IconButton
          appearance="outlined"
          aria-label="Dupliquer"
          name="copy"
          onClick={collapsedActions.onDuplicate}
          size="m"
          variant="transparent"
        />
      </div>
    </div>
  );
};

export default LabelField;
