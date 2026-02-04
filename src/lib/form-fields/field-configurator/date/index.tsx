"use client";

import type { DateFieldConfig, SpecificConfiguratorProps } from "@/models/FieldTypes";
import { LabelField } from "../common/LabelField";
import { Checkbox, Select } from "@rte-ds/react";

const defaultDateOptions = [
  { value: "none", label: "Aucune" },
  { value: "today", label: "Date du jour" },
];

export const DateConfigurator = ({
  config,
  onChange,
  onFieldTypeChange,
}: SpecificConfiguratorProps<DateFieldConfig>) => {
  return (
    <div className="flex flex-col gap-4">
      <LabelField
        value={config.label}
        onChange={(label) => onChange({ ...config, label, isDuplicate: false })}
        isDuplicate={config.isDuplicate}
        fieldType={config.type}
        onFieldTypeChange={onFieldTypeChange}
      />
      <div className="flex gap-4 items-end">
        {/* Valeur par défaut */}
        <Select
          id="select-date-default-value"
          label="Valeur par défaut"
          onChange={(value) =>
            onChange({
              ...config,
              defaultDateValue: value as "none" | "today",
            })
          }
          options={defaultDateOptions}
          showLabel
          width={188}
        />
        {/* Inclure l'heure */}
        <Checkbox
          errorMessage=""
          id="include-time-checkbox"
          label="Inclure l'heure"
          showLabel
          onChange={() =>
            onChange({ ...config, includeTime: !config.includeTime })
          }
          checked={config.includeTime}
        />
      </div>
    </div>
  );
};

export default DateConfigurator;
