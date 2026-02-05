"use client";

import { LayoutGroup, motion } from "motion/react";
import { DynamicField } from "../dynamic-field/DynamicField";
import type { FieldConfig } from "@/models/FieldTypes";

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
    <LayoutGroup>
      <div
        className={className ?? "flex flex-col gap-4 border-2 border-red-500"}
      >
        {schema.map((fieldConfig) => (
          <motion.div
            key={fieldConfig.name}
            layout
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 30,
            }}
          >
            <DynamicField
              config={fieldConfig}
              value={values[fieldConfig.name]}
              onChange={(value) => handleFieldChange(fieldConfig.name, value)}
              error={errors?.[fieldConfig.name]}
            />
          </motion.div>
        ))}
      </div>
    </LayoutGroup>
  );
};

export default DynamicForm;
