"use client";

import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import type { FieldProps, FieldRegistration, NumberFieldConfig } from "../types";

const NumberField = ({ config, value, onChange, error }: FieldProps<NumberFieldConfig>) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.value === "" ? undefined : Number(e.target.value);
    onChange(numValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={config.name}>
        {config.label}
        {config.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={config.name}
        name={config.name}
        type="number"
        placeholder={config.placeholder}
        value={value !== undefined ? String(value) : ""}
        onChange={handleChange}
        min={config.min}
        max={config.max}
        aria-invalid={!!error}
        className={error ? "border-red-500" : ""}
      />
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
