"use client";

import type { FieldConfig } from "../types";
import type { FieldConfiguratorProps } from "./types";

import { Header } from "./common/Header";
import { DescriptionField } from "./common/DescriptionField";
import { RequiredToggle } from "./common/RequiredToggle";

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

  const renderSpecificConfigurator = () => {
    switch (config.type) {
      case "text":
        return (
          <TextConfigurator config={config} onChange={(c) => handleChange(c)} />
        );
      case "number":
        return (
          <NumberConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
          />
        );
      case "select":
        return (
          <SelectConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
          />
        );
      case "radio":
        return (
          <RadioConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
          />
        );
      case "checkbox":
        return (
          <CheckboxConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
          />
        );
      case "unit":
        return (
          <UnitConfigurator config={config} onChange={(c) => handleChange(c)} />
        );
      case "switch":
        return (
          <SwitchConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
          />
        );
      case "date":
        return (
          <DateConfigurator config={config} onChange={(c) => handleChange(c)} />
        );
      case "import":
        return (
          <ImportConfigurator
            config={config}
            onChange={(c) => handleChange(c)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Header
        type={config.type}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        isDuplicate={config.isDuplicate}
        dragHandleAttributes={dragHandleAttributes}
        dragHandleListeners={dragHandleListeners}
      />
      <div className="flex flex-col gap-4">
        {renderSpecificConfigurator()}

        <DescriptionField
          value={config.description ?? ""}
          onChange={(description) => handleChange({ ...config, description })}
        />
      </div>

      <RequiredToggle
        required={config.required ?? false}
        onChange={(required) => handleChange({ ...config, required })}
      />
    </div>
  );
};

export default FieldConfigurator;
