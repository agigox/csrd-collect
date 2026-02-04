"use client";

import { Label } from "@/lib/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/lib/ui/tooltip";
import type { FieldProps, FieldRegistration, RadioFieldConfig } from "@/models/FieldTypes";

const RadioField = ({
  config,
  value,
  onChange,
  error,
}: FieldProps<RadioFieldConfig>) => {
  // Use default value from config if no value is set
  const options = config.options ?? [];
  const defaultValue =
    config.defaultIndex !== undefined && options[config.defaultIndex]
      ? options[config.defaultIndex].value
      : "";
  const currentValue = (value as string) ?? defaultValue;

  const handleChange = (optionValue: string) => {
    onChange(optionValue);
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
          const isSelected = currentValue === option.value;
          return (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {/* Radio Button */}
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleChange(option.value)}
                className={`relative flex items-center justify-center size-4 rounded-full border-2 transition-colors duration-200 ${
                  isSelected
                    ? "border-[#2964a0] bg-white"
                    : error
                    ? "border-[#de2048] bg-white group-hover:border-[#c81640]"
                    : "border-[#737272] bg-white group-hover:border-[#225082]"
                }`}
              >
                {/* Inner Fill */}
                {isSelected && (
                  <span
                    className={`size-[10px] rounded-full ${
                      error ? "bg-[#de2048]" : "bg-[#2964a0]"
                    }`}
                  />
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
  type: "radio",
  component: RadioField,
  defaultConfig: {},
};

export default RadioField;
