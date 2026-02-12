"use client";

import type {
  FieldProps,
  FieldRegistration,
  RadioFieldConfig,
} from "@/models/FieldTypes";
import { RadioButtonGroup } from "@rte-ds/react";

const RadioField = ({
  config,
  value,
  onChange,
  error,
  readOnly = false,
}: FieldProps<RadioFieldConfig>) => {
  // Use default value from config if no value is set
  const options = config.options ?? [];

  const defaultValue =
    config.defaultIndex !== undefined && options[config.defaultIndex]
      ? options[config.defaultIndex].value
      : "";
  const currentValue = (value as string) ?? defaultValue;

  const handleChange = (selectedLabel: string) => {
    // Convert label back to internal value
    const option = options.find((o) => o.label === selectedLabel);
    if (option) {
      onChange(option.value);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <RadioButtonGroup
        direction="vertical"
        groupName="radio-group"
        items={options.map((option) => option.label)}
        value={options.find((o) => o.value === currentValue)?.label}
        groupTitle={config.label}
        required={config.required}
        showItemsLabel
        onChange={handleChange}
        showGroupTitle={true}
        readOnly={readOnly}
        tooltipTextLabel={config.description}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "radio",
  component: RadioField,
  defaultConfig: {},
};

export default RadioField;
