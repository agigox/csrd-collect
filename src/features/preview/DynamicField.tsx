"use client";

import { ErrorState } from "@/lib/ui/error-state";
import { getField } from "@/lib/utils/registry";
import type { FieldConfig } from "@/models/FieldTypes";

interface DynamicFieldProps {
  config: FieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  readOnly?: boolean;
}

export const DynamicField = ({
  config,
  value,
  onChange,
  error,
  readOnly = false,
}: DynamicFieldProps) => {
  const registration = getField(config.type);

  if (!registration) {
    return <ErrorState message={`Type de champ inconnu: ${config.type}`} />;
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
      readOnly={readOnly}
    />
  );
};

export default DynamicField;
