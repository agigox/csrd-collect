"use client";

import { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import { cn } from "@/lib/utils";
import { IconButton, TextInput } from "@rte-ds/react";
import type { FieldType } from "../../types";
import { typeLabels } from "../types";

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
  showLabel?: boolean;
  displayClassName?: string;
  inputClassName?: string;
  fieldType?: FieldType;
  onFieldTypeChange?: (type: FieldType) => void;
  collapsedActions?: CollapsedActions;
  onOpen?: () => void;
}

// Field types available in the type selector (excludes deprecated "unit")
const selectableTypes: FieldType[] = [
  "text",
  "number",
  "select",
  "radio",
  "checkbox",
  "switch",
  "date",
  "import",
];

export const LabelField = ({
  value,
  onChange,
  isDuplicate = false,
  className,
  placeholder = "",
  label = "Entête",
  showLabel = true,
  displayClassName,
  inputClassName,
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
    if (e.key === "Enter") {
      handleValidate();
    } else if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const typeSelector =
    fieldType &&
    (onFieldTypeChange ? (
      <Select
        value={fieldType}
        onValueChange={(val) => onFieldTypeChange(val as FieldType)}
      >
        <SelectTrigger className="h-8 w-56 shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {selectableTypes.map((t) => (
            <SelectItem key={t} value={t}>
              {typeLabels[t]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <span className="h-8 w-56 shrink-0 flex items-center px-3 text-sm text-muted-foreground border border-input rounded-(--radius) bg-muted/50">
        {typeLabels[fieldType]}
      </span>
    ));

  if (isEditing) {
    return (
      <div className={cn("flex items-end gap-2", className)}>
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
          />
        </div>
        {typeSelector}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-1 items-end gap-2 w-full", className)}>
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
