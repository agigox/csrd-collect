"use client";

import type { TextFieldConfig } from "@/models/FieldTypes";
import type { SpecificConfiguratorProps } from "@/lib/types/field";
import { LabelField } from "../common/LabelField";
import { Checkbox, TextInput } from "@rte-ds/react";

export const TextConfigurator = ({
  config,
  onChange,
  onFieldTypeChange,
  fieldIdentifier,
}: SpecificConfiguratorProps<TextFieldConfig>) => {
  const isTextarea = config.type === "textarea";

  return (
    <div className="flex flex-col gap-2.5">
      <LabelField
        value={config.label}
        onChange={(label) => onChange({ ...config, label, isDuplicate: false })}
        className="flex-1 w-full"
        fieldType="text"
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
          showRightIcon={false}
          onChange={(e) => onChange({ ...config, defaultValue: e })}
          value={(config.defaultValue as string) ?? ""}
        />
      </div>
      <Checkbox
        errorMessage=""
        id="textarea-checkbox"
        label="Texte long"
        showLabel
        onChange={() =>
          onChange({ ...config, type: isTextarea ? "text" : "textarea" })
        }
        checked={isTextarea}
      />
    </div>
  );
};

export default TextConfigurator;
