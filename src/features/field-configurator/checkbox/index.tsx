"use client";

import { Checkbox, IconButton, TextInput } from "@rte-ds/react";
import type { CheckboxFieldConfig, SelectOption } from "@/models/FieldTypes";
import type { SpecificConfiguratorProps } from "@/lib/types/field";
import { LabelField } from "../common/LabelField";
import { DefaultValueSelector } from "../common/DefaultValueSelector";
import { BranchingSelect } from "../common/BranchingSelect";

export const CheckboxConfigurator = ({
  config,
  onChange,
  onFieldTypeChange,
  fieldIdentifier,
  schema = [],
}: SpecificConfiguratorProps<CheckboxFieldConfig>) => {
  const handleOptionChange = (
    index: number,
    field: keyof SelectOption,
    value: string,
  ) => {
    const newOptions = [...(config.options ?? [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onChange({ ...config, options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...(config.options ?? [])];
    const newIndex = newOptions.length + 1;
    newOptions.push({
      value: `option_${newIndex}`,
      label: `Choix ${newIndex}`,
    });
    onChange({ ...config, options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...(config.options ?? [])];
    if (newOptions.length <= 1) return; // Keep at least one option

    // If removing a default option, update defaultIndices
    const currentDefaults = config.defaultIndices ?? [];
    const newDefaults = currentDefaults
      .filter((i) => i !== index)
      .map((i) => (i > index ? i - 1 : i));

    // Clean up branching for the removed option
    const removedOption = newOptions[index];
    const newBranching = { ...(config.branching ?? {}) };
    const newBranchingColors = { ...(config.branchingColors ?? {}) };
    delete newBranching[removedOption.value];
    delete newBranchingColors[removedOption.value];

    newOptions.splice(index, 1);
    onChange({
      ...config,
      options: newOptions,
      defaultIndices: newDefaults,
      branching: newBranching,
      branchingColors: newBranchingColors,
    });
  };

  const handleBranchingChange = (optionValue: string, fieldTypes: string[]) => {
    const currentBranching = config.branching ?? {};
    const currentLinkedIds = currentBranching[optionValue] ?? [];

    // Preserve existing field IDs for types that remain selected,
    // only add raw type names for newly selected types (FormBuilder will convert them)
    const usedIds = new Set<string>();
    const newLinked: string[] = [];

    for (const type of fieldTypes) {
      const existingId = currentLinkedIds.find((id) => {
        if (usedIds.has(id)) return false;
        const field = schema.find((f) => f.id === id);
        return field?.type === type;
      });

      if (existingId) {
        newLinked.push(existingId);
        usedIds.add(existingId);
      } else {
        newLinked.push(type);
      }
    }

    const newBranching = { ...currentBranching };
    if (newLinked.length > 0) {
      newBranching[optionValue] = newLinked;
    } else {
      delete newBranching[optionValue];
    }
    onChange({ ...config, branching: newBranching });
  };

  const options = config.options ?? [];
  const hasDefaultValue = config.defaultIndices !== undefined;

  // Gérer le toggle du checkbox "Définir une valeur par défaut"
  const handleToggleDefaultValue = () => {
    if (hasDefaultValue) {
      onChange({ ...config, defaultIndices: undefined });
    } else {
      onChange({ ...config, defaultIndices: [] });
    }
  };

  // Gérer le changement de valeurs par défaut (multiple)
  const handleDefaultMultipleChange = (values: string[]) => {
    const indices = values
      .map((v) => options.findIndex((o) => o.value === v))
      .filter((i) => i >= 0);
    onChange({ ...config, defaultIndices: indices });
  };

  // Obtenir les valeurs actuelles pour le multi-select
  const currentDefaultMultipleValues = (config.defaultIndices ?? [])
    .filter((i) => options[i])
    .map((i) => options[i].value);

  return (
    <div className="flex flex-col gap-3">
      <LabelField
        value={config.label}
        onChange={(label) => onChange({ ...config, label, isDuplicate: false })}
        fieldType={config.type}
        onFieldTypeChange={onFieldTypeChange}
        fieldIdentifier={fieldIdentifier}
      />

      {options.map((option, index) => {
        const isLast = index === options.length - 1;
        const linkedFieldIds = config.branching?.[option.value] ?? [];
        const branchingColor = config.branchingColors?.[option.value];
        return (
          <div key={index} className="flex gap-2 items-end">
            <Checkbox
              id={`checkbox-indicator-${index}`}
              label="Checkbox"
              showLabel={false}
              checked={false}
              disabled={true}
            />
            <div className="flex gap-2 items-end flex-1">
              <TextInput
                id={`option-${index}`}
                label={`Choix ${index + 1}`}
                value={option.label}
                onChange={(value) => handleOptionChange(index, "label", value)}
                width="100%"
              />
              {config.branchingEnabled && (
                <BranchingSelect
                  optionValue={option.value}
                  linkedFieldIds={linkedFieldIds}
                  schema={schema}
                  branchingColor={branchingColor}
                  branchingNumber={index + 1}
                  onChange={handleBranchingChange}
                />
              )}
            </div>
            {isLast ? (
              <IconButton
                appearance="filled"
                aria-label="Ajouter une option"
                name="add"
                onClick={handleAddOption}
                size="m"
                variant="primary"
              />
            ) : (
              <IconButton
                appearance="outlined"
                aria-label="Supprimer cette option"
                name="close"
                onClick={() => handleRemoveOption(index)}
                size="m"
                variant="transparent"
              />
            )}
          </div>
        );
      })}
      {/* Définir une valeur par défaut */}
      <DefaultValueSelector
        mode="multiple"
        options={options}
        hasDefaultValue={hasDefaultValue}
        onToggle={handleToggleDefaultValue}
        currentMultipleValues={currentDefaultMultipleValues}
        onMultipleChange={handleDefaultMultipleChange}
        id="checkbox-config"
      />
    </div>
  );
};

export default CheckboxConfigurator;
