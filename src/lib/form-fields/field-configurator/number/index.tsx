"use client";

import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import type { NumberFieldConfig } from "../../types";
import type { SpecificConfiguratorProps } from "../types";

export const NumberConfigurator = ({
  config,
  onChange,
}: SpecificConfiguratorProps<NumberFieldConfig>) => {
  return (
    <>
      <div className="flex flex-col gap-1">
        <Label>Placeholder</Label>
        <Input
          value={config.placeholder ?? ""}
          onChange={(e) => onChange({ ...config, placeholder: e.target.value })}
          placeholder="Texte d'aide dans le champ"
          className="h-8 text-sm w-58.75"
        />
      </div>

      <div className="mt-2 pt-2 border-t grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>Minimum</Label>
          <Input
            type="number"
            value={config.min ?? ""}
            onChange={(e) =>
              onChange({
                ...config,
                min: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="Pas de minimum"
            className="h-8 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Maximum</Label>
          <Input
            type="number"
            value={config.max ?? ""}
            onChange={(e) =>
              onChange({
                ...config,
                max: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="Pas de maximum"
            className="h-8 text-sm"
          />
        </div>
      </div>
    </>
  );
};

export default NumberConfigurator;
