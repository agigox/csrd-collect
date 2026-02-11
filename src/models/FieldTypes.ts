import type { ComponentType } from "react";
import type { DragControls } from "motion/react";

// ========================
// Field Types
// ========================

export type FieldType = "text" | "number" | "select" | "switch" | "date" | "radio" | "checkbox" | "import";

// ========================
// Validation
// ========================

export interface ValidationRule {
  type: "required" | "min" | "max" | "pattern";
  value?: number | string;
  message: string;
}

// ========================
// Base Field Config
// ========================

export interface BaseFieldConfig {
  id: string;
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: unknown;
  validation?: ValidationRule[];
  description?: string;
  isDuplicate?: boolean;
  // Branching: child-side properties
  parentFieldId?: string;
  parentOptionValue?: string;
  branchingColor?: string;
}

// ========================
// Options
// ========================

export interface SelectOption {
  value: string;
  label: string;
}

export type SelectionMode = "single" | "multiple";

// ========================
// Specific Field Configs
// ========================

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

export type DateDefaultValue = "none" | "today";

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

export type FieldConfig = TextFieldConfig | NumberFieldConfig | SelectFieldConfig | SwitchFieldConfig | DateFieldConfig | RadioFieldConfig | CheckboxFieldConfig | ImportFieldConfig;

// ========================
// Field Component Props
// ========================

export interface FieldProps<T extends FieldConfig = FieldConfig> {
  config: T;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  readOnly?: boolean;
}

export interface FieldRegistration {
  type: FieldType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<FieldProps<any>>;
  defaultConfig: Partial<BaseFieldConfig>;
}

// ========================
// Field Configurator Props
// ========================

export interface FieldConfiguratorProps {
  config: FieldConfig;
  onChange: (config: FieldConfig) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  isOpen?: boolean;
  onOpen?: () => void;
  dragControls?: DragControls;
  schema?: FieldConfig[];
  onBranchingCleanup?: () => void;
}

export interface SpecificConfiguratorProps<
  T extends FieldConfig = FieldConfig,
> {
  config: T;
  onChange: (config: T) => void;
  onFieldTypeChange?: (type: FieldType) => void;
  schema?: FieldConfig[];
}

// ========================
// UI Labels & Icons
// ========================

export const typeLabels: Record<string, string> = {
  text: "Champ libre",
  number: "Nombre",
  select: "Liste déroulante",
  radio: "Choix unique",
  checkbox: "Choix multiple",
  switch: "Switch",
  date: "Date",
  import: "Import de fichier",
};

export const typeIcons: Record<string, string> = {
  text: "chat",
  number: "chat",
  select: "list-alt",
  radio: "check-circle",
  checkbox: "checkbox",
  switch: "switch",
  date: "calendar-month",
  import: "upload",
};
