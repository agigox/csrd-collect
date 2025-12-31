"use client";

import { useState, useMemo } from "react";
import { Label } from "@/lib/components/ui/label";
import type { FieldProps, FieldRegistration, UnitFieldConfig } from "../types";
import Icon from "@/lib/Icons";

const UnitField = ({
  config,
  value,
  onChange,
  error,
}: FieldProps<UnitFieldConfig>) => {
  const [localInput, setLocalInput] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Compute display value from external value when not focused
  const formattedValue = useMemo(() => {
    if (value === undefined || value === null || value === "") {
      return "";
    }
    const num = Number(value);
    if (!isNaN(num)) {
      return num.toLocaleString("fr-FR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }
    return "";
  }, [value]);

  // Use local input when focused, otherwise use formatted value
  const inputValue =
    isFocused && localInput !== null ? localInput : formattedValue;

  const validateValue = (numValue: number | undefined): string | null => {
    if (numValue === undefined) return null;

    if (config.min !== undefined && numValue < config.min) {
      return `La valeur doit être supérieure ou égale à ${config.min}`;
    }
    if (config.max !== undefined && numValue > config.max) {
      return `La valeur doit être inférieure ou égale à ${config.max}`;
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow digits, comma, and dot
    if (/^[0-9]*[,.]?[0-9]*$/.test(raw) || raw === "") {
      setLocalInput(raw);
      // Convert to number for parent
      const normalized = raw.replace(",", ".");
      const numValue = normalized === "" ? undefined : Number(normalized);
      if (normalized === "" || !isNaN(numValue as number)) {
        onChange(numValue);
        // Validate on change
        setValidationError(validateValue(numValue));
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Show raw number on focus for easier editing
    if (value !== undefined && value !== null && value !== "") {
      const num = Number(value);
      if (!isNaN(num)) {
        setLocalInput(String(num).replace(".", ","));
      } else {
        setLocalInput("");
      }
    } else {
      setLocalInput("");
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setLocalInput(null);
    // Validate on blur
    const num =
      value !== undefined && value !== null ? Number(value) : undefined;
    setValidationError(validateValue(num));
  };

  const displayError = error || validationError;

  return (
    <div className="flex flex-col gap-0.5">
      {/* Label row */}
      <div className="flex items-end gap-1 px-2 py-0.5">
        <Label htmlFor={config.name}>{config.label}</Label>
        {config.required ? (
          <span className="text-content-danger-default font-bold text-[22px] leading-[18px]">
            *
          </span>
        ) : (
          <span className="text-xs text-content-tertiary relative -top-1">
            (facultatif)
          </span>
        )}
      </div>

      {/* Input with unit */}
      <div
        className={`flex items-center h-8 w-full border rounded px-2 bg-white ${
          displayError ? "border-red-500" : "border-border-secondary"
        }`}
        style={{ boxShadow: "inset 0 1px 2px 0 rgba(0, 0, 0, 0.14)" }}
      >
        <input
          id={config.name}
          name={config.name}
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          size={inputValue.length || 1}
          className="h-full text-sm text-content-primary bg-transparent outline-none text-left"
          style={{ width: `${Math.max((inputValue.length || 1) + 1, 2)}ch` }}
          aria-invalid={!!displayError}
        />
        <span className="text-sm text-content-primary">{config.unit}</span>
      </div>

      {/* Helper text / Error */}
      {(config.description || displayError) && (
        <div className="flex items-center gap-1 px-2 py-1">
          <Icon name="error" />
          <span
            className={`text-xs ${
              displayError
                ? "text-content-danger-default font-bold"
                : "text-content-tertiary"
            }`}
          >
            {displayError || config.description}
          </span>
        </div>
      )}
    </div>
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "unit",
  component: UnitField,
  defaultConfig: {},
};

export default UnitField;
