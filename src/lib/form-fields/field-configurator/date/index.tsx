"use client";

import { Label } from "@/lib/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import Icon from "@/lib/Icons";
import type { DateFieldConfig } from "../../types";
import type { SpecificConfiguratorProps } from "../types";

const defaultDateOptions = [
  { value: "none", label: "Aucune" },
  { value: "today", label: "Date du jour" },
];

export const DateConfigurator = ({
  config,
  onChange,
}: SpecificConfiguratorProps<DateFieldConfig>) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Inclure l'heure */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            onChange({ ...config, includeTime: !config.includeTime })
          }
          className={`flex items-center justify-center size-5 border-2 bg-white transition-colors rounded ${
            config.includeTime
              ? "border-[#2964a0]"
              : "border-gray-300 hover:border-[#2964a0]"
          }`}
        >
          {config.includeTime && (
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
        <Label
          className="text-sm cursor-pointer"
          onClick={() =>
            onChange({ ...config, includeTime: !config.includeTime })
          }
        >
          Inclure l&apos;heure
        </Label>
      </div>

      {/* Valeur par défaut */}
      <div className="flex flex-col gap-1">
        <Label>Valeur par défaut</Label>
        <Select
          value={config.defaultDateValue ?? "none"}
          onValueChange={(value) =>
            onChange({
              ...config,
              defaultDateValue: value as "none" | "today",
            })
          }
        >
          <SelectTrigger className="h-8 text-sm w-58.75">
            <div className="flex items-center gap-2">
              <Icon name="calendar" size={16} color="#45494A" />
              <SelectValue placeholder="Sélectionner..." />
            </div>
          </SelectTrigger>
          <SelectContent>
            {defaultDateOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

    </div>
  );
};

export default DateConfigurator;
