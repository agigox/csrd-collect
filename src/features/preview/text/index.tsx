"use client";

import type {
  FieldProps,
  FieldRegistration,
  TextFieldConfig,
} from "@/models/FieldTypes";
import { TextInput } from "@rte-ds/react";

const TextField = ({
  config,
  value,
  onChange,
  error,
  readOnly = false,
}: FieldProps<TextFieldConfig>) => {
  // Use default value from config if no value is set

  const defaultValue = (config.defaultValue as string) ?? "";
  const currentValue =
    value !== undefined && value !== "" ? (value as string) : defaultValue;

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
    />
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "text",
  component: TextField,
  defaultConfig: {},
};

export default TextField;
