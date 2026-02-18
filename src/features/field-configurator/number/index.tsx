"use client";

import { TextInput } from "@rte-ds/react";
import type { NumberFieldConfig } from "@/models/FieldTypes";
import type { SpecificConfiguratorProps } from "@/lib/types/field";
import { LabelField } from "../common/LabelField";

export const NumberConfigurator = ({
  config,
  onChange,
  onFieldTypeChange,
  fieldIdentifier,
}: SpecificConfiguratorProps<NumberFieldConfig>) => {
  return (
    <>
      <LabelField
        value={config.label}
        onChange={(label) => onChange({ ...config, label, isDuplicate: false })}
        isDuplicate={config.isDuplicate}
        fieldType={config.type}
        onFieldTypeChange={onFieldTypeChange}
        fieldIdentifier={fieldIdentifier}
      />
      <div className="flex gap-4">
        <TextInput
          id="default-value"
          label="Valeur par défaut"
          value={config.defaultValue?.toString() ?? ""}
          onChange={(e) =>
            onChange({
              ...config,
              defaultValue: e ? Number(e) : undefined,
            })
          }
          width={235}
          type="number"
          {...(config.unit && { unit: config.unit })}
        />
        <TextInput
          id="unit-value"
          label="Unité"
          value={config.unit ?? ""}
          onChange={(value) =>
            onChange({ ...config, unit: value || undefined })
          }
          width={160}
        />
      </div>
    </>
  );
};

export default NumberConfigurator;
