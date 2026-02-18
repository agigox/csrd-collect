import type { ComponentType } from "react";
import type { DragControls } from "motion/react";
import type { BaseFieldConfig, FieldConfig, FieldType } from "@/models/FieldTypes";

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
  isChildField?: boolean;
  branchingColor?: string;
  branchingNumber?: number;
  fieldIdentifier?: string;
  onDetach?: () => void;
}

export interface SpecificConfiguratorProps<
  T extends FieldConfig = FieldConfig,
> {
  config: T;
  onChange: (config: T) => void;
  onFieldTypeChange?: (type: FieldType) => void;
  schema?: FieldConfig[];
  fieldIdentifier?: string;
}
