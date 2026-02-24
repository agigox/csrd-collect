"use client";

import type { TextFieldConfig } from "@/models/FieldTypes";
import type { SpecificConfiguratorProps } from "@/lib/types/field";
import { LabelField } from "../common/LabelField";
import { TextInput } from "@rte-ds/react";

export const TextConfigurator = ({
  config,
  onChange,
  onFieldTypeChange,
  fieldIdentifier,
}: SpecificConfiguratorProps<TextFieldConfig>) => {
  return (
    <div className="flex flex-col gap-2.5">
      <LabelField
        value={config.label}
        onChange={(label) => onChange({ ...config, label, isDuplicate: false })}
        className="flex-1 w-full"
        fieldType={config.type}
        onFieldTypeChange={onFieldTypeChange}
        fieldIdentifier={fieldIdentifier}
      />
      <div className="flex flex-col w-50">
        <TextInput
          aria-required
          assistiveAppearance="description"
          autoComplete="off"
          id="text-input-default"
          label="Valeur par défaut"
          labelPosition="top"
          onChange={(e) => onChange({ ...config, defaultValue: e })}
          value={(config.defaultValue as string) ?? ""}
        />
      </div>
    </div>
  );
};

export default TextConfigurator;
