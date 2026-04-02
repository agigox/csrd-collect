"use client";

import { useState, useEffect } from "react";
import type { NumberFieldConfig } from "@/models/FieldTypes";
import type { FieldProps, FieldRegistration } from "@/lib/types/field";
import { TextInput } from "@rte-ds/react";

const NumberField = ({
  config,
  value,
  onChange,
  error,
  readOnly = false,
}: FieldProps<NumberFieldConfig>) => {
  // Display: value from parent (seeded with defaultValue in Declarations.tsx)
  // No local fallback to config.defaultValue — seeding handles initial defaults
  const [rawValue, setRawValue] = useState<string>(
    value !== undefined && value !== null ? String(value) : "",
  );

  // Sync from external value changes (e.g. initial load via seeding)
  useEffect(() => {
    const external = value !== undefined && value !== null ? String(value) : "";
    const normalized = rawValue.replace(",", ".");
    const parsed = parseFloat(normalized);
    if (
      external !== rawValue &&
      (rawValue === "" || (!isNaN(parsed) && parsed !== value))
    ) {
      setRawValue(external);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (input: string) => {
    setRawValue(input);
    const normalized = input.replace(",", ".");
    if (normalized === "" || normalized === "-") {
      onChange(undefined);
      return;
    }
    const num = parseFloat(normalized);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <TextInput
        id={config.name}
        name={config.name}
        label={config.label}
        labelPosition="top"
        onChange={handleChange}
        value={rawValue}
        required={config.required}
        readOnly={readOnly}
        {...(config.unit && { unit: config.unit })}
        width={"100%"}
        tooltipTextLabel={config.description}
        error={error !== undefined}
        assistiveTextLabel={error}
        assistiveAppearance={error !== undefined ? "error" : undefined}
        showAssistiveIcon={error !== undefined}
        showRightIcon={false}
      />
    </div>
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "number",
  component: NumberField,
  defaultConfig: {},
};

export default NumberField;
