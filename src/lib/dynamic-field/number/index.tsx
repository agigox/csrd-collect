"use client";

import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui/tooltip";
import type {
  FieldProps,
  FieldRegistration,
  NumberFieldConfig,
} from "@/models/FieldTypes";

const NumberField = ({
  config,
  value,
  onChange,
  error,
  readOnly = false,
}: FieldProps<NumberFieldConfig>) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.value === "" ? undefined : Number(e.target.value);
    onChange(numValue);
  };

  const labelContent = (
    <Label htmlFor={config.name}>
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
      <div className="flex items-center gap-2">
        <Input
          id={config.name}
          name={config.name}
          type="number"
          placeholder={config.placeholder}
          value={value !== undefined ? String(value) : ""}
          onChange={handleChange}
          readOnly={readOnly}
          aria-invalid={!!error}
          className={error ? "border-red-500 flex-1" : "flex-1"}
        />
        {config.unit && (
          <span className="text-sm font-medium text-gray-600 shrink-0">
            {config.unit}
          </span>
        )}
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "number",
  component: NumberField,
  defaultConfig: {},
};

export default NumberField;
