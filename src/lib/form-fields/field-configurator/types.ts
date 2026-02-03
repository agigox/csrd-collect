import type { DragControls } from "motion/react";
import type { FieldConfig, FieldType } from "../types";

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
}

export interface SpecificConfiguratorProps<
  T extends FieldConfig = FieldConfig,
> {
  config: T;
  onChange: (config: T) => void;
  onFieldTypeChange?: (type: FieldType) => void;
}

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
  switch: "share",
  date: "calendar-today",
  import: "upload",
};
