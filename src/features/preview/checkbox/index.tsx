"use client";

import { useEffect, useMemo, useRef } from "react";
import { CheckboxGroup } from "@rte-ds/react";
import type { CheckboxFieldConfig } from "@/models/FieldTypes";
import type { FieldProps, FieldRegistration } from "@/lib/types/field";

const CheckboxField = ({
  config,
  value,
  onChange,
  error,
  readOnly = false,
}: FieldProps<CheckboxFieldConfig>) => {
  const options = useMemo(() => config.options ?? [], [config.options]);
  const containerRef = useRef<HTMLDivElement>(null);

  const getDefaultValues = (): string[] => {
    if (config.defaultIndices && config.defaultIndices.length > 0) {
      return config.defaultIndices
        .filter((idx) => options[idx])
        .map((idx) => options[idx].value);
    }
    return [];
  };

  const currentValues: string[] = Array.isArray(value)
    ? value
    : getDefaultValues();

  const handleToggle = (optionValue: string) => {
    if (currentValues.includes(optionValue)) {
      onChange(currentValues.filter((v) => v !== optionValue));
    } else {
      onChange([...currentValues, optionValue]);
    }
  };

  const items = options.map((option) => option.label);

  // Sync controlled state with uncontrolled CheckboxGroup inputs
  useEffect(() => {
    if (!containerRef.current) return;
    const checkboxes = containerRef.current.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]',
    );
    checkboxes.forEach((checkbox, index) => {
      if (options[index]) {
        checkbox.checked = currentValues.includes(options[index].value);
      }
    });
  }, [currentValues, options]);

  return (
    <CheckboxGroup
      ref={containerRef}
      items={items}
      groupTitle={config.label}
      showGroupTitle
      tooltipTextLabel={config.description}
      showHelpText={!!config.description}
      required={config.required}
      direction="vertical"
      error={!!error}
      errorMessage={error || ""}
      readOnly={readOnly}
      onChange={(e) => {
        const target = e.target as HTMLInputElement;
        const index = items.findIndex(
          (item, idx) => target.id === `${item}-${idx}`,
        );
        if (index !== -1) {
          handleToggle(options[index].value);
        }
      }}
    />
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "checkbox",
  component: CheckboxField,
  defaultConfig: {},
};

export default CheckboxField;
