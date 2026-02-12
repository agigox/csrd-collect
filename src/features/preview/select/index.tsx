"use client";

import type {
  FieldProps,
  FieldRegistration,
  SelectFieldConfig,
} from "@/models/FieldTypes";
import { Select } from "@rte-ds/react";

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

  // For multiple selection - use default if no value
  const multipleValues: string[] = Array.isArray(value)
    ? value
    : value === undefined
      ? getDefaultMultipleValues()
      : [];

  const handleSingleChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleMultipleChange = (newValues: string[]) => {
    onChange(newValues);
  };

  // Multiple selection mode
  if (isMultiple) {
    return (
      <div className="flex flex-col gap-2">
        <Select
          id={config.name}
          label={config.label}
          showLabel={true}
          multiple={true}
          multipleValue={multipleValues}
          onMultipleChange={handleMultipleChange}
          options={options}
          readonly={readOnly}
          showResetButton={!config.required}
          tooltipTextLabel={config.description}
          required={config.required}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }

  // Single selection mode
  return (
    <Select
      value={singleValue}
      id={config.name}
      label={config.label}
      showLabel={true}
      onChange={handleSingleChange}
      options={options}
      readonly={readOnly}
      showResetButton={true}
      tooltipTextLabel={config.description}
      required={config.required}
    />
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
