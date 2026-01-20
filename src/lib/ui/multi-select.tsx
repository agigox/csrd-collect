"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";
import Icon from "@/lib/Icons";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  clearable?: boolean;
  error?: boolean;
}

function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Choisir une valeur",
  className,
  disabled = false,
  clearable = true,
  error = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const getDisplayText = () => {
    if (value.length === 0) {
      return placeholder;
    }
    if (value.length === 1) {
      const selected = options.find((o) => o.value === value[0]);
      return selected?.label ?? value[0];
    }
    return `${value.length} sélectionnés`;
  };

  const hasValue = value.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <div
          data-slot="multi-select-trigger"
          className={cn(
            "border-border-secondary data-placeholder:text-muted-foreground flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.14)] transition-[color,box-shadow] outline-none h-8 cursor-pointer",
            "hover:border-gray-400",
            error && "border-red-500",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
        >
          <span
            className={cn(
              "line-clamp-1",
              hasValue ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {getDisplayText()}
          </span>

          <div className="flex items-center gap-1">
            {clearable && hasValue && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange([]);
                  }
                }}
                className="pointer-events-auto rounded-full p-0.5 hover:bg-muted transition-colors cursor-pointer"
                aria-label="Effacer la sélection"
              >
                <Icon
                  name="reset"
                  size={14}
                  className="opacity-90 hover:opacity-100"
                />
              </span>
            )}
            <ChevronDownIcon
              className={cn(
                "size-4 opacity-50 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="flex flex-col py-1 max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleToggle(option.value)}
                className="flex items-center gap-3 px-3 py-1.5 hover:bg-accent transition-colors text-left"
              >
                {/* Checkbox */}
                <div
                  className={cn(
                    "flex items-center justify-center size-4 rounded border-2 transition-colors shrink-0",
                    isSelected
                      ? "border-[#2964a0] bg-[#2964a0]"
                      : "border-[#737272] bg-white"
                  )}
                >
                  {isSelected && (
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
                  )}
                </div>
                <span className="text-sm text-foreground">{option.label}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };
