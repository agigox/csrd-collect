import type { ComponentType } from "react";

export type FieldType = "text" | "number" | "select" | "unit" | "switch" | "calendar" | "radio";

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
  defaultIndex?: number;
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: "text";
}

export interface UnitFieldConfig extends BaseFieldConfig {
  type: "unit";
  unit: string;
  min?: number;
  max?: number;
  description?: string;
}

export interface SwitchFieldConfig extends BaseFieldConfig {
  type: "switch";
  description?: string;
}

export interface CalendarFieldConfig extends BaseFieldConfig {
  type: "calendar";
}

export interface RadioFieldConfig extends BaseFieldConfig {
  type: "radio";
  options: SelectOption[];
  defaultIndex?: number;
}

export type FieldConfig = TextFieldConfig | NumberFieldConfig | SelectFieldConfig | UnitFieldConfig | SwitchFieldConfig | CalendarFieldConfig | RadioFieldConfig;

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
