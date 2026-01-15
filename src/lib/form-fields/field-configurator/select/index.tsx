"use client";

import { useRef, useState } from "react";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import { Button } from "@/lib/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import type { SelectFieldConfig, SelectOption } from "../../types";
import type { SpecificConfiguratorProps } from "../types";

const dataTypeOptions = [{ value: "adresse", label: "Adresse" }];

export const SelectConfigurator = ({
  config,
  onChange,
}: SpecificConfiguratorProps<SelectFieldConfig>) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleFetchFromApi = async () => {
    if (!config.apiUrl) return;

    setIsLoadingApi(true);
    setApiError(null);

    try {
      const response = await fetch(config.apiUrl);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        const newOptions: SelectOption[] = data.map((item) => ({
          value: item.value ?? item.id ?? String(item),
          label: item.label ?? item.name ?? String(item),
        }));
        onChange({ ...config, options: newOptions, defaultIndex: 0 });
      } else {
        throw new Error("Format de données invalide");
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsLoadingApi(false);
    }
  };

  const handleCsvImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
      const newOptions: SelectOption[] = lines.map((line) => {
        const parts = line.split(",").map((p) => p.trim());
        if (parts.length >= 2) {
          return { value: parts[0], label: parts[1] };
        }
        const value = parts[0];
        return {
          value: value.toLowerCase().replace(/\s+/g, "_"),
          label: value,
        };
      });

      if (newOptions.length > 0) {
        onChange({ ...config, options: newOptions, defaultIndex: 0 });
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOptionChange = (
    index: number,
    field: keyof SelectOption,
    value: string
  ) => {
    const newOptions = [...(config.options ?? [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onChange({ ...config, options: newOptions });
  };

  const handleSetDefaultOption = (index: number) => {
    onChange({ ...config, defaultIndex: index });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Type de donnée et Source de donnée */}
      <div className="flex items-end gap-4">
        <div className="flex flex-col gap-1">
          <Label>Type de donnée</Label>
          <Select
            value={config.dataType ?? ""}
            onValueChange={(value) => onChange({ ...config, dataType: value })}
          >
            <SelectTrigger className="h-8 text-sm w-58.75">
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
          <div className="flex items-center gap-2">
            <Input
              value={config.apiUrl ?? ""}
              onChange={(e) => onChange({ ...config, apiUrl: e.target.value })}
              placeholder="lien api"
              className="h-8 text-sm flex-1"
            />
            <span className="text-sm text-muted-foreground">ou</span>
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
              className="text-xs h-8"
            >
              Importer un .csv
            </Button>
          </div>
        </div>
      </div>

      {/* Bouton pour charger depuis l'API */}
      {config.apiUrl && (
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleFetchFromApi}
            disabled={isLoadingApi}
            className="text-xs"
          >
            {isLoadingApi ? "Chargement..." : "Charger depuis l'API"}
          </Button>
          {apiError && <span className="text-xs text-red-500">{apiError}</span>}
        </div>
      )}

      {/* Affichage et édition des options */}
      {(config.options ?? []).map((option, index) => {
        const isDefault = index === (config.defaultIndex ?? 0);
        return (
          <div key={index} className="flex flex-col gap-1 w-60">
            <Label>
              Choix {index + 1}
              {isDefault ? " - par défaut" : ""}
            </Label>
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={() => handleSetDefaultOption(index)}
                className={`flex items-center justify-center size-5 border-2 bg-white transition-colors rounded ${
                  isDefault
                    ? "border-[#2964a0] cursor-pointer"
                    : "border-gray-300 hover:border-[#2964a0] cursor-pointer"
                }`}
                title={
                  isDefault
                    ? "Option par défaut"
                    : "Définir comme option par défaut"
                }
              >
                {isDefault && (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
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
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SelectConfigurator;
