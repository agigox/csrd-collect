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
    <div className="flex flex-col">
      <Label>Valeur par défaut</Label>
      <Input
        value={(config.defaultValue as string) ?? ""}
        onChange={(e) => onChange({ ...config, defaultValue: e.target.value })}
        className="h-8 text-sm w-58.75"
      />
    </div>
  );
};

export default TextConfigurator;
