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
  fieldIdentifier,
}: SpecificConfiguratorProps<DateFieldConfig>) => {
  return (
    <div className="flex flex-col gap-4">
      <LabelField
        value={config.label}
        onChange={(label) => onChange({ ...config, label, isDuplicate: false })}
        isDuplicate={config.isDuplicate}
        fieldType={config.type}
        onFieldTypeChange={onFieldTypeChange}
        fieldIdentifier={fieldIdentifier}
      />
      <div className="flex gap-4 items-end">
        {/* Valeur par défaut */}
        <Select
          id="select-date-default-value"
          label="Valeur par défaut"
          onChange={(value) => {
            const defaultDateValue = value as "none" | "today";
            // Set defaultValue based on selection for preview sync
            const defaultValue =
              defaultDateValue === "today"
                ? { date: new Date().toISOString() }
                : undefined;
            onChange({
              ...config,
              defaultDateValue,
              defaultValue,
            });
          }}
          options={defaultDateOptions}
          showLabel
          value={config.defaultDateValue ?? "none"}
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
