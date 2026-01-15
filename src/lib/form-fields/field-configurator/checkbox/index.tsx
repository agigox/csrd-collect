"use client";

import { useRef } from "react";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import { Button } from "@/lib/ui/button";
import type { CheckboxFieldConfig, SelectOption } from "../../types";
import type { SpecificConfiguratorProps } from "../types";

export const CheckboxConfigurator = ({
  config,
  onChange,
}: SpecificConfiguratorProps<CheckboxFieldConfig>) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        onChange({ ...config, options: newOptions, defaultIndices: [] });
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

  const handleToggleDefaultOption = (index: number) => {
    const currentDefaults = config.defaultIndices ?? [];
    const newDefaults = currentDefaults.includes(index)
      ? currentDefaults.filter((i) => i !== index)
      : [...currentDefaults, index];
    onChange({ ...config, defaultIndices: newDefaults });
  };

  return (
    <div className="flex flex-col gap-3">
      {(config.options ?? []).map((option, index) => {
        const isDefault = (config.defaultIndices ?? []).includes(index);
        return (
          <div key={index} className="flex flex-col gap-1 w-60">
            <Label>
              Choix {index + 1}
              {isDefault ? " - par défaut" : ""}
            </Label>
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={() => handleToggleDefaultOption(index)}
                className={`flex items-center justify-center size-5 border-2 bg-white transition-colors rounded ${
                  isDefault
                    ? "border-[#2964a0] cursor-pointer"
                    : "border-gray-300 hover:border-[#2964a0] cursor-pointer"
                }`}
                title={
                  isDefault
                    ? "Retirer des valeurs par défaut"
                    : "Ajouter aux valeurs par défaut"
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
      </div>
    </div>
  );
};

export default CheckboxConfigurator;
