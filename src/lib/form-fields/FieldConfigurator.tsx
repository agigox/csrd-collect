"use client";

import { useRef } from "react";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { Button } from "@/lib/components/ui/button";
import Icon from "@/lib/Icons";
import type { FieldConfig, SelectOption } from "./types";
import { Divider } from "../Divider";

interface FieldConfiguratorProps {
  config: FieldConfig;
  onChange: (config: FieldConfig) => void;
  onRemove: () => void;
}

const typeLabels: Record<string, string> = {
  text: "Champ simple",
  number: "Nombre",
  select: "Liste déroulante",
  radio: "Choix unique",
  checkbox: "Case à cocher",
  unit: "Quantité avec unité",
  switch: "Interrupteur",
  calendar: "Date",
  time: "Heure",
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCsvImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (
      !file ||
      (config.type !== "select" &&
        config.type !== "radio" &&
        config.type !== "checkbox")
    )
      return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
      const newOptions: SelectOption[] = lines.map((line) => {
        // Support format: "value,label" or just "label"
        const parts = line.split(",").map((p) => p.trim());
        if (parts.length >= 2) {
          return { value: parts[0], label: parts[1] };
        }
        // If only one value, use it as both value and label
        const value = parts[0];
        return {
          value: value.toLowerCase().replace(/\s+/g, "_"),
          label: value,
        };
      });

      if (newOptions.length > 0) {
        if (config.type === "checkbox") {
          onChange({ ...config, options: newOptions, defaultIndices: [] });
        } else {
          onChange({ ...config, options: newOptions, defaultIndex: 0 });
        }
      }
    };
    reader.readAsText(file);

    // Reset input to allow re-importing the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddOption = () => {
    if (
      config.type === "select" ||
      config.type === "radio" ||
      config.type === "checkbox"
    ) {
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
    if (
      config.type === "select" ||
      config.type === "radio" ||
      config.type === "checkbox"
    ) {
      const newOptions = [...config.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      onChange({ ...config, options: newOptions });
    }
  };

  const handleRemoveOption = (index: number) => {
    if (
      (config.type === "select" ||
        config.type === "radio" ||
        config.type === "checkbox") &&
      config.options.length > 1
    ) {
      const newOptions = config.options.filter((_, i) => i !== index);
      // Also update defaultIndices for checkbox if needed
      if (config.type === "checkbox") {
        const newDefaultIndices = (config.defaultIndices ?? [])
          .filter((i) => i !== index)
          .map((i) => (i > index ? i - 1 : i));
        onChange({
          ...config,
          options: newOptions,
          defaultIndices: newDefaultIndices,
        });
      } else {
        onChange({ ...config, options: newOptions });
      }
    }
  };

  const handleSetDefaultOption = (index: number) => {
    if (config.type === "select" || config.type === "radio") {
      // Set the selected option as default without reordering
      onChange({ ...config, defaultIndex: index });
    }
  };

  const handleToggleDefaultOption = (index: number) => {
    if (config.type === "checkbox") {
      const currentDefaults = config.defaultIndices ?? [];
      const newDefaults = currentDefaults.includes(index)
        ? currentDefaults.filter((i) => i !== index)
        : [...currentDefaults, index];
      onChange({ ...config, defaultIndices: newDefaults });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* En-tête avec type et bouton supprimer */}
      <div className="flex justify-between items-center mb-2">
        <h2>{typeLabels[config.type]}</h2>

        <Button variant="ghost" size="icon" onClick={onRemove}>
          <Icon name="trash" size={20} color="var(--destructive)" />
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

      {/* Placeholder (pour text, number, calendar - pas pour select/radio/checkbox) */}
      {config.type !== "unit" &&
        config.type !== "switch" &&
        config.type !== "select" &&
        config.type !== "radio" &&
        config.type !== "checkbox" && (
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

      {/* Options pour les champs select, radio et checkbox */}
      {(config.type === "select" ||
        config.type === "radio" ||
        config.type === "checkbox") && (
        <div className="flex flex-col gap-3">
          {config.options.map((option, index) => {
            const isDefault =
              config.type === "checkbox"
                ? (config.defaultIndices ?? []).includes(index)
                : index === (config.defaultIndex ?? 0);
            return (
              <div key={index} className="flex flex-col gap-1 w-60">
                <Label>
                  Choix {index + 1}
                  {isDefault ? " - par défaut" : ""}
                </Label>
                <div className="flex gap-2 items-center">
                  {/* Radio ou Checkbox - cliquable pour définir comme défaut */}
                  <button
                    type="button"
                    onClick={() =>
                      config.type === "checkbox"
                        ? handleToggleDefaultOption(index)
                        : handleSetDefaultOption(index)
                    }
                    className={`flex items-center justify-center size-5 border-2 bg-white transition-colors ${
                      config.type === "radio" ? "rounded-full" : "rounded"
                    } ${
                      isDefault
                        ? "border-[#2964a0] cursor-pointer"
                        : "border-gray-300 hover:border-[#2964a0] cursor-pointer"
                    }`}
                    title={
                      config.type === "checkbox"
                        ? isDefault
                          ? "Retirer des valeurs par défaut"
                          : "Ajouter aux valeurs par défaut"
                        : isDefault
                        ? "Option par défaut"
                        : "Définir comme option par défaut"
                    }
                  >
                    {isDefault && config.type === "radio" && (
                      <span className="size-2.5 rounded-full bg-[#2964a0]" />
                    )}
                    {isDefault &&
                      (config.type === "select" ||
                        config.type === "checkbox") && (
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
          {/* Import CSV button */}
          <div className="flex items-center gap-2 mt-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleCsvImport}
              className="hidden"
            />
            <Button
              variant="import"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs"
            >
              Importer CSV
            </Button>
            {/*<span className="text-xs text-gray-500">
              Format: valeur,label ou label
            </span>
            <a
              href="/exemple-options.csv"
              download
              className="text-xs text-[#2964a0] hover:underline"
            >
              Exemple
            </a>*/}
          </div>
        </div>
      )}
      {/* Champ obligatoire */}
      <div className="flex flex-col">
        <Divider className="my-2 bg-border-divider" />
        <div className="flex justify-end">
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              role="switch"
              aria-checked={config.required ?? false}
              onClick={() =>
                onChange({ ...config, required: !config.required })
              }
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
              onClick={() =>
                onChange({ ...config, required: !config.required })
              }
            >
              Champ obligatoire
            </Label>
          </div>
        </div>
      </div>

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
