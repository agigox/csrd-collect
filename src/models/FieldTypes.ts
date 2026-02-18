export type FieldType =
  | "text"
  | "number"
  | "select"
  | "switch"
  | "date"
  | "radio"
  | "checkbox"
  | "import";

export interface BaseFieldConfig {
  id: string;
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | number | boolean | string[] | number[] | Date;
  description?: string;
  isDuplicate?: boolean;
  // Branching: child-side properties
  parentFieldId?: string;
  parentOptionValue?: string;
  branchingColor?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export type SelectionMode = "single" | "multiple";
export type DateDefaultValue = "none" | "today";

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  options: SelectOption[];
  defaultIndex?: number;
  defaultIndices?: number[];
  selectionMode?: SelectionMode;
  dataType?: string; // Clé du type de donnée (ex: "addresses", "users")
  dataSource?: string; // Clé de la source de donnée (ex: "cities", "postal_codes")
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  unit?: string;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: "text";
}

export interface SwitchFieldConfig extends BaseFieldConfig {
  type: "switch";
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: "date";
  includeTime?: boolean;
  defaultDateValue?: DateDefaultValue;
}

export interface RadioFieldConfig extends BaseFieldConfig {
  type: "radio";
  options: SelectOption[];
  defaultIndex?: number;
  // Branching: parent-side properties
  branchingEnabled?: boolean;
  branching?: Record<string, string[]>;
  branchingColors?: Record<string, string>;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox";
  options: SelectOption[];
  defaultIndices?: number[];
  // Branching: parent-side properties
  branchingEnabled?: boolean;
  branching?: Record<string, string[]>;
  branchingColors?: Record<string, string>;
}

export interface ImportFieldConfig extends BaseFieldConfig {
  type: "import";
  acceptedFormats?: string[];
  maxFileSize?: number; // in MB
}

export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | SelectFieldConfig
  | SwitchFieldConfig
  | DateFieldConfig
  | RadioFieldConfig
  | CheckboxFieldConfig
  | ImportFieldConfig;
