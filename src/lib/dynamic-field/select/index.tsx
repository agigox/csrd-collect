"use client";

import { Label } from "@/lib/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import { MultiSelect } from "@/lib/ui/multi-select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/lib/ui/tooltip";
import type {
  FieldProps,
  FieldRegistration,
  SelectFieldConfig,
} from "@/models/FieldTypes";

const SelectField = ({
  config,
  value,
  onChange,
  error,
  readOnly = false,
}: FieldProps<SelectFieldConfig>) => {
  const isMultiple = config.selectionMode === "multiple";
  const options = config.options ?? [];

  // Get default value for single selection
  const getDefaultSingleValue = (): string => {
    if (config.defaultIndex !== undefined && options[config.defaultIndex]) {
      return options[config.defaultIndex].value;
    }
    return "";
  };

  // Get default values for multiple selection
  const getDefaultMultipleValues = (): string[] => {
    if (config.defaultIndices && config.defaultIndices.length > 0) {
      return config.defaultIndices
        .filter((i) => options[i])
        .map((i) => options[i].value);
    }
    return [];
  };

  // For single selection - use default if no value
  const singleValue = (value as string) ?? getDefaultSingleValue();
  const hasSingleValue = singleValue !== "";

  // For multiple selection - use default if no value
  const multipleValues: string[] = Array.isArray(value)
    ? value
    : (value === undefined ? getDefaultMultipleValues() : []);

  const handleSingleChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleSingleClear = () => {
    onChange("");
  };

  const handleMultipleChange = (newValues: string[]) => {
    onChange(newValues);
  };

  const labelContent = (
    <Label htmlFor={config.name}>
      {config.label}
      {config.required && <span className="text-red-500 ml-1">*</span>}
    </Label>
  );

  const labelElement = config.description ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="w-fit cursor-help">{labelContent}</span>
      </TooltipTrigger>
      <TooltipContent>{config.description}</TooltipContent>
    </Tooltip>
  ) : (
    labelContent
  );

  // Multiple selection mode
  if (isMultiple) {
    return (
      <div className="flex flex-col gap-2">
        {labelElement}
        <MultiSelect
          options={options}
          value={multipleValues}
          onChange={handleMultipleChange}
          placeholder={config.placeholder ?? "Sélectionner..."}
          clearable={!config.required}
          error={!!error}
          disabled={readOnly}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }

  // Single selection mode
  return (
    <div className="flex flex-col gap-2">
      {labelElement}
      <Select value={singleValue} onValueChange={handleSingleChange} disabled={readOnly}>
        <SelectTrigger
          id={config.name}
          aria-invalid={!!error}
          className={error ? "border-red-500 w-full" : "w-full"}
          clearable={!config.required}
          hasValue={hasSingleValue}
          onClear={handleSingleClear}
        >
          <SelectValue placeholder={config.placeholder ?? "Sélectionner..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
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
