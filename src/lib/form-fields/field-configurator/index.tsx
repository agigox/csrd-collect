"use client";

import type { FieldConfig } from "../types";
import type { FieldConfiguratorProps } from "./types";

import { Header } from "./common/Header";
import { LabelField } from "./common/LabelField";
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

export const FieldConfigurator = ({
  config,
  onChange,
  onRemove,
  onDuplicate,
}: FieldConfiguratorProps) => {
  const handleChange = (newConfig: FieldConfig) => {
    onChange(newConfig);
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
      />
      <div className="flex flex-col gap-4">
        <LabelField
          value={config.label}
          onChange={(label) => onChange({ ...config, label })}
        />

        {renderSpecificConfigurator()}

        <DescriptionField
          value={config.description ?? ""}
          onChange={(description) => onChange({ ...config, description })}
        />
      </div>

      <RequiredToggle
        required={config.required ?? false}
        onChange={(required) => onChange({ ...config, required })}
      />
    </div>
  );
};

export default FieldConfigurator;
