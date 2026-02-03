"use client";

import type { FieldConfig, FieldType } from "../types";
import { getField } from "../registry";
import type { FieldConfiguratorProps } from "./types";

import { DescriptionField } from "./common/DescriptionField";
import { Footer } from "./common/Footer";
import { LabelField } from "./common/LabelField";

import { TextConfigurator } from "./text";
import { NumberConfigurator } from "./number";
import { SelectConfigurator } from "./select";
import { RadioConfigurator } from "./radio";
import { CheckboxConfigurator } from "./checkbox";
import { UnitConfigurator } from "./unit";
import { SwitchConfigurator } from "./switch";
import { DateConfigurator } from "./date";
import { ImportConfigurator } from "./import";

export const FieldConfigurator = ({
  config,
  onChange,
  onRemove,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  isOpen = true,
  onOpen,
  dragHandleAttributes,
  dragHandleListeners,
}: FieldConfiguratorProps) => {
  // Remove isDuplicate flag when user modifies any field
  const handleChange = (newConfig: FieldConfig) => {
    if (newConfig.isDuplicate) {
      const { ...configWithoutDuplicate } = newConfig;
      onChange(configWithoutDuplicate as FieldConfig);
    } else {
      onChange(newConfig);
    }
  };

  const handleFieldTypeChange = (newType: FieldType) => {
    if (newType === config.type) return;
    const registration = getField(newType);
    const base = {
      name: config.name,
      label: config.label,
      required: config.required,
      description: config.description,
      ...registration?.defaultConfig,
    };

    const defaultOptions = [
      { value: "option_1", label: "Choix 1" },
      { value: "option_2", label: "Choix 2" },
      { value: "option_3", label: "Choix 3" },
    ];

    const typeDefaults: Record<string, Partial<FieldConfig>> = {
      select: { options: [], selectionMode: "single" },
      radio: { options: defaultOptions },
      checkbox: { options: defaultOptions },
      date: { includeTime: false, defaultDateValue: "none" },
      unit: { unit: "" },
    };

    const newConfig = {
      ...base,
      type: newType,
      ...(typeDefaults[newType] ?? {}),
    } as FieldConfig;
    onChange(newConfig);
  };

  const renderSpecificConfigurator = () => {
    const typeChangeProps = { onFieldTypeChange: handleFieldTypeChange };
    switch (config.type) {
      case "text":
        return (
          <TextConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
            {...typeChangeProps}
          />
        );
      case "number":
        return (
          <NumberConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
            {...typeChangeProps}
          />
        );
      case "select":
        return (
          <SelectConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
            {...typeChangeProps}
          />
        );
      case "radio":
        return (
          <RadioConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
            {...typeChangeProps}
          />
        );
      case "checkbox":
        return (
          <CheckboxConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
            {...typeChangeProps}
          />
        );
      case "unit":
        return (
          <UnitConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
            {...typeChangeProps}
          />
        );
      case "switch":
        return (
          <SwitchConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
            {...typeChangeProps}
          />
        );
      case "date":
        return (
          <DateConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
            {...typeChangeProps}
          />
        );
      case "import":
        return (
          <ImportConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
            {...typeChangeProps}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <LabelField
        value={config.label}
        onChange={() => {}}
        isDuplicate={config.isDuplicate}
        fieldType={config.type}
        collapsedActions={{
          onMoveUp,
          onMoveDown,
          onDuplicate,
          canMoveUp,
          canMoveDown,
        }}
        onOpen={onOpen}
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {renderSpecificConfigurator()}

      <DescriptionField
        value={config.description ?? ""}
        onChange={(description) => handleChange({ ...config, description })}
      />

      <Footer
        required={config.required ?? false}
        onRequiredChange={(required) => handleChange({ ...config, required })}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        dragHandleAttributes={dragHandleAttributes}
        dragHandleListeners={dragHandleListeners}
      />
    </div>
  );
};

export default FieldConfigurator;
