"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/lib/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/ui/popover";
import { Calendar } from "@/lib/ui/calendar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui/tooltip";
import Icon from "@/lib/Icons";
import { cn } from "@/lib/utils";
import type {
  FieldProps,
  FieldRegistration,
  DateFieldConfig,
} from "@/models/FieldTypes";

type DateValue = {
  date: string; // ISO date string
  time?: string; // "HH:mm" format
};

const DateField = ({
  config,
  value,
  onChange,
  error,
  readOnly = false,
}: FieldProps<DateFieldConfig>) => {
  const [open, setOpen] = useState(false);

  // Parse value
  const parseValue = (val: unknown): DateValue | null => {
    if (!val) return null;
    if (typeof val === "object" && val !== null) {
      const v = val as DateValue;
      return v.date ? v : null;
    }
    // Support legacy string format (ISO date)
    if (typeof val === "string") {
      return { date: val };
    }
    return null;
  };

  const dateValue = parseValue(value);
  const prevDefaultDateValue = useRef(config.defaultDateValue);

  // Apply default date value when config changes
  useEffect(() => {
    const prevValue = prevDefaultDateValue.current;
    const currentValue = config.defaultDateValue;

    // Only react to actual changes
    if (prevValue !== currentValue) {
      prevDefaultDateValue.current = currentValue;

      if (currentValue === "today") {
        onChange({ date: new Date().toISOString() });
      } else if (currentValue === "none") {
        onChange(undefined);
      }
    }
  }, [config.defaultDateValue, onChange]);

  const dateObj = dateValue?.date ? new Date(dateValue.date) : undefined;

  // Get default date based on config
  const getDefaultDate = (): Date | undefined => {
    if (config.defaultDateValue === "today") {
      return new Date();
    }
    return undefined;
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      const newValue: DateValue = {
        date: date.toISOString(),
        time: dateValue?.time,
      };
      onChange(newValue);
      if (!config.includeTime) {
        setOpen(false);
      }
    }
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    const time = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    const newValue: DateValue = {
      date: dateValue?.date || new Date().toISOString(),
      time,
    };
    onChange(newValue);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  // Parse time
  const parseTime = (
    timeStr?: string,
  ): { hours: number; minutes: number } | null => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    return { hours, minutes };
  };

  const timeValue = parseTime(dateValue?.time);

  // Format display
  const formatDisplay = (): string => {
    if (!dateObj) return "Date";

    let display = format(dateObj, "dd/MM/yyyy", { locale: fr });
    if (config.includeTime && timeValue) {
      display += ` ${timeValue.hours
        .toString()
        .padStart(2, "0")}h${timeValue.minutes.toString().padStart(2, "0")}`;
    }
    return display;
  };

  // Generate hours array (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  // Generate minutes array (0-59, every 5 minutes)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const labelContent = (
    <label htmlFor={config.name}>
      {config.label}
      {config.required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  return (
    <div className="flex flex-col gap-2">
      {config.description ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="w-fit cursor-help">{labelContent}</span>
          </TooltipTrigger>
          <TooltipContent>{config.description}</TooltipContent>
        </Tooltip>
      ) : (
        labelContent
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex h-8 w-full items-center justify-between rounded-md border px-3 py-1 text-sm shadow-inner cursor-pointer",
              error ? "border-red-500" : "border-gray-300",
              "hover:border-gray-400 transition-colors",
            )}
          >
            <span className={cn(dateObj ? "text-gray-900" : "text-gray-500")}>
              {formatDisplay()}
            </span>

            <div className="flex items-center gap-1">
              {dateObj && !readOnly && (
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
              <Icon name="calendar" size={16} color="#45494A" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col">
            <Calendar
              mode="single"
              selected={dateObj}
              onSelect={readOnly ? undefined : handleSelectDate}
              defaultMonth={dateObj || getDefaultDate()}
              locale={fr}
              initialFocus
              disabled={readOnly}
            />

            {/* Time selector - only shown if includeTime is true */}
            {config.includeTime && (
              <div className="border-t p-4">
                <div className="text-sm font-medium text-center mb-3">
                  {readOnly ? "Heure incluse" : "Sélectionner l'heure"}
                </div>
                <div className="flex gap-4 items-center justify-center">
                  {/* Hours selector */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500">Heures</span>
                    <div className="h-32 overflow-y-auto border rounded-md">
                      <div className="flex flex-col">
                        {hours.map((h) => (
                          <button
                            key={h}
                            type="button"
                            disabled={readOnly}
                            onClick={() =>
                              !readOnly &&
                              handleTimeChange(h, timeValue?.minutes ?? 0)
                            }
                            className={cn(
                              "px-4 py-1.5 text-sm transition-colors",
                              readOnly ? "cursor-default" : "hover:bg-gray-100",
                              timeValue?.hours === h &&
                                "bg-[#2964a0] text-white hover:bg-[#225082]",
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
                    <div className="h-32 overflow-y-auto border rounded-md">
                      <div className="flex flex-col">
                        {minutes.map((m) => (
                          <button
                            key={m}
                            type="button"
                            disabled={readOnly}
                            onClick={() =>
                              !readOnly &&
                              handleTimeChange(timeValue?.hours ?? 0, m)
                            }
                            className={cn(
                              "px-4 py-1.5 text-sm transition-colors",
                              readOnly ? "cursor-default" : "hover:bg-gray-100",
                              timeValue?.minutes === m &&
                                "bg-[#2964a0] text-white hover:bg-[#225082]",
                            )}
                          >
                            {m.toString().padStart(2, "0")}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {!readOnly && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setOpen(false)}
                    className="w-full mt-3"
                  >
                    Confirmer
                  </Button>
                )}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "date",
  component: DateField,
  defaultConfig: {},
};

export default DateField;
