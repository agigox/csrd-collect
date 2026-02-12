"use client";

import { Switch, Tooltip } from "@rte-ds/react";
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

  const switchContent = (
    <Switch
      key={`${config.name}-${isChecked}`}
      id={config.name}
      label={config.label}
      showLabel
      checked={isChecked}
      onChange={() => !readOnly && onChange(!isChecked)}
      readOnly={readOnly}
      required={config.required}
    />
  );

  return config.description ? (
    <Tooltip
      alignment="start"
      arrow
      label={config.description}
      position="bottom"
    >
      {switchContent}
    </Tooltip>
  ) : (
    switchContent
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "switch",
  component: SwitchField,
  defaultConfig: {},
};

export default SwitchField;
