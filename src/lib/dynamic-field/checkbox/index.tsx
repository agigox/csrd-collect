"use client";

import { Checkbox } from "@rte-ds/react";
import type {
  FieldProps,
  FieldRegistration,
  CheckboxFieldConfig,
} from "@/models/FieldTypes";

const CheckboxField = ({
  config,
  value,
  onChange,
  error,
  readOnly = false,
}: FieldProps<CheckboxFieldConfig>) => {
  const options = config.options ?? [];
  const getDefaultValues = (): string[] => {
    if (config.defaultIndices && config.defaultIndices.length > 0) {
      return config.defaultIndices
        .filter((idx) => options[idx])
        .map((idx) => options[idx].value);
    }
    return [];
  };

  const currentValues: string[] = Array.isArray(value)
    ? value
    : getDefaultValues();

  const handleToggle = (optionValue: string) => {
    if (currentValues.includes(optionValue)) {
      onChange(currentValues.filter((v) => v !== optionValue));
    } else {
      onChange([...currentValues, optionValue]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">
        {config.label}
        {config.required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            id={`${config.name}-${option.value}`}
            label={option.label}
            showLabel
            checked={currentValues.includes(option.value)}
            onChange={() => handleToggle(option.value)}
            readOnly={readOnly}
            error={!!error}
          />
        ))}
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "checkbox",
  component: CheckboxField,
  defaultConfig: {},
};

export default CheckboxField;
