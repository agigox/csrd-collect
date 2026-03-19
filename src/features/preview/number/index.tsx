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
  // Keep raw string for display so user can type "1," without it being reset to "1"
  const [rawValue, setRawValue] = useState<string>(
    value !== undefined && value !== 0 ? String(value) : "",
  );

  // Sync from external value changes (e.g. initial load)
  useEffect(() => {
    const external = value !== undefined && value !== 0 ? String(value) : "";
    const normalized = rawValue.replace(",", ".");
    const parsed = parseFloat(normalized);
    if (!isNaN(parsed) && parsed !== value) {
      setRawValue(external);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (input: string) => {
    setRawValue(input);
    const normalized = input.replace(",", ".");
    if (normalized === "" || normalized === "-") {
      onChange(0);
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
