"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Label } from "@/lib/components/ui/label";
import { Button } from "@/lib/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/components/ui/popover";
import { Calendar } from "@/lib/components/ui/calendar";
import Icon from "@/lib/Icons";
import { cn } from "@/lib/utils";
import type {
  FieldProps,
  FieldRegistration,
  CalendarFieldConfig,
} from "../types";

const CalendarField = ({
  config,
  value,
  onChange,
  error,
}: FieldProps<CalendarFieldConfig>) => {
  const [open, setOpen] = useState(false);
  const dateValue = value ? new Date(value as string) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date.toISOString());
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

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
            <span className={cn(dateValue ? "text-gray-900" : "text-gray-500")}>
              {dateValue
                ? format(dateValue, "dd/MM/yyyy", { locale: fr })
                : config.placeholder || "Date"}
            </span>

            <div className="flex items-center gap-1">
              {dateValue && (
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
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleSelect}
            locale={fr}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "calendar",
  component: CalendarField,
  defaultConfig: {
    placeholder: "Date",
  },
};

export default CalendarField;
