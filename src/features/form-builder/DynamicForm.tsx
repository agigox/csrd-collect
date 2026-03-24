"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { DynamicField } from "@/features/preview/DynamicField";
import type { FieldConfig } from "@/models/FieldTypes";
import { isChildFieldVisible } from "@/lib/utils/branching";
import { EmptyState } from "@/components/common/EmptyState";
import { ScrollableContainer } from "@/lib/utils/ScrollableContainer";

interface DynamicFormProps {
  schema: FieldConfig[];
  values: Record<string, unknown>;
  onChange?: (values: Record<string, unknown>) => void;
  errors?: Record<string, string>;
  className?: string;
  readOnly?: boolean;
}

export const DynamicForm = ({
  schema,
  values,
  onChange,
  errors,
  className,
  readOnly = false,
}: DynamicFormProps) => {
  const handleFieldChange = (fieldName: string, fieldValue: unknown) => {
    if (onChange && !readOnly) {
      const newValues = {
        ...values,
        [fieldName]: fieldValue,
      };

      // Clear values of children that become hidden when parent value changes
      const changedField = schema.find((f) => f.name === fieldName);
      if (changedField) {
        for (const field of schema) {
          if (field.branchingInfo?.parentFieldId === changedField.id) {
            if (!isChildFieldVisible(field, newValues, schema)) {
              delete newValues[field.name];
            }
          }
        }
      }

      onChange(newValues);
    }
  };

  if (!schema || !Array.isArray(schema)) {
    return <EmptyState text="Aucun champ à afficher" />;
  }

  return (
    <LayoutGroup>
      <div className={className ?? "flex flex-col gap-4"}>
        <AnimatePresence mode="popLayout">
          {schema.map((fieldConfig) => {
            // Check visibility for child fields
            if (fieldConfig.branchingInfo?.parentFieldId) {
              if (!isChildFieldVisible(fieldConfig, values, schema)) {
                return null;
              }
            }

            return (
              <motion.div
                key={fieldConfig.name}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}
              >
                <DynamicField
                  config={fieldConfig}
                  value={values[fieldConfig.name]}
                  onChange={(value) =>
                    handleFieldChange(fieldConfig.name, value)
                  }
                  error={errors?.[fieldConfig.name]}
                  readOnly={readOnly}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
};

export default DynamicForm;
