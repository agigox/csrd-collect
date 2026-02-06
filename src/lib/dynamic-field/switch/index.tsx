"use client";

import { Switch } from "@rte-ds/react";
import type {
  FieldProps,
  FieldRegistration,
  SwitchFieldConfig,
} from "@/models/FieldTypes";

const SwitchField = ({
  config,
  value,
  onChange,
  readOnly = false,
}: FieldProps<SwitchFieldConfig>) => {
  // Use defaultValue from config if value is undefined
  const isChecked =
    value !== undefined ? Boolean(value) : Boolean(config.defaultValue);

  return (
    <Switch
      key={`${config.name}-${isChecked}`}
      id={config.name}
      label={config.label}
      showLabel
      checked={isChecked}
      onChange={() => !readOnly && onChange(!isChecked)}
      readOnly={readOnly}
    />
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "switch",
  component: SwitchField,
  defaultConfig: {},
};

export default SwitchField;
