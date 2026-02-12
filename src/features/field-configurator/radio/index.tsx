"use client";

import { IconButton, RadioButton, TextInput } from "@rte-ds/react";
import type {
  RadioFieldConfig,
  SelectOption,
  SpecificConfiguratorProps,
} from "@/models/FieldTypes";
import { LabelField } from "../common/LabelField";
import { DefaultValueSelector } from "../common/DefaultValueSelector";
import { BranchingSelect } from "../common/BranchingSelect";

export const RadioConfigurator = ({
  config,
  onChange,
  onFieldTypeChange,
  schema = [],
}: SpecificConfiguratorProps<RadioFieldConfig>) => {
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

    // If removing the default option, clear the default
    let newDefaultIndex = config.defaultIndex;
    if (config.defaultIndex !== undefined) {
      if (config.defaultIndex === index) {
        newDefaultIndex = undefined;
      } else if (config.defaultIndex > index) {
        newDefaultIndex = config.defaultIndex - 1;
      }
    }

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
      defaultIndex: newDefaultIndex,
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
  const hasDefaultValue = config.defaultIndex !== undefined;

  // Gérer le toggle du checkbox "Définir une valeur par défaut"
  const handleToggleDefaultValue = () => {
    if (hasDefaultValue) {
      onChange({ ...config, defaultIndex: undefined });
    } else {
      onChange({ ...config, defaultIndex: options.length > 0 ? 0 : undefined });
    }
  };

  // Gérer le changement de valeur par défaut
  const handleDefaultChange = (value: string) => {
    const index = options.findIndex((o) => o.value === value);
    onChange({ ...config, defaultIndex: index >= 0 ? index : undefined });
  };

  // Obtenir la valeur actuelle pour le select
  const currentDefaultValue =
    config.defaultIndex !== undefined && options[config.defaultIndex]
      ? options[config.defaultIndex].value
      : "";

  return (
    <div className="flex flex-col gap-3">
      <LabelField
        value={config.label}
        onChange={(label) => onChange({ ...config, label, isDuplicate: false })}
        isDuplicate={config.isDuplicate}
        fieldType={config.type}
        onFieldTypeChange={onFieldTypeChange}
      />
      {options.map((option, index) => {
        const isLast = index === options.length - 1;
        const linkedFieldIds = config.branching?.[option.value] ?? [];
        const branchingColor = config.branchingColors?.[option.value];
        return (
          <div key={index} className="flex gap-2 items-end">
            <RadioButton
              groupName="radio-group"
              label="Radio Button"
              showLabel={false}
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
        mode="single"
        options={options}
        hasDefaultValue={hasDefaultValue}
        onToggle={handleToggleDefaultValue}
        currentSingleValue={currentDefaultValue}
        onSingleChange={handleDefaultChange}
        id="radio-config"
      />
    </div>
  );
};

export default RadioConfigurator;
