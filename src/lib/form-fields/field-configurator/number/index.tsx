"use client";

import { Select, TextInput } from "@rte-ds/react";
import type { NumberFieldConfig } from "../../types";
import type { SpecificConfiguratorProps } from "../types";
import { LabelField } from "../common/LabelField";

const unitOptions = [
  { value: "", label: "Sans unité" },
  { value: "L", label: "Litres (L)" },
  { value: "kg", label: "Kilogrammes (kg)" },
  { value: "m", label: "Mètres (m)" },
  { value: "m²", label: "Mètres carrés (m²)" },
  { value: "m³", label: "Mètres cubes (m³)" },
  { value: "t", label: "Tonnes (t)" },
  { value: "kWh", label: "Kilowattheures (kWh)" },
];

export const NumberConfigurator = ({
  config,
  onChange,
  onFieldTypeChange,
}: SpecificConfiguratorProps<NumberFieldConfig>) => {
  return (
    <>
      <LabelField
        value={config.label}
        onChange={(label) => onChange({ ...config, label, isDuplicate: false })}
        isDuplicate={config.isDuplicate}
        fieldType={config.type}
        onFieldTypeChange={onFieldTypeChange}
      />
      <div className="flex gap-4">
        <TextInput
          id="default-value"
          label="Valeur par défaut"
          type="number"
          value={config.defaultValue?.toString() ?? ""}
          onChange={(e) =>
            onChange({
              ...config,
              defaultValue: e ? Number(e) : undefined,
            })
          }
          width={235}
        />
        <Select
          id="unit-select"
          label="Unité"
          showLabel
          options={unitOptions}
          value={config.unit ?? ""}
          onChange={(value) =>
            onChange({ ...config, unit: value || undefined })
          }
          width={160}
          showResetButton
        />
      </div>
    </>
  );
};

export default NumberConfigurator;
