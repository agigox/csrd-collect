"use client";

import { getField } from "./registry";
import type { FieldConfig } from "./types";

interface DynamicFieldProps {
  config: FieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

export const DynamicField = ({ config, value, onChange, error }: DynamicFieldProps) => {
  const registration = getField(config.type);

  if (!registration) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-700">
        Type de champ inconnu: {config.type}
      </div>
    );
  }

  const FieldComponent = registration.component;

  return <FieldComponent config={config} value={value} onChange={onChange} error={error} />;
};

export default DynamicField;
