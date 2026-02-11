"use client";

import { Select } from "@rte-ds/react";
import type { FieldConfig, FieldType } from "@/models/FieldTypes";
import { typeLabels } from "@/models/FieldTypes";

interface BranchingSelectProps {
  optionValue: string;
  linkedFieldIds: string[];
  schema: FieldConfig[];
  branchingColor?: string;
  onChange: (optionValue: string, newFieldTypes: string[]) => void;
}

const fieldTypeOptions = Object.entries(typeLabels).map(([value, label]) => ({
  value,
  label,
}));

export const BranchingSelect = ({
  optionValue,
  linkedFieldIds,
  schema,
  branchingColor,
  onChange,
}: BranchingSelectProps) => {
  // Derive current selected types from linked field IDs
  const currentTypes = linkedFieldIds
    .map((id) => schema.find((f) => f.id === id)?.type)
    .filter((t): t is FieldType => !!t);

  const handleMultipleChange = (newValues: string[]) => {
    onChange(optionValue, newValues);
  };

  const hasSelections = currentTypes.length > 0;

  return (
    <div
      style={{
        borderLeft: hasSelections
          ? `3px solid ${branchingColor ?? "#7C3AED"}`
          : undefined,
        paddingLeft: hasSelections ? "8px" : undefined,
      }}
    >
      <Select
        id={`branching-${optionValue}`}
        label="Embranchement"
        showLabel={true}
        multiple={true}
        multipleValue={currentTypes}
        onMultipleChange={handleMultipleChange}
        options={fieldTypeOptions}
        width={180}
        defaultOption="Aucun"
      />
    </div>
  );
};

export default BranchingSelect;
