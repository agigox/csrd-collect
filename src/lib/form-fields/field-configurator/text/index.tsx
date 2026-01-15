"use client";

import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import type { TextFieldConfig } from "../../types";
import type { SpecificConfiguratorProps } from "../types";

export const TextConfigurator = ({
  config,
  onChange,
}: SpecificConfiguratorProps<TextFieldConfig>) => {
  return (
    <div className="flex flex-col gap-1">
      <Label>Placeholder</Label>
      <Input
        value={config.placeholder ?? ""}
        onChange={(e) => onChange({ ...config, placeholder: e.target.value })}
        placeholder="Texte d'aide dans le champ"
        className="h-8 text-sm w-58.75"
      />
    </div>
  );
};

export default TextConfigurator;
