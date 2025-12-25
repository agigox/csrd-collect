import type { ComponentType } from "react";

export type FieldType = "text" | "number" | "select";

export interface ValidationRule {
  type: "required" | "min" | "max" | "pattern";
  value?: number | string;
  message: string;
}

export interface BaseFieldConfig {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: unknown;
  validation?: ValidationRule[];
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  options: SelectOption[];
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: "text";
}

export type FieldConfig = TextFieldConfig | NumberFieldConfig | SelectFieldConfig;

export interface FieldProps<T extends FieldConfig = FieldConfig> {
  config: T;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

export interface FieldRegistration {
  type: FieldType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<FieldProps<any>>;
  defaultConfig: Partial<BaseFieldConfig>;
}
