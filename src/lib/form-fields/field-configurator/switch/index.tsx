"use client";

import type { SwitchFieldConfig } from "../../types";
import type { SpecificConfiguratorProps } from "../types";
import { LabelField } from "../common/LabelField";

export const SwitchConfigurator = ({
  config,
  onChange,
  onFieldTypeChange,
}: SpecificConfiguratorProps<SwitchFieldConfig>) => {
  return (
    <LabelField
      value={config.label}
      onChange={(label) => onChange({ ...config, label, isDuplicate: false })}
      isDuplicate={config.isDuplicate}
      fieldType={config.type}
      onFieldTypeChange={onFieldTypeChange}
    />
  );
};

export default SwitchConfigurator;
