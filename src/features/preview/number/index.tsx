"use client";

import type {
  FieldProps,
  FieldRegistration,
  NumberFieldConfig,
} from "@/models/FieldTypes";
import { TextInput, Tooltip } from "@rte-ds/react";

const NumberField = ({
  config,
  value,
  onChange,
  error,
  readOnly = false,
}: FieldProps<NumberFieldConfig>) => {
  const handleChange = (value: string) => {
    const numValue = value === "" ? undefined : Number(value);
    onChange(numValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <TextInput
        id={config.name}
        name={config.name}
        label={config.label}
        labelPosition="top"
        onChange={handleChange}
        value={value !== undefined ? String(value) : ""}
        required={config.required}
        readOnly={readOnly}
        {...(config.unit && { unit: config.unit })}
        width={"100%"}
        tooltipTextLabel={config.description}
      />
    </div>
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "number",
  component: NumberField,
  defaultConfig: {},
};

export default NumberField;
