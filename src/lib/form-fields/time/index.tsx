"use client";

import { useState } from "react";
import { Label } from "@/lib/components/ui/label";
import { Button } from "@/lib/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/components/ui/popover";
import Icon from "@/lib/Icons";
import { cn } from "@/lib/utils";
import type {
  FieldProps,
  FieldRegistration,
  TimeFieldConfig,
} from "../types";

const TimeField = ({
  config,
  value,
  onChange,
  error,
}: FieldProps<TimeFieldConfig>) => {
  const [open, setOpen] = useState(false);

  // Parse time value (format: "HH:mm")
  const parseTime = (val: unknown): { hours: number; minutes: number } | null => {
    if (!val || typeof val !== "string") return null;
    const [hours, minutes] = val.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    return { hours, minutes };
  };

  const timeValue = parseTime(value);

  const formatTime = (hours: number, minutes: number): string => {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const formatDisplayTime = (hours: number, minutes: number): string => {
    return `${hours.toString().padStart(2, "0")}h${minutes.toString().padStart(2, "0")}`;
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    onChange(formatTime(hours, minutes));
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  // Generate hours array (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  // Generate minutes array (0-59, every 5 minutes for convenience)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={config.name}>
        {config.label}
        {config.required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex h-8 w-full items-center justify-between rounded-md border px-3 py-1 text-sm shadow-inner cursor-pointer",
              error ? "border-red-500" : "border-gray-300",
              "hover:border-gray-400 transition-colors"
            )}
          >
            <span className={cn(timeValue ? "text-gray-900" : "text-gray-500")}>
              {timeValue
                ? formatDisplayTime(timeValue.hours, timeValue.minutes)
                : config.placeholder || "Heure"}
            </span>

            <div className="flex items-center gap-1">
              {timeValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6 rounded-full bg-gray-200 hover:bg-gray-300 p-0"
                  onClick={handleClear}
                >
                  <Icon name="close" size={12} color="#737272" />
                </Button>
              )}
              <Icon name="clock" size={16} color="#45494A" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="flex flex-col gap-4">
            <div className="text-sm font-medium text-center">
              Sélectionner l&apos;heure
            </div>
            <div className="flex gap-4 items-center justify-center">
              {/* Hours selector */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">Heures</span>
                <div className="h-40 overflow-y-auto border rounded-md">
                  <div className="flex flex-col">
                    {hours.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() =>
                          handleTimeChange(h, timeValue?.minutes ?? 0)
                        }
                        className={cn(
                          "px-4 py-2 text-sm hover:bg-gray-100 transition-colors",
                          timeValue?.hours === h && "bg-[#2964a0] text-white hover:bg-[#225082]"
                        )}
                      >
                        {h.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <span className="text-2xl font-bold text-gray-400">:</span>

              {/* Minutes selector */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">Minutes</span>
                <div className="h-40 overflow-y-auto border rounded-md">
                  <div className="flex flex-col">
                    {minutes.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() =>
                          handleTimeChange(timeValue?.hours ?? 0, m)
                        }
                        className={cn(
                          "px-4 py-2 text-sm hover:bg-gray-100 transition-colors",
                          timeValue?.minutes === m && "bg-[#2964a0] text-white hover:bg-[#225082]"
                        )}
                      >
                        {m.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={() => setOpen(false)}
              className="w-full"
            >
              Confirmer
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "time",
  component: TimeField,
  defaultConfig: {
    placeholder: "Heure",
  },
};

export default TimeField;
