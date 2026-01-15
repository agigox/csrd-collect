"use client";

import type { SwitchFieldConfig } from "../../types";
import type { SpecificConfiguratorProps } from "../types";

// Switch has no specific configuration beyond the common fields
// (label, description, required are all handled by the main FieldConfigurator)
export const SwitchConfigurator = (
  _props: SpecificConfiguratorProps<SwitchFieldConfig>
) => {
  return null;
};

export default SwitchConfigurator;
