"use client";

import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import type { ImportFieldConfig } from "../../types";
import type { SpecificConfiguratorProps } from "../types";
import { LabelField } from "../common/LabelField";

const formatOptions = [
  { value: ".pdf", label: "PDF" },
  { value: ".doc,.docx", label: "Word" },
  { value: ".xls,.xlsx", label: "Excel" },
  { value: ".csv", label: "CSV" },
  { value: ".jpg,.jpeg,.png", label: "Images" },
];

export const ImportConfigurator = ({
  config,
  onChange,
}: SpecificConfiguratorProps<ImportFieldConfig>) => {
  const currentFormats = config.acceptedFormats ?? [];

  const handleFormatToggle = (format: string) => {
    const formats = format.split(",");
    const hasAnyFormat = formats.some((f) => currentFormats.includes(f));

    if (hasAnyFormat) {
      onChange({
        ...config,
        acceptedFormats: currentFormats.filter((f) => !formats.includes(f)),
      });
    } else {
      onChange({
        ...config,
        acceptedFormats: [...currentFormats, ...formats],
      });
    }
  };

  const isFormatSelected = (format: string) => {
    const formats = format.split(",");
    return formats.some((f) => currentFormats.includes(f));
  };

  return (
    <div className="flex flex-col gap-4">
      <LabelField
        value={config.label}
        onChange={(label) => onChange({ ...config, label })}
      />
      <div className="flex flex-col gap-2">
        <Label>Formats acceptés</Label>
        <div className="flex flex-wrap gap-2">
          {formatOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleFormatToggle(option.value)}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                isFormatSelected(option.value)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {currentFormats.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Tous les formats seront acceptés si aucun n&apos;est sélectionné
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label>Taille maximale (Mo)</Label>
        <Input
          type="number"
          value={config.maxFileSize ?? ""}
          onChange={(e) =>
            onChange({
              ...config,
              maxFileSize: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          placeholder="Pas de limite"
          className="h-8 text-sm w-40"
          min={1}
        />
      </div>
    </div>
  );
};

export default ImportConfigurator;
