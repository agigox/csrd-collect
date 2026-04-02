"use client";

import type { TextFieldConfig } from "@/models/FieldTypes";
import type { FieldProps, FieldRegistration } from "@/lib/types/field";
import { TextInput } from "@rte-ds/react";

const TextField = ({
  config,
  value,
  onChange,
  error,
  readOnly = false,
}: FieldProps<TextFieldConfig>) => {
  // Value comes from parent (seeded with defaultValue in Declarations.tsx on first load)
  // No local fallback to config.defaultValue — validation handles empty state
  const currentValue = (value as string) ?? "";

  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <TextInput
      id={config.name}
      name={config.name}
      label={config.label}
      labelPosition="top"
      onChange={handleChange}
      value={currentValue}
      required={config.required}
      readOnly={readOnly}
      width={"100%"}
      tooltipTextLabel={config.description}
      error={error !== undefined}
      assistiveTextLabel={error}
      assistiveAppearance={error !== undefined ? "error" : undefined}
      showAssistiveIcon={error !== undefined}
      showRightIcon={false}
    />
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "text",
  component: TextField,
  defaultConfig: {},
};

export default TextField;
