"use client";

import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import type { TextFieldConfig } from "../../types";
import type { SpecificConfiguratorProps } from "../types";
import { LabelField } from "../common/LabelField";

export const TextConfigurator = ({
  config,
  onChange,
  onFieldTypeChange,
}: SpecificConfiguratorProps<TextFieldConfig>) => {
  return (
    <div className="flex flex-col gap-2.5">
      <LabelField
        value={config.label}
        onChange={(label) => onChange({ ...config, label, isDuplicate: false })}
        isDuplicate={config.isDuplicate}
        className="flex-1 w-full"
        fieldType={config.type}
        onFieldTypeChange={onFieldTypeChange}
      />
      <div className="flex flex-col w-50">
        <Label>Valeur par défaut</Label>
        <Input
          value={(config.defaultValue as string) ?? ""}
          onChange={(e) =>
            onChange({ ...config, defaultValue: e.target.value })
          }
          className="h-8 text-sm"
        />
      </div>
    </div>
  );
};

export default TextConfigurator;
