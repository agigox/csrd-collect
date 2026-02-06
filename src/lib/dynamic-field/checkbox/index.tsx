"use client";

import { Label } from "@/lib/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/lib/ui/tooltip";
import type {
  FieldProps,
  FieldRegistration,
  CheckboxFieldConfig,
} from "@/models/FieldTypes";

const CheckboxField = ({
  config,
  value,
  onChange,
  error,
  readOnly = false,
}: FieldProps<CheckboxFieldConfig>) => {
  // Use default values from config if no value is set
  const options = config.options ?? [];
  const getDefaultValues = (): string[] => {
    if (config.defaultIndices && config.defaultIndices.length > 0) {
      return config.defaultIndices
        .filter((idx) => options[idx])
        .map((idx) => options[idx].value);
    }
    return [];
  };

  const currentValues: string[] = Array.isArray(value)
    ? value
    : getDefaultValues();

  const handleToggle = (optionValue: string) => {
    if (currentValues.includes(optionValue)) {
      // Remove the value
      onChange(currentValues.filter((v) => v !== optionValue));
    } else {
      // Add the value
      onChange([...currentValues, optionValue]);
    }
  };

  const labelContent = (
    <Label>
      {config.label}
      {config.required && <span className="text-red-500 ml-1">*</span>}
    </Label>
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
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = currentValues.includes(option.value);
          return (
            <label
              key={option.value}
              className={`flex items-center gap-3 group ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            >
              {/* Checkbox */}
              <button
                type="button"
                role="checkbox"
                aria-checked={isSelected}
                onClick={() => !readOnly && handleToggle(option.value)}
                disabled={readOnly}
                className={`relative flex items-center justify-center size-4 rounded border-2 transition-colors duration-200 ${
                  readOnly
                    ? "cursor-default"
                    : ""
                } ${
                  isSelected
                    ? "border-[#2964a0] bg-[#2964a0]"
                    : error
                    ? "border-[#de2048] bg-white group-hover:border-[#c81640]"
                    : "border-[#737272] bg-white group-hover:border-[#225082]"
                }`}
              >
                {/* Checkmark */}
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
              </button>

              {/* Option Label */}
              <span className="text-sm text-[#201f1f] font-['Nunito_Sans',sans-serif]">
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "checkbox",
  component: CheckboxField,
  defaultConfig: {},
};

export default CheckboxField;
