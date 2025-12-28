"use client";

import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { Button } from "@/lib/components/ui/button";
import Icon from "@/lib/Icons";
import type { FieldConfig, SelectOption } from "./types";

interface FieldConfiguratorProps {
  config: FieldConfig;
  onChange: (config: FieldConfig) => void;
  onRemove: () => void;
}

const typeLabels: Record<string, string> = {
  text: "Champ simple",
  number: "Nombre",
  select: "Liste déroulante",
  unit: "Quantité avec unité",
  switch: "Interrupteur",
};

const unitOptions = [
  { value: "L", label: "Litres (L)" },
  { value: "kg", label: "Kilogrammes (kg)" },
  { value: "m", label: "Mètres (m)" },
  { value: "m²", label: "Mètres carrés (m²)" },
  { value: "m³", label: "Mètres cubes (m³)" },
  { value: "t", label: "Tonnes (t)" },
  { value: "kWh", label: "Kilowattheures (kWh)" },
];

export const FieldConfigurator = ({
  config,
  onChange,
  onRemove,
}: FieldConfiguratorProps) => {
  const handleAddOption = () => {
    if (config.type === "select") {
      const newOptions = [
        ...config.options,
        {
          value: `option${config.options.length + 1}`,
          label: `Option ${config.options.length + 1}`,
        },
      ];
      onChange({ ...config, options: newOptions });
    }
  };

  const handleOptionChange = (
    index: number,
    field: keyof SelectOption,
    value: string
  ) => {
    if (config.type === "select") {
      const newOptions = [...config.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      onChange({ ...config, options: newOptions });
    }
  };

  const handleRemoveOption = (index: number) => {
    if (config.type === "select" && config.options.length > 1) {
      const newOptions = config.options.filter((_, i) => i !== index);
      onChange({ ...config, options: newOptions });
    }
  };

  return (
    <div className="border-b border-b-black p-4 bg-white">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-content-muted">
          {typeLabels[config.type]}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700"
        >
          <Icon name="close" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div
          className={`flex flex-col gap-2 ${
            config.type === "unit" || config.type === "switch"
              ? "col-span-2"
              : ""
          }`}
        >
          <Label htmlFor={`${config.name}-label`}>Libellé</Label>
          <Input
            id={`${config.name}-label`}
            value={config.label}
            onChange={(e) => onChange({ ...config, label: e.target.value })}
            placeholder="Libellé affiché"
          />
        </div>

        {config.type !== "unit" && config.type !== "switch" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${config.name}-placeholder`}>Placeholder</Label>
            <Input
              id={`${config.name}-placeholder`}
              value={config.placeholder ?? ""}
              onChange={(e) =>
                onChange({ ...config, placeholder: e.target.value })
              }
              placeholder="Champ simple d'aide"
            />
          </div>
        )}

        <div className="col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            id={`${config.name}-required`}
            checked={config.required ?? false}
            onChange={(e) =>
              onChange({ ...config, required: e.target.checked })
            }
            className="size-4"
          />
          <Label htmlFor={`${config.name}-required`}>Champ obligatoire</Label>
        </div>
      </div>

      {config.type === "select" && (
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <Label>Options</Label>
            <Button variant="outline" size="sm" onClick={handleAddOption}>
              <Icon name="plus" />
              Ajouter
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {config.options.map((option, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={option.value}
                  onChange={(e) =>
                    handleOptionChange(index, "value", e.target.value)
                  }
                  placeholder="Valeur"
                  className="flex-1"
                />
                <Input
                  value={option.label}
                  onChange={(e) =>
                    handleOptionChange(index, "label", e.target.value)
                  }
                  placeholder="Libellé"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveOption(index)}
                  disabled={config.options.length <= 1}
                  className="text-red-500"
                >
                  <Icon name="close" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {config.type === "number" && (
        <div className="mt-4 border-t pt-4 grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${config.name}-min`}>Minimum</Label>
            <Input
              id={`${config.name}-min`}
              type="number"
              value={config.min ?? ""}
              onChange={(e) =>
                onChange({
                  ...config,
                  min: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="Pas de minimum"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${config.name}-max`}>Maximum</Label>
            <Input
              id={`${config.name}-max`}
              type="number"
              value={config.max ?? ""}
              onChange={(e) =>
                onChange({
                  ...config,
                  max: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="Pas de maximum"
            />
          </div>
        </div>
      )}

      {config.type === "unit" && (
        <div className="mt-4 border-t pt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${config.name}-unit`}>Unité</Label>
            <select
              id={`${config.name}-unit`}
              value={config.unit}
              onChange={(e) => onChange({ ...config, unit: e.target.value })}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              {unitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${config.name}-min`}>Minimum</Label>
              <Input
                id={`${config.name}-min`}
                type="number"
                value={config.min ?? ""}
                onChange={(e) =>
                  onChange({
                    ...config,
                    min: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                placeholder="Pas de minimum"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${config.name}-max`}>Maximum</Label>
              <Input
                id={`${config.name}-max`}
                type="number"
                value={config.max ?? ""}
                onChange={(e) =>
                  onChange({
                    ...config,
                    max: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                placeholder="Pas de maximum"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${config.name}-description`}>
              Message descriptif
            </Label>
            <Input
              id={`${config.name}-description`}
              value={config.description ?? ""}
              onChange={(e) =>
                onChange({ ...config, description: e.target.value })
              }
              placeholder="Texte d'aide sous le champ"
            />
          </div>
        </div>
      )}

      {config.type === "switch" && (
        <div className="mt-4 border-t pt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${config.name}-description`}>
              Message descriptif
            </Label>
            <Input
              id={`${config.name}-description`}
              value={config.description ?? ""}
              onChange={(e) =>
                onChange({ ...config, description: e.target.value })
              }
              placeholder="Texte d'aide sous le champ"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldConfigurator;
