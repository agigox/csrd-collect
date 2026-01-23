"use client";

import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import type { NumberFieldConfig } from "../../types";
import type { SpecificConfiguratorProps } from "../types";
import { LabelField } from "../common/LabelField";

const unitOptions = [
  { value: "", label: "Sans unité" },
  { value: "L", label: "Litres (L)" },
  { value: "kg", label: "Kilogrammes (kg)" },
  { value: "m", label: "Mètres (m)" },
  { value: "m²", label: "Mètres carrés (m²)" },
  { value: "m³", label: "Mètres cubes (m³)" },
  { value: "t", label: "Tonnes (t)" },
  { value: "kWh", label: "Kilowattheures (kWh)" },
];

export const NumberConfigurator = ({
  config,
  onChange,
}: SpecificConfiguratorProps<NumberFieldConfig>) => {
  return (
    <>
      <LabelField
        value={config.label}
        onChange={(label) => onChange({ ...config, label })}
      />
      <div className="flex gap-4">
        <div className="flex flex-col gap-1">
          <Label>Placeholder</Label>
          <Input
            value={config.placeholder ?? ""}
            onChange={(e) =>
              onChange({ ...config, placeholder: e.target.value })
            }
            placeholder="Texte d'aide dans le champ"
            className="h-8 text-sm w-58.75"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Unité</Label>
          <Select
            value={config.unit ?? ""}
            onValueChange={(value) =>
              onChange({ ...config, unit: value || undefined })
            }
          >
            <SelectTrigger className="h-8 w-40">
              <SelectValue placeholder="Sans unité" />
            </SelectTrigger>
            <SelectContent>
              {unitOptions.map((option) => (
                <SelectItem
                  key={option.value || "none"}
                  value={option.value || "none"}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
