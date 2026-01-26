"use client";

import { useState, useEffect } from "react";
import { Label } from "@/lib/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import { MultiSelect } from "@/lib/ui/multi-select";
import type { SelectFieldConfig, SelectOption } from "../../types";
import type { SpecificConfiguratorProps } from "../types";
import { LabelField } from "../common/LabelField";

// Type pour la structure des options dans db.json
interface DataSourceItem {
  key: string;
  label: string;
  items: SelectOption[];
}

interface DataTypeOption {
  label: string;
  data: DataSourceItem[];
}

interface OptionsData {
  [key: string]: DataTypeOption;
}

export const SelectConfigurator = ({
  config,
  onChange,
}: SpecificConfiguratorProps<SelectFieldConfig>) => {
  const [optionsData, setOptionsData] = useState<OptionsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les options depuis l'API au montage
  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:4000/options");
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        setOptionsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  // Obtenir les types de données disponibles
  const dataTypeOptions = optionsData
    ? Object.entries(optionsData).map(([key, value]) => ({
        value: key,
        label: value.label,
      }))
    : [];

  // Obtenir les sources de données disponibles pour le type sélectionné
  const dataSourceOptions =
    optionsData && config.dataType && optionsData[config.dataType]
      ? optionsData[config.dataType].data.map((item) => ({
          value: item.key,
          label: item.label,
        }))
      : [];

  // Gérer le changement de type de données
  const handleDataTypeChange = (value: string) => {
    onChange({
      ...config,
      dataType: value,
      dataSource: undefined,
      options: [],
      defaultIndex: 0,
    });
  };

  // Gérer le changement de source de données
  const handleDataSourceChange = (value: string) => {
    if (optionsData && config.dataType) {
      const dataType = optionsData[config.dataType];
      const dataSource = dataType?.data.find((d) => d.key === value);
      const items = dataSource?.items ?? [];

      onChange({
        ...config,
        dataSource: value,
        options: items,
        defaultIndex: undefined,
        defaultIndices: undefined,
      });
    }
  };

  const selectionMode = config.selectionMode ?? "single";
  const options = config.options ?? [];

  // Vérifier si une valeur par défaut est définie
  const hasDefaultValue =
    selectionMode === "single"
      ? config.defaultIndex !== undefined
      : config.defaultIndices !== undefined;

  // Gérer le toggle du checkbox "Définir une valeur par défaut"
  const handleToggleDefaultValue = () => {
    if (hasDefaultValue) {
      // Désactiver la valeur par défaut
      onChange({
        ...config,
        defaultIndex: undefined,
        defaultIndices: undefined,
      });
    } else {
      // Activer avec la première option par défaut
      if (selectionMode === "single") {
        onChange({
          ...config,
          defaultIndex: options.length > 0 ? 0 : undefined,
        });
      } else {
        onChange({ ...config, defaultIndices: [] });
      }
    }
  };

  // Gérer le changement de valeur par défaut (single)
  const handleDefaultSingleChange = (value: string) => {
    const index = options.findIndex((o) => o.value === value);
    onChange({ ...config, defaultIndex: index >= 0 ? index : undefined });
  };

  // Gérer le changement de valeurs par défaut (multiple)
  const handleDefaultMultipleChange = (values: string[]) => {
    const indices = values
      .map((v) => options.findIndex((o) => o.value === v))
      .filter((i) => i >= 0);
    onChange({ ...config, defaultIndices: indices });
  };

  // Obtenir la valeur actuelle pour le select single
  const currentDefaultSingleValue =
    config.defaultIndex !== undefined && options[config.defaultIndex]
      ? options[config.defaultIndex].value
      : "";

  // Obtenir les valeurs actuelles pour le multi-select
  const currentDefaultMultipleValues = (config.defaultIndices ?? [])
    .filter((i) => options[i])
    .map((i) => options[i].value);

  return (
    <div className="flex flex-col gap-3">
      <LabelField
        value={config.label}
        onChange={(label) => onChange({ ...config, label, isDuplicate: false })}
        isDuplicate={config.isDuplicate}
      />

      {/* Chargement ou erreur */}
      {isLoading && (
        <div className="text-sm text-gray-500">Chargement des options...</div>
      )}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {/* Type de donnée et Source de donnée */}
      {!isLoading && !error && (
        <div className="flex items-end gap-4">
          <div className="flex flex-col gap-1">
            <Label>Type de donnée</Label>
            <Select
              value={config.dataType ?? ""}
              onValueChange={handleDataTypeChange}
            >
              <SelectTrigger
                className="h-8 text-sm w-58.75"
                clearable
                hasValue={!!config.dataType}
                onClear={() => handleDataTypeChange("")}
              >
                <SelectValue placeholder="Sélectionner un type..." />
              </SelectTrigger>
              <SelectContent>
                {dataTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <Label>Source de donnée</Label>
            <Select
              value={config.dataSource ?? ""}
              onValueChange={handleDataSourceChange}
              disabled={!config.dataType}
            >
              <SelectTrigger
                className="h-8 text-sm"
                clearable
                hasValue={!!config.dataSource}
                onClear={() => handleDataSourceChange("")}
              >
                <SelectValue
                  placeholder={
                    config.dataType
                      ? "Sélectionner une source..."
                      : "Sélectionnez d'abord un type"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {dataSourceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      {/* Mode de sélection */}
      <div className="flex flex-col gap-2">
        <Label>Mode de sélection</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <button
              type="button"
              role="radio"
              aria-checked={selectionMode === "single"}
              onClick={() => onChange({ ...config, selectionMode: "single" })}
              className={`relative flex items-center justify-center size-4 rounded-full border-2 transition-colors ${
                selectionMode === "single"
                  ? "border-[#2964a0] bg-white"
                  : "border-[#737272] bg-white hover:border-[#225082]"
              }`}
            >
              {selectionMode === "single" && (
                <span className="size-2.5 rounded-full bg-[#2964a0]" />
              )}
            </button>
            <span className="text-sm">Choix unique</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <button
              type="button"
              role="radio"
              aria-checked={selectionMode === "multiple"}
              onClick={() => onChange({ ...config, selectionMode: "multiple" })}
              className={`relative flex items-center justify-center size-4 rounded-full border-2 transition-colors ${
                selectionMode === "multiple"
                  ? "border-[#2964a0] bg-white"
                  : "border-[#737272] bg-white hover:border-[#225082]"
              }`}
            >
              {selectionMode === "multiple" && (
                <span className="size-2.5 rounded-full bg-[#2964a0]" />
              )}
            </button>
            <span className="text-sm">Choix multiple</span>
          </label>
        </div>
      </div>

      {/* Définir une valeur par défaut */}
      {options.length > 0 && (
        <div className="flex flex-col gap-2">
          {!hasDefaultValue ? (
            <label className="flex items-center gap-2 cursor-pointer">
              <button
                type="button"
                role="checkbox"
                aria-checked={false}
                onClick={handleToggleDefaultValue}
                className="flex items-center justify-center size-4 rounded border-2 border-[#737272] bg-white hover:border-[#225082] transition-colors"
              />
              <span className="text-sm">Définir une valeur par défaut</span>
            </label>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                role="checkbox"
                aria-checked={true}
                onClick={handleToggleDefaultValue}
                className="flex items-center justify-center size-4 rounded border-2 border-[#2964a0] bg-[#2964a0] transition-colors shrink-0"
              >
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {selectionMode === "single" ? (
                <Select
                  value={currentDefaultSingleValue}
                  onValueChange={handleDefaultSingleChange}
                >
                  <SelectTrigger
                    className="h-8 text-sm flex-1"
                    clearable
                    hasValue={!!currentDefaultSingleValue}
                    onClear={() => handleDefaultSingleChange("")}
                  >
                    <SelectValue placeholder="Sélectionner une valeur par défaut..." />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <MultiSelect
                  options={options}
                  value={currentDefaultMultipleValues}
                  onChange={handleDefaultMultipleChange}
                  placeholder="Sélectionner des valeurs par défaut..."
                  className="flex-1"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectConfigurator;
