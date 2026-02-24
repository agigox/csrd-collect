"use client";

import { Select } from "@rte-ds/react";
import type { SwitchFieldConfig } from "@/models/FieldTypes";
import type { SpecificConfiguratorProps } from "@/lib/types/field";
import { LabelField } from "../common/LabelField";

const defaultValueOptions = [
  { value: "false", label: "Non sélectionné" },
  { value: "true", label: "Sélectionné" },
];

export const SwitchConfigurator = ({
  config,
  onChange,
  onFieldTypeChange,
  fieldIdentifier,
}: SpecificConfiguratorProps<SwitchFieldConfig>) => {
  const handleDefaultValueChange = (value: string) => {
    onChange({
      ...config,
      defaultValue: value === "true",
    });
  };

  const currentValue = config.defaultValue === true ? "true" : "false";

  return (
    <div className="flex flex-col gap-2.5">
      <LabelField
        value={config.label}
        onChange={(label) => onChange({ ...config, label, isDuplicate: false })}
        fieldType={config.type}
        onFieldTypeChange={onFieldTypeChange}
        fieldIdentifier={fieldIdentifier}
      />
      <Select
        id="switch-default-value"
        label="Valeur par défaut"
        showLabel
        options={defaultValueOptions}
        value={currentValue}
        onChange={handleDefaultValueChange}
        width={188}
      />
    </div>
  );
};

export default SwitchConfigurator;
