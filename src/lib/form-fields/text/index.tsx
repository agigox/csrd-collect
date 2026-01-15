"use client";

import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import type { FieldProps, FieldRegistration, TextFieldConfig } from "../types";

const TextField = ({
  config,
  value,
  onChange,
  error,
}: FieldProps<TextFieldConfig>) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
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
        type="text"
        placeholder={config.placeholder}
        value={(value as string) ?? ""}
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
  defaultConfig: {
    placeholder: "",
  },
};

export default TextField;
