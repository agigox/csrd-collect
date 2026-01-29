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
import type { UnitFieldConfig } from "../../types";
import type { SpecificConfiguratorProps } from "../types";
import { LabelField } from "../common/LabelField";

const unitOptions = [
  { value: "L", label: "Litres (L)" },
  { value: "kg", label: "Kilogrammes (kg)" },
  { value: "m", label: "Mètres (m)" },
  { value: "m²", label: "Mètres carrés (m²)" },
  { value: "m³", label: "Mètres cubes (m³)" },
  { value: "t", label: "Tonnes (t)" },
  { value: "kWh", label: "Kilowattheures (kWh)" },
];

export const UnitConfigurator = ({
  config,
  onChange,
  onFieldTypeChange,
}: SpecificConfiguratorProps<UnitFieldConfig>) => {
  return (
    <div className="mt-2 pt-2 border-t flex flex-col gap-4">
      <LabelField
        value={config.label}
        onChange={(label) => onChange({ ...config, label, isDuplicate: false })}
        isDuplicate={config.isDuplicate}
        fieldType={config.type}
        onFieldTypeChange={onFieldTypeChange}
      />
      <div className="flex flex-col gap-1">
        <Label>Unité</Label>
        <Select
          value={config.unit}
          onValueChange={(value) => onChange({ ...config, unit: value })}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Sélectionner une unité" />
          </SelectTrigger>
          <SelectContent>
            {unitOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
};

export default UnitConfigurator;
