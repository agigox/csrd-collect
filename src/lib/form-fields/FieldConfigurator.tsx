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
  select: "Case à cocher",
  radio: "Choix unique",
  unit: "Quantité avec unité",
  switch: "Interrupteur",
  calendar: "Date",
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
    if (config.type === "select" || config.type === "radio") {
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
    if (config.type === "select" || config.type === "radio") {
      const newOptions = [...config.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      onChange({ ...config, options: newOptions });
    }
  };

  const handleRemoveOption = (index: number) => {
    if ((config.type === "select" || config.type === "radio") && config.options.length > 1) {
      const newOptions = config.options.filter((_, i) => i !== index);
      onChange({ ...config, options: newOptions });
    }
  };

  const handleSetDefaultOption = (index: number) => {
    if (config.type === "select" || config.type === "radio") {
      // Set the selected option as default without reordering
      onChange({ ...config, defaultIndex: index });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* En-tête avec type et bouton supprimer */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-base font-bold">{typeLabels[config.type]}</span>
        <Button
          variant="destructive"
          size="icon"
          onClick={onRemove}
          className="size-8"
        >
          <Icon name="trash" size={16} />
        </Button>
      </div>

      {/* Libellé du champ (Entête pour select) */}
      <div className="flex flex-col gap-1">
        <Label>Entête</Label>
        <Input
          value={config.label}
          onChange={(e) => onChange({ ...config, label: e.target.value })}
          placeholder={
            config.type === "select" ? "Nom de l'entête" : "Libellé affiché"
          }
          className="h-8 text-sm w-58.75"
        />
      </div>

      {/* Placeholder (pour text, number, calendar - pas pour select/radio) */}
      {config.type !== "unit" &&
        config.type !== "switch" &&
        config.type !== "select" &&
        config.type !== "radio" && (
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
        )}

      {/* Champ obligatoire */}
      <div className="flex justify-end">
        <div className="flex items-center gap-3 mt-2">
          <button
            type="button"
            role="switch"
            aria-checked={config.required ?? false}
            onClick={() => onChange({ ...config, required: !config.required })}
            className={`relative flex items-center h-6 w-10 rounded-full px-1 transition-colors duration-200 ${
              config.required
                ? "bg-[#2964a0] justify-end"
                : "bg-[#e1e1e0] border-2 border-[#737272] justify-start"
            }`}
          >
            <span
              className={`flex items-center justify-center size-4 rounded-full transition-all duration-200 ${
                config.required ? "bg-white" : "bg-white shadow-sm"
              }`}
            >
              {config.required && (
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="#2964a0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </button>
          <Label
            className="text-sm cursor-pointer"
            onClick={() => onChange({ ...config, required: !config.required })}
          >
            Champ obligatoire
          </Label>
        </div>
      </div>
      {/* Options pour les champs select et radio */}
      {(config.type === "select" || config.type === "radio") && (
        <div className="flex flex-col gap-3">
          {config.options.map((option, index) => {
            const isDefault = index === (config.defaultIndex ?? 0);
            return (
              <div key={index} className="flex flex-col gap-1">
                <Label>
                  Choix {index + 1}
                  {isDefault ? " - par défaut" : ""}
                </Label>
                <div className="flex gap-2 items-center">
                  {/* Radio ou Checkbox - cliquable pour définir comme défaut */}
                  <button
                    type="button"
                    onClick={() => handleSetDefaultOption(index)}
                    className={`flex items-center justify-center size-5 border-2 bg-white transition-colors ${
                      config.type === "radio" ? "rounded-full" : "rounded"
                    } ${
                      isDefault
                        ? "border-[#2964a0] cursor-default"
                        : "border-gray-300 hover:border-[#2964a0] cursor-pointer"
                    }`}
                    title={
                      isDefault
                        ? "Option par défaut"
                        : "Définir comme option par défaut"
                    }
                  >
                    {isDefault && config.type === "radio" && (
                      <span className="size-[10px] rounded-full bg-[#2964a0]" />
                    )}
                    {isDefault && config.type === "select" && (
                      <svg
                        width="12"
                        height="10"
                        viewBox="0 0 12 10"
                        fill="none"
                      >
                        <path
                          d="M1 5L4 8L11 1"
                          stroke="#2964a0"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                  <Input
                    value={option.label}
                    onChange={(e) =>
                      handleOptionChange(index, "label", e.target.value)
                    }
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 h-8 text-sm"
                  />
                  {/* Bouton + sur la dernière option */}
                  {index === config.options.length - 1 ? (
                    <Button
                      variant="default"
                      size="icon"
                      onClick={handleAddOption}
                      className="size-8"
                    >
                      <Icon name="plus" size={14} />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                      disabled={config.options.length <= 1}
                      className="size-8 text-gray-400 hover:text-red-500"
                    >
                      <Icon name="close" size={14} />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Min/Max pour les champs number */}
      {config.type === "number" && (
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
      )}

      {/* Options pour les champs unit */}
      {config.type === "unit" && (
        <div className="mt-2 pt-2 border-t flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>Unité</Label>
            <select
              value={config.unit}
              onChange={(e) => onChange({ ...config, unit: e.target.value })}
              className="h-8 w-full rounded border border-gray-300 px-2 py-1 text-sm"
            >
              {unitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
          <div className="flex flex-col gap-1">
            <Label>Message descriptif</Label>
            <Input
              value={config.description ?? ""}
              onChange={(e) =>
                onChange({ ...config, description: e.target.value })
              }
              placeholder="Texte d'aide sous le champ"
              className="h-8 text-sm"
            />
          </div>
        </div>
      )}

      {/* Description pour les champs switch */}
      {config.type === "switch" && (
        <div className="mt-2 pt-2 border-t">
          <div className="flex flex-col gap-1">
            <Label>Message descriptif</Label>
            <Input
              value={config.description ?? ""}
              onChange={(e) =>
                onChange({ ...config, description: e.target.value })
              }
              placeholder="Texte d'aide sous le champ"
              className="h-8 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldConfigurator;
