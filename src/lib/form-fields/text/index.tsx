"use client";

import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/lib/ui/tooltip";
import type { FieldProps, FieldRegistration, TextFieldConfig } from "../types";

const TextField = ({
  config,
  value,
  onChange,
  error,
}: FieldProps<TextFieldConfig>) => {
  // Use default value from config if no value is set
  const defaultValue = (config.defaultValue as string) ?? "";
  const currentValue = value !== undefined && value !== "" ? (value as string) : defaultValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
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
      <Input
        id={config.name}
        name={config.name}
        type="text"
        value={currentValue}
        onChange={handleChange}
        aria-invalid={!!error}
        className={error ? "border-red-500" : ""}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "text",
  component: TextField,
  defaultConfig: {},
};

export default TextField;
