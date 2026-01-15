"use client";

import { Label } from "@/lib/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import type {
  FieldProps,
  FieldRegistration,
  SelectFieldConfig,
} from "../types";

const SelectField = ({
  config,
  value,
  onChange,
  error,
}: FieldProps<SelectFieldConfig>) => {
  const currentValue = (value as string) ?? "";
  const hasValue = currentValue !== "";

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={config.name}>
        {config.label}
        {config.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select value={currentValue} onValueChange={handleChange}>
        <SelectTrigger
          id={config.name}
          aria-invalid={!!error}
          className={error ? "border-red-500 w-full" : "w-full"}
          clearable={!config.required}
          hasValue={hasValue}
          onClear={handleClear}
        >
          <SelectValue placeholder={config.placeholder ?? "Sélectionner..."} />
        </SelectTrigger>
        <SelectContent>
          {(config.options ?? []).map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "select",
  component: SelectField,
  defaultConfig: {
    placeholder: "Sélectionner...",
  },
};

export default SelectField;
