"use client";

import type { SwitchFieldConfig } from "../../types";
import type { SpecificConfiguratorProps } from "../types";
import { LabelField } from "../common/LabelField";

export const SwitchConfigurator = ({
  config,
  onChange,
}: SpecificConfiguratorProps<SwitchFieldConfig>) => {
  return (
    <LabelField
      value={config.label}
      onChange={(label) => onChange({ ...config, label })}
    />
  );
};

export default SwitchConfigurator;
