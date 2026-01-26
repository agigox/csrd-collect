"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import { cn } from "@/lib/utils";

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
}

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

  if (isEditing) {
    return (
      <div className={cn("flex flex-col", className)}>
        {showLabel && <Label>{label}</Label>}
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value);
            onChange(e.target.value);
          }}
          onBlur={handleValidate}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn("h-8 text-sm", inputClassName)}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-1 items-end gap-2", className)}>
      <div
        className={cn(
          "heading-s flex items-center bg-background-brand-unselected-default flex-1 rounded-(--radius) pl-2 h-8 cursor-pointer hover:bg-background-brand-unselected-hover transition-colors",
          displayClassName,
        )}
        onClick={handleClick}
      >
        {value || placeholder}
        {isDuplicate && (
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            (copie)
          </span>
        )}
      </div>
    </div>
  );
};

export default LabelField;
