"use client";

import { DynamicField } from "./DynamicField";
import type { FieldConfig } from "./types";

interface DynamicFormProps {
  schema: FieldConfig[];
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
  errors?: Record<string, string>;
  className?: string;
}

export const DynamicForm = ({
  schema,
  values,
  onChange,
  errors,
  className,
}: DynamicFormProps) => {
  const handleFieldChange = (fieldName: string, fieldValue: unknown) => {
    onChange({
      ...values,
      [fieldName]: fieldValue,
    });
  };

  return (
    <div className={className ?? "flex flex-col gap-4"}>
      {schema.map((fieldConfig) => (
        <DynamicField
          key={fieldConfig.name}
          config={fieldConfig}
          value={values[fieldConfig.name]}
          onChange={(value) => handleFieldChange(fieldConfig.name, value)}
          error={errors?.[fieldConfig.name]}
        />
      ))}
    </div>
  );
};

export default DynamicForm;
