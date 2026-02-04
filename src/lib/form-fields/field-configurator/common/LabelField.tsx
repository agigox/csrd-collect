"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { IconButton, Select, TextInput } from "@rte-ds/react";
import type { FieldType } from "@/models/FieldTypes";
import { typeLabels, typeIcons } from "@/models/FieldTypes";

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
  isDuplicate?: boolean;
  className?: string;
  placeholder?: string;
  label?: string;
  displayClassName?: string;
  fieldType?: FieldType;
  onFieldTypeChange?: (type: FieldType) => void;
  collapsedActions?: CollapsedActions;
  onOpen?: () => void;
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
  isDuplicate = false,
  className,
  placeholder = "",
  label = "Entête",
  displayClassName,
  fieldType,
  onFieldTypeChange,
  collapsedActions,
  onOpen,
}: LabelFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Sync editValue when value prop changes
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleValidate = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Stop propagation to prevent SideNav from capturing keyboard events
    e.stopPropagation();
    if (e.key === "Enter") {
      handleValidate();
    } else if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

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

  if (isEditing) {
    return (
      <div className={cn("flex items-end gap-2 h-14", className)}>
        <div className="flex flex-col flex-1">
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
            onChange={(value) => {
              setEditValue(value);
              onChange(value);
            }}
            onBlur={handleValidate}
            onKeyDown={handleKeyDown}
            width={"100%"}
          />
        </div>
        {typeSelector}
      </div>
    );
  }

  return (
    <div className={cn("flex h-8 items-end gap-2 w-full", className)}>
      <div
        className={cn(
          "heading-s flex items-center bg-background-hover flex-1 rounded-lg pl-2 h-8 cursor-pointer transition-colors",
          displayClassName,
        )}
        onClick={collapsedActions ? onOpen : handleClick}
      >
        {value || placeholder}
        {isDuplicate && (
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            (copie)
          </span>
        )}
      </div>
      {typeSelector}
      {collapsedActions && (
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
      )}
    </div>
  );
};

export default LabelField;
