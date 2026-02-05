"use client";

import { getField } from "../form-fields/registry";
import type { FieldConfig } from "@/models/FieldTypes";

interface DynamicFieldProps {
  config: FieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

export const DynamicField = ({
  config,
  value,
  onChange,
  error,
}: DynamicFieldProps) => {
  const registration = getField(config.type);

  if (!registration) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-700">
        Type de champ inconnu: {config.type}
      </div>
    );
  }

  const FieldComponent = registration.component;

  // Use defaultValue from config if value is undefined
  const effectiveValue = value !== undefined ? value : config.defaultValue;

  return (
    <FieldComponent
      config={config}
      value={effectiveValue}
      onChange={onChange}
      error={error}
    />
  );
};

export default DynamicField;
